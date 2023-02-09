const { expect, assert } = require("chai");
const { parseEther } = require('ethers/lib/utils')
const { getNamedAccounts, ethers, network } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers")
const {developmentChains, networkConfig} = require("../helper-hardhat-config")

!developmentChains.includes(network.name) ? describe.skip : describe("EquityCampaign Unit Tests", async function () {
  // put global changing variables
  async function EquityCampaignFixture() {
    const deployer = (await getNamedAccounts()).deployer
    const fee = ethers.utils.parseEther("0.01")
    const lessFee = ethers.utils.parseEther("0.0009")
    const cost1 = ethers.utils.parseEther("0.1");
    const cost2 = ethers.utils.parseEther("162");
    const [founder, investor1, investor2, donator] = await ethers.getSigners()
    const EquityCampaign = await ethers.getContractFactory("EquityCampaign")
    const equityCampaign = await EquityCampaign.deploy()
    await equityCampaign.deployed()
    
    return { equityCampaign, founder, investor1, investor2, donator, fee, lessFee, cost1, cost2, deployer }
  }

  describe("createCampaign", function() {
    // The deadline should be incremented by at least more than 20 minutes from the actual time, because the block confirmation is at ~12 minutes
    it("reverts on invalid arguments", async function() {
      const { equityCampaign, fee, lessFee } = await loadFixture(EquityCampaignFixture);
      const tests = [
        // percentageOfEquity == 0
        { arguments: ["qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 0, 100, 20, Math.floor(Date.now()/1000) + 100, {value: fee}], error: "EquityCampaign__SafetyCheck" },
        // percentageOfEquity > 100
        { arguments: ["qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 101, 100, 20, Math.floor(Date.now()/1000) + 100, {value: fee}], error: "EquityCampaign__SafetyCheck" },
        // sharesOffered == 0
        { arguments: ["qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 0, 20, Math.floor(Date.now()/1000) + 100, {value: fee}], error: "EquityCampaign__SafetyCheck" },
        // pricePerShare == 0
        { arguments: ["qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, 0, Math.floor(Date.now()/1000) + 100, {value: fee}], error: "EquityCampaign__SafetyCheck" },
        // deadline < block.timestamp
        { arguments: ["qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, 20, Math.floor(Date.now()/1000) - 10, {value: fee}], error: "EquityCampaign__SafetyCheck" },
        // msg.value < fee
        { arguments: ["qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 85, 985, 20, Math.floor(Date.now()/1000) + 100, {value: lessFee}], error: "EquityCampaign__FeeNotPayed" },
      ];
      for (const test of tests) {
        expect(equityCampaign.createCampaign(...test.arguments)).to.be.revertedWithCustomError(
          equityCampaign,
          test.error
        );
      }
    })
    it("emits Campaign object in event", async () => {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const timestampBefore = blockBefore.timestamp;
      const {equityCampaign, fee, deployer} = await loadFixture(EquityCampaignFixture)
      const tx = await equityCampaign.createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, 20, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await expect(tx).to.emit(equityCampaign, "campaignInfo").withArgs("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR")
    })
    it("saves state of campaign", async () => {
      const {equityCampaign, fee, deployer} = await loadFixture(EquityCampaignFixture)
      equityCampaign.createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, 20, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      const state = await equityCampaign.campaigns(1)
      assert.equal(state.init, true)
      assert.equal(state.founder, deployer)
      assert.equal(state.percentageOfEquity, 20)
      assert.equal(state.pricePerShare, 20)
    })
  })
  describe("contributeToCampaign", function() {
    it("reverts on invalid values", async () => {
      const { equityCampaign, cost1, cost2, fee } = await loadFixture(EquityCampaignFixture);
      equityCampaign.createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, 20, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      const tests = [
        { arguments: [10, 0, true, {value: 0}], error: "EquityCampaign__InvalidCampaignID" },
        { arguments: [10, 2, true,  {value: 0}], error: "EquityCampaign__InvalidCampaignID" },
        { arguments: [10, 1, true, {value: cost1}], error: "EquityCampaign__InsufficientAmount" },
        { arguments: [81, 1, false, {value: cost1}], error: "EquityCampaign__InsufficientAmount" },
        { arguments: [81, 1, true, {value: cost2}], error: "EquityCampaign__ExceededAmountAvailable" },
      ];
      for (const test of tests) {
        expect(equityCampaign.contributeToCampaign(...test.arguments)).to.be.revertedWithCustomError(
          equityCampaign,
          test.error
        );
      }
    })
    it("doesn't buy shares when is donator", async () => {
      const amount = ethers.utils.parseEther("3.5")
      const {equityCampaign, fee, deployer} = await loadFixture(EquityCampaignFixture)
      await equityCampaign.createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, 20, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await equityCampaign.contributeToCampaign(100, 1, false, {value: amount})
      const campaign = await equityCampaign.campaigns(1)
      const investor = await equityCampaign.investorInfo(1, deployer)
      expect(campaign.sharesBought).to.equal(0)
      expect(campaign.donations).to.equal(amount)
      expect(investor.sharesOwned).to.equal(0);
      expect(investor.donated).to.equal(amount)
    })
    it("buys shares when is investor", async () => {
      const amount = ethers.utils.parseEther("3.5")
      const {equityCampaign, fee, deployer} = await loadFixture(EquityCampaignFixture)
      await equityCampaign.createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, 20, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await equityCampaign.contributeToCampaign(100, 1, true, {value: amount})
      const campaign = await equityCampaign.campaigns(1)
      const investor = await equityCampaign.investorInfo(1, deployer)
      expect(campaign.sharesBought).to.equal(100)
      expect(campaign.donations).to.equal(0)
      expect(investor.sharesOwned).to.equal(100)
    })
  })
  describe("withdrawDonations", async () => {
    it("reverts if the caller is not owner of the campaign", async () => {
      const { equityCampaign, founder, investor1, fee, cost1, cost2 } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, cost1, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await equityCampaign.contributeToCampaign(16, 1, true, {value: cost2})
      await expect(equityCampaign.connect(investor1).withdrawDonations(1)).to.be.revertedWithCustomError(
        equityCampaign,
        "EquityCampaign__NotFounder"
      )
    })
    it("reverts if campaign has not ended", async () => {
      const { equityCampaign, founder, fee, cost1, cost2 } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, cost1, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await equityCampaign.contributeToCampaign(100, 1, false, {value: cost2})
      await expect(equityCampaign.connect(founder).withdrawDonations(1)).to.be.rejectedWith(
        equityCampaign,
        "EquityCampaign__HasNotEnded"
      )
    })
    it("all donations are withdrawed", async () => {
      const { equityCampaign, founder, fee, cost2 } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, fee, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await equityCampaign.contributeToCampaign(100, 1, false, {value: cost2})
      const campaign = await equityCampaign.campaigns(1)
      expect(campaign.donations).to.equal(cost2)
      await network.provider.send("evm_setNextBlockTimestamp", [162509760000])
      const balance_before = await founder.getBalance()
      await equityCampaign.connect(founder).withdrawDonations(1)
      const campaign_after = await equityCampaign.campaigns(1)
      expect(campaign_after.donations).to.equal(0)
      const balance_after = await founder.getBalance()
      // there are losses with gas that are difficult to calculate
      const operationAccuracy = balance_after.sub(cost2) / balance_before
      assert(operationAccuracy > 0.999 || operationAccuracy < 0.999)
    })
  })
  describe("sellShares", async() => {
    it("reverts if campaign has ended or if it doesn't exist", async () => {
      const { equityCampaign, founder, fee } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, fee, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await network.provider.send("evm_setNextBlockTimestamp", [162509760000])
      await expect(equityCampaign.sellShares(2, 1)).to.be.revertedWithCustomError(
        equityCampaign,
        "EquityCampaign__IsNotRunning"
      )
      await expect(equityCampaign.sellShares(2, 2)).to.be.revertedWithCustomError(
        equityCampaign,
        "EquityCampaign__InvalidCampaignID"
      )
    })
    it("reverts if he doesn't have the amount of shares or if the intended amount to sell is 0", async () => {
      const { equityCampaign, founder, fee, investor1, cost1, cost2 } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, cost1, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await equityCampaign.connect(investor1).contributeToCampaign(100, 1, false, {value: cost2})
      await expect(equityCampaign.sellShares(1, 1)).to.be.rejectedWith(
        equityCampaign,
        "EquityCampaign__SafetyCheck"
      )
      await expect(equityCampaign.sellShares(0, 1)).to.be.rejectedWith(
        equityCampaign,
        "EquityCampaign__SafetyCheck"
      )
    })
    it("substracts correctly the amount of shares sold and sends the corresponding balance of the shares to the investor", async () => {
      const amountSold = 90
      const { equityCampaign, founder, investor1, fee, cost2 } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, fee, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await equityCampaign.connect(investor1).contributeToCampaign(100, 1, true, {value: cost2})
      const balance_before = await investor1.getBalance()
      await equityCampaign.connect(investor1).sellShares(amountSold, 1)
      const campaign = await equityCampaign.campaigns(1)
      const investor = await equityCampaign.investorInfo(1, investor1.address)
      assert.equal(campaign.sharesBought, 10)
      assert.equal(investor.sharesOwned, 10)
      const balance_after = await investor1.getBalance()
      const operationAccuracy = balance_after.sub(balance_before) / amountSold * campaign.pricePerShare
      assert(operationAccuracy > 0.999 || operationAccuracy < 0.999)
    })
  })
  describe("sellSharesFounder", async () => {
    it("reverts if the caller is not the founder", async () => {
      const { equityCampaign, founder, fee, investor1 } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, fee, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await network.provider.send("evm_setNextBlockTimestamp", [162509760000])
      await expect(equityCampaign.connect(investor1).sellSharesFounder(2, 1)).to.be.revertedWithCustomError(
        equityCampaign,
        "EquityCampaign__NotFounder"
      )
    })
    it("reverts if campaign has not ended or if it doesn't exist", async () => {
      const { equityCampaign, founder, fee } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, fee, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await expect(equityCampaign.sellSharesFounder(2, 1)).to.be.revertedWithCustomError(
        equityCampaign,
        "EquityCampaign__HasNotEnded"
      )
      await expect(equityCampaign.sellSharesFounder(2, 2)).to.be.revertedWithCustomError(
        equityCampaign,
        "EquityCampaign__InvalidCampaignID"
      )
    })
    it("substracts correctly the amount of shares sold and sends the corresponding balance of the shares to the investor", async () => {
      const amountSold = 90
      const { equityCampaign, founder, investor1, fee, cost2 } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, fee, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await equityCampaign.connect(investor1).contributeToCampaign(100, 1, true, {value: cost2})
      const balance_before = await founder.getBalance()
      await network.provider.send("evm_setNextBlockTimestamp", [162509760000])
      await equityCampaign.connect(founder).sellSharesFounder(amountSold, 1)
      const campaign = await equityCampaign.campaigns(1)
      assert.equal(campaign.sharesBought, 10)
      const balance_after = await founder.getBalance()
      const operationAccuracy = balance_after.sub(balance_before) / amountSold * campaign.pricePerShare
      assert(operationAccuracy > 0.999 || operationAccuracy < 0.999)
    })
  })
  describe("transferFounderOwnership", async () => {
    it("transfers correctly the ownership of the campaign", async () => {
      const { equityCampaign, founder, investor1, fee, cost2 } = await loadFixture(EquityCampaignFixture)
      await equityCampaign.connect(founder).createCampaign("qsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR", 20, 100, fee, Math.floor(Date.now() / 1000) + 10000, {value: fee})
      await equityCampaign.connect(investor1).contributeToCampaign(100, 1, true, {value: cost2})
      await expect(equityCampaign.connect(investor1).transferFounderOwnership(investor1.address, 1)).to.be.revertedWithCustomError(
        equityCampaign,
        "EquityCampaign__NotFounder"
      )
      await equityCampaign.connect(founder).transferFounderOwnership(investor1.address, 1)
      const campaign = await equityCampaign.campaigns(1)
      expect(campaign.founder).to.equal(investor1.address)
    })
  })
})
