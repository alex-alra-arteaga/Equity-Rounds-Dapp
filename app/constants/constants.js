export const EQUITY_CAMPAIGN_CONTRACT_ADDRESS = "0xC5d475De9dfafda6d08ac6Be958F29e88A87e439"
export const abi = [
    {
      "inputs": [],
      "name": "EquityCampaign__ExceededAmountAvailable",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__FeeNotPayed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__HasNotEnded",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__InsufficientAmount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__InvalidAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__InvalidCampaignID",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__InvalidInvestorID",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__IsNotRunning",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__NotFounder",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__SafetyCheck",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EquityCampaign__SellSharesFailed",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "bool",
              "name": "init",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "founder",
              "type": "address"
            },
            {
              "internalType": "uint8",
              "name": "percentageOfEquity",
              "type": "uint8"
            },
            {
              "internalType": "uint80",
              "name": "campaignID",
              "type": "uint80"
            },
            {
              "internalType": "uint88",
              "name": "donations",
              "type": "uint88"
            },
            {
              "internalType": "uint40",
              "name": "investors",
              "type": "uint40"
            },
            {
              "internalType": "uint40",
              "name": "sharesOffered",
              "type": "uint40"
            },
            {
              "internalType": "uint88",
              "name": "pricePerShare",
              "type": "uint88"
            },
            {
              "internalType": "uint64",
              "name": "sharesBought",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "creationTime",
              "type": "uint64"
            },
            {
              "internalType": "uint128",
              "name": "deadline",
              "type": "uint128"
            }
          ],
          "indexed": true,
          "internalType": "struct EquityCampaign.Campaign",
          "name": "campaign",
          "type": "tuple"
        }
      ],
      "name": "campaignCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "contributor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "shares",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "campaignID",
          "type": "uint256"
        }
      ],
      "name": "contribution",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "withdrawer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "campaignID",
          "type": "uint256"
        }
      ],
      "name": "donationWithdrawed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "contributor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "shares",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "campaignID",
          "type": "uint256"
        }
      ],
      "name": "sharesSold",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "FEE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "campaigns",
      "outputs": [
        {
          "internalType": "bool",
          "name": "init",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "founder",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "percentageOfEquity",
          "type": "uint8"
        },
        {
          "internalType": "uint80",
          "name": "campaignID",
          "type": "uint80"
        },
        {
          "internalType": "uint88",
          "name": "donations",
          "type": "uint88"
        },
        {
          "internalType": "uint40",
          "name": "investors",
          "type": "uint40"
        },
        {
          "internalType": "uint40",
          "name": "sharesOffered",
          "type": "uint40"
        },
        {
          "internalType": "uint88",
          "name": "pricePerShare",
          "type": "uint88"
        },
        {
          "internalType": "uint64",
          "name": "sharesBought",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "creationTime",
          "type": "uint64"
        },
        {
          "internalType": "uint128",
          "name": "deadline",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_amount",
          "type": "uint64"
        },
        {
          "internalType": "uint80",
          "name": "_campaignID",
          "type": "uint80"
        },
        {
          "internalType": "bool",
          "name": "isInvestor",
          "type": "bool"
        }
      ],
      "name": "contributeToCampaign",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_percentageOfEquity",
          "type": "uint8"
        },
        {
          "internalType": "uint40",
          "name": "_sharesOffered",
          "type": "uint40"
        },
        {
          "internalType": "uint88",
          "name": "_pricePerShare",
          "type": "uint88"
        },
        {
          "internalType": "uint128",
          "name": "_deadline",
          "type": "uint128"
        }
      ],
      "name": "createCampaign",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_campaignID",
          "type": "uint256"
        }
      ],
      "name": "getCampaign",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bool",
              "name": "init",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "founder",
              "type": "address"
            },
            {
              "internalType": "uint8",
              "name": "percentageOfEquity",
              "type": "uint8"
            },
            {
              "internalType": "uint80",
              "name": "campaignID",
              "type": "uint80"
            },
            {
              "internalType": "uint88",
              "name": "donations",
              "type": "uint88"
            },
            {
              "internalType": "uint40",
              "name": "investors",
              "type": "uint40"
            },
            {
              "internalType": "uint40",
              "name": "sharesOffered",
              "type": "uint40"
            },
            {
              "internalType": "uint88",
              "name": "pricePerShare",
              "type": "uint88"
            },
            {
              "internalType": "uint64",
              "name": "sharesBought",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "creationTime",
              "type": "uint64"
            },
            {
              "internalType": "uint128",
              "name": "deadline",
              "type": "uint128"
            }
          ],
          "internalType": "struct EquityCampaign.Campaign",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_campaignID",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "investor",
          "type": "address"
        }
      ],
      "name": "getInvestor",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "investorID",
              "type": "uint64"
            },
            {
              "internalType": "uint160",
              "name": "sharesOwned",
              "type": "uint160"
            },
            {
              "internalType": "uint160",
              "name": "donated",
              "type": "uint160"
            }
          ],
          "internalType": "struct EquityCampaign.Investor",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "investorInfo",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "investorID",
          "type": "uint64"
        },
        {
          "internalType": "uint160",
          "name": "sharesOwned",
          "type": "uint160"
        },
        {
          "internalType": "uint160",
          "name": "donated",
          "type": "uint160"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "s_numberCampaigns",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_amount",
          "type": "uint64"
        },
        {
          "internalType": "uint80",
          "name": "_campaignID",
          "type": "uint80"
        }
      ],
      "name": "sellShares",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_amount",
          "type": "uint64"
        },
        {
          "internalType": "uint80",
          "name": "_campaignID",
          "type": "uint80"
        }
      ],
      "name": "sellSharesFounder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newFounder",
          "type": "address"
        },
        {
          "internalType": "uint80",
          "name": "_campaignID",
          "type": "uint80"
        }
      ],
      "name": "transferFounderOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint80",
          "name": "_campaignID",
          "type": "uint80"
        }
      ],
      "name": "withdrawDonations",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]