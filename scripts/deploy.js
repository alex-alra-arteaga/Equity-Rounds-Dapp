const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config.js")
const { verify } = require("../utils/verify")
require("dotenv").config({ path: ".env" });

// const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")

async function main() {
  const { log } = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = network.config.chainId
  let equityCampaign

  if (!developmentChains.includes(network.name)) {
    const EquityCampaign = await ethers.getContractFactory("EquityCampaign")
    equityCampaign = await EquityCampaign.deploy()
    await equityCampaign.deployed()
    console.log("EquityCampaign deployed to: ", equityCampaign.address)
  } else {

  }

  if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await sleep(30000);
    log("Verifying...")
    await verify(equityCampaign.address)
  }
  log("-------------------------------------------------")
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Call the main function and catches if there are any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
