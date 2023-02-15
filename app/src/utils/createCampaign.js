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

export const createCampaign = async (ipfsCID, imgCID, equityCampaignContract, percentageOfEquity, sharesOffered, pricePerShare, deadline) => {
  try {
  console.log(ipfsCID, imgCID, percentageOfEquity, sharesOffered, pricePerShare, deadline)
  const fee = ethers.utils.parseEther("0.01")
  const tx = await equityCampaignContract.createCampaign(
    ipfsCID,
    imgCID,
    percentageOfEquity,
    sharesOffered,
    pricePerShare,
    deadline,
    {gasLimit: 3e6, value: fee},
  )
  console.log("tx: ", tx)
  await tx.wait()
  } catch (err) {
    console.log(err)
  }
}