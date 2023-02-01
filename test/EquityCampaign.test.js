const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const {developmentChains, networkConfig} = require("../../helper-hardhat-config")

//run only on the local network
!developmentChains.includes(network.name) ? describe.skip : describe("EquityCampaign Unit Tests", async function () {
  describe("EqualityCampaign", function () {
    
  });
});
