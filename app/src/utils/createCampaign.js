import { ethers } from "ethers"
import { getIPFS_CID } from "./IPFS"

export const inputsToUnixTime = (hourInput, dateInput) => {
    const dateArray = dateInput.split("-")
    const timeArray = hourInput.split(":")  

    const year = parseInt(dateArray[0])
    const month = parseInt(dateArray[1]) - 1
    const day = parseInt(dateArray[2])
    const hour = parseInt(timeArray[0])
    const minute = parseInt(timeArray[1])

    const date = new Date(year, month, day, hour, minute)
    const unixTime = date.getTime() / 1000
    return unixTime
}

export const mapInfoToID = async (equityCampaignContract, companyName, industry) => {
    const campaignID = equityCampaignContract.s_numberCampaigns() + 1
    const map = new Map()
    console.log(map.get(5))
    if (map.get(campaignID) != undefined)
      map.set(campaignID, [companyName, industry])
    console.log(map.get(campaignID))
  }

export const createCampaign = async (businessName, industry, equityCampaignContract, percentageOfEquity, sharesOffered, pricePerShare, deadline) => {
  try {
  const fee = ethers.utils.parseEther("0.01")
  const ipfsCID = getIPFS_CID(businessName, industry)
  const tx = await equityCampaignContract.createCampaign(
    ipfsCID,
    percentageOfEquity,
    sharesOffered,
    pricePerShare,
    deadline,
    {gasLimit: 3e7, value: fee},
  )
  await tx.wait()
  } catch (err) {
    console.log(err)
  }
}