import { BigNumber } from "ethers"

export const contributeToCampaign = async (contract, amount, campaignID) => {
  try {
    console.log("am", amount)
    const campaign = await contract.campaigns(campaignID)
    console.log("Xshare", campaign.pricePerShare)
    const pricePerShare = BigNumber.from(campaign.pricePerShare)
    const amountBN = BigNumber.from(amount)
    const value = amountBN.mul(pricePerShare)
    console.log("X", value)
    const tx = await contract.contributeToCampaign(
      amount, 
      campaignID,
      true,
      {gasLimit: 3e6, value: value}
    )
    console.log("tx: ", tx)
    await tx.wait()
  } catch (err) {
      console.log(err)
  }
}