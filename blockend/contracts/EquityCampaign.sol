// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Depending on share be eligible to be in the DAO
import "hardhat/console.sol";

error EquityCampaign__SafetyCheck();
error EquityCampaign__FeeNotPayed();
error EquityCampaign__NotEnoughFundraiseGoal();
error EquityCampaign__ExceededAmountAvailable();
error EquityCampaign__InsufficientAmount();
error EquityCampaign__SellSharesFailed();
error EquityCampaign__InvalidCampaignID();
error EquityCampaign__NotFounder();
error EquityCampaign__HasNotEnded();
error EquityCampaign__IsNotRunning();
error EquityCampaign__InvalidInvestorID();
error EquityCampaign__InvalidAddress();

/**
 * @title EquityCampaign
 * @author Alex "Alra" Arteaga
 * @notice Transparent, secure and permissionless contract to crowdfund investing rounds, redistributing its equity among its investors
 * @dev Storage and logical implementation, website at: ""
 * @custom:experimental Proof of Concept Equity Round contract
 * @custom:legal-advice Smart contract is proof of the borrowing obligations the founder has with its investors,
 * if he doesn't deliver, it has an irl legal obligation
 */

contract EquityCampaign {

    uint256 public constant FEE = 0.01 ether;
    uint256 public s_numberCampaigns;

    // Investor data
    /**
     * @notice User can be an investor and get shares equivalent to the ETH invested
     * or either, a donator, doesn't get shares, but its info is stored, if the founder wants to recompense him
     * @dev Structured to only take 1 slot (32 bytes), which vastly reduces gas
     */
    struct Investor {
        uint64 investorID;
        uint96 sharesOwned;
        uint96 donated; // in wei
        // uint percentageOfBusiness;   backend calculated
        // uint amountInvested;         backend calculated
        // ContributionLevel level;     backend calculated
    }

    // Campaign data
    /// @dev Structured to only take 3 slots, which vastly reduces gas
    /// all fields money-related are in wei
    struct Campaign {
        bool init;
        address founder;
        uint8 percentageOfEquity; /* % of equity being selled */
        uint80 campaignID;
        uint88 donations;
        uint40 investors;
        uint40 sharesOffered;
        uint88 pricePerShare;
        uint64 sharesBought;
        uint64 creationTime;
        uint128 deadline;
        // uint fundraisingGoal;        backend calculated
        // uint amountRaised;           backend calculated
    }

    // mapping from the ID to its respective campaign
    mapping(uint => Campaign) public campaigns;
    // mapping from ID of campaign, to investor address, to its information
    mapping(uint => mapping (address => Investor)) public investorInfo;

    /**
     * @notice Events
     * @dev They're queried for frontend UI display, marked as indexed for easier query and gas reduction
     * It is necessary to do 2 events for campagin created due to the impractability of emitting the Campaign objecte, because it would be hashed
     */
    event campaignCreated01(address indexed founder, uint8 indexed percentageOfEquity, uint40 indexed sharesOffered);
    event campaignCreated02(uint88 indexed pricePerShare, uint64 indexed creationTime, uint128 indexed deadline);
    event contribution(address indexed contributor, uint indexed shares, uint indexed campaignID);
    event donationWithdrawed(address indexed withdrawer, uint indexed campaignID);
    event sharesSold(address indexed contributor, uint indexed shares, uint indexed campaignID);

    modifier isFounder(uint _campaignID) {
        if (!campaigns[_campaignID].init)
            revert  EquityCampaign__InvalidCampaignID();
        if (campaigns[_campaignID].founder != msg.sender)
            revert EquityCampaign__NotFounder();
        _;
    }

    modifier hasCampaignEnded(uint _campaignID) {
        if (block.timestamp < campaigns[_campaignID].deadline)
            revert EquityCampaign__HasNotEnded();
        _;
    }

    modifier isCampaignRunning(uint _campaignID) {
        if (!campaigns[_campaignID].init)
            revert  EquityCampaign__InvalidCampaignID();
        if (block.timestamp > campaigns[_campaignID].deadline)
            revert EquityCampaign__IsNotRunning();
        _;
    }

    /**
     * @notice You can use this function to create the desired campaign
     * @dev Future implementation could add floating fixed point capabilities
     * @param _percentageOfEquity: percentage as of total the business whants to publicly sale
     * @param _sharesOffered: amount of shares on sale
     * @param _pricePerShare: cost in wei for each one
     * @param _deadline: representation in unix time of campaign termination
     */
    function createCampaign(
        uint8 _percentageOfEquity,
        uint40 _sharesOffered,
        uint88 _pricePerShare,
        uint128 _deadline
    ) public payable {
        if (msg.value < FEE)
            revert EquityCampaign__FeeNotPayed();
        if (_sharesOffered == 0 || _pricePerShare == 0 || _deadline < block.timestamp
        || _percentageOfEquity == 0 || _percentageOfEquity >= 100)
            revert EquityCampaign__SafetyCheck();
        s_numberCampaigns++;
        campaigns[s_numberCampaigns] = Campaign({
            init: true,
            founder: msg.sender,
            campaignID: uint80(s_numberCampaigns),
            donations: 0,
            investors: 0,
            percentageOfEquity: _percentageOfEquity,
            sharesOffered: _sharesOffered,
            pricePerShare: _pricePerShare,
            sharesBought: 0,
            creationTime: uint64(block.timestamp),
            deadline: _deadline
        });
        emit campaignCreated01(msg.sender, _percentageOfEquity, _sharesOffered);
        emit campaignCreated02(_pricePerShare, uint64(block.timestamp), _deadline);
    }

    /**
     * @notice Implementation to buy shares to the desired campaign,
     * you can choose to get (Investor) or not the shares (Donator)
     * Be careful, if you pay for more than what corresponds for the amount you'll lose that eth
     * @param _amount: Number of shares intended to buy
     * @param _campaignID: Desired campaignID
     * @param isInvestor: True --> Investor (gets the shares), false --> donator (no shares)
     */
    function contributeToCampaign(
        uint64 _amount,
        uint80 _campaignID,
        bool isInvestor
    ) public payable isCampaignRunning(_campaignID) {
        if (isInvestor && _amount * campaigns[_campaignID].pricePerShare > msg.value)
            revert EquityCampaign__InsufficientAmount();
        if (isInvestor && campaigns[_campaignID].sharesOffered < (campaigns[_campaignID].sharesBought + _amount))
            revert EquityCampaign__ExceededAmountAvailable();
        if (investorInfo[_campaignID][msg.sender].investorID == 0) {
            investorInfo[_campaignID][msg.sender].investorID = campaigns[_campaignID].investors + 1;
            campaigns[_campaignID].investors++;
        }
        if (isInvestor) {
            investorInfo[_campaignID][msg.sender].sharesOwned += _amount;
            campaigns[_campaignID].sharesBought += _amount;
        } else {
            investorInfo[_campaignID][msg.sender].donated = uint96(msg.value);
            campaigns[_campaignID].donations += uint88(msg.value);
        }
        emit contribution(msg.sender, _amount, _campaignID);
    }

    // @notice: Allows the funder of its campaign to withdraw all the donations when the campaign is ended
    function withdrawDonations(uint80 _campaignID) public isFounder(_campaignID) hasCampaignEnded(_campaignID) {
        uint value = campaigns[_campaignID].donations;
        campaigns[_campaignID].donations = 0;
        (bool sent, ) = msg.sender.call{value: value}("");
        if (!sent)
            revert EquityCampaign__SellSharesFailed();
        emit donationWithdrawed(msg.sender, _campaignID);
    }

    // @notice: Allows the particular to sell a desired amount of shares of an specific campaign
    function sellShares(uint64 _amount, uint80 _campaignID) public isCampaignRunning(_campaignID) {
        if (_amount > investorInfo[_campaignID][msg.sender].sharesOwned || _amount == 0)
            revert EquityCampaign__SafetyCheck();
        investorInfo[_campaignID][msg.sender].sharesOwned -= _amount;
        campaigns[_campaignID].sharesBought -= _amount;
        (bool sent, ) = msg.sender.call{value: _amount * campaigns[_campaignID].pricePerShare}("");
        if (!sent)
            revert EquityCampaign__SellSharesFailed();
        emit sharesSold(msg.sender, _amount, _campaignID);
    }

    // @notice: Allows the founder of the campaign to sell a desired amount of shares once the campaign ends, investors shares info are not modified
    function sellSharesFounder(uint64 _amount, uint80 _campaignID) public isFounder(_campaignID) hasCampaignEnded(_campaignID) {
        if (!campaigns[_campaignID].init)
            revert  EquityCampaign__InvalidCampaignID();
        if (_amount > campaigns[_campaignID].sharesBought || _amount == 0)
            revert EquityCampaign__SafetyCheck();
        campaigns[_campaignID].sharesBought -= _amount;
        (bool sent, ) = msg.sender.call{value: _amount * campaigns[_campaignID].pricePerShare}("");
        if (!sent)
            revert EquityCampaign__SellSharesFailed();
        emit sharesSold(msg.sender, _amount, _campaignID);
    }

    // @notice: Allows the funder of a respective campaign to change its ownership
    function transferFounderOwnership(address newFounder, uint80 _campaignID) public isFounder(_campaignID) {
        if (newFounder == address(0))
            revert EquityCampaign__SafetyCheck();
        campaigns[_campaignID].founder = newFounder;
    }

    /// @custom:to-consider A future implementation with a function call to 'delete' very old campaigns data or investors with current 0 shares amount, for up to 75% gas refund 

    /* getter functions */
    function getCampaign(uint _campaignID) public view returns (Campaign memory) {
        if (!campaigns[_campaignID].init)
            revert EquityCampaign__InvalidCampaignID();
        return campaigns[_campaignID];
    }

    function getInvestor(uint _campaignID, address investor) public view returns (Investor memory) {
        if (investorInfo[_campaignID][investor].investorID == 0)
            revert EquityCampaign__InvalidInvestorID();
        if (investor == address(0))
            revert EquityCampaign__InvalidAddress();
        return investorInfo[_campaignID][investor];
    }

    receive() external payable {}

    fallback() external payable {}
}
