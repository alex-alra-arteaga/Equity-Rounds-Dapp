export const EQUITY_CAMPAIGN_CONTRACT_ADDRESS = "0x857E5aEc48bDe1cF3F3D5D07C8886a128A81C38D"
export const API_URL = "https://api.studio.thegraph.com/query/41909/ignota-protocol-v1/v0.0.1"
export const ABI = [
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
    "name": "EquityCampaign__InvalidCampaignID",
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
        "indexed": true,
        "internalType": "bytes32",
        "name": "infoCID",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "imgCID",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "nameCID",
        "type": "bytes32"
      }
    ],
    "name": "campaignInfo",
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
        "internalType": "bytes32",
        "name": "infoCID",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "imgCID",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "nameCID",
        "type": "bytes32"
      },
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
        "internalType": "uint96",
        "name": "sharesOwned",
        "type": "uint96"
      },
      {
        "internalType": "uint96",
        "name": "donated",
        "type": "uint96"
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