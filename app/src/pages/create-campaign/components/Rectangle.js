import React, { useState, useEffect } from "react"
import { BigNumber, Contract, ethers, providers, Wallet } from "ethers"
import styles from '../styles/Create-campaign.Rectangle.module.css'
import { Input } from '@nextui-org/react'
import { Grid, Button, Loading, Spacer } from "@nextui-org/react"
import { LockIcon } from './LockIcon'
import { useAccount, useSigner } from "wagmi"
import { inputsToUnixTime, mapInfoToID, createCampaign } from "@/utils/createCampaign"
import { EQUITY_CAMPAIGN_CONTRACT_ADDRESS, ABI } from "constants/constants"
import { create } from 'ipfs-http-client'

const Rectangle = () => {
  const { isConnected } = useAccount()
  const zero = BigNumber.from(0)
  const { data: signer } = useSigner()
  const equityCampaignContract = new Contract(
    EQUITY_CAMPAIGN_CONTRACT_ADDRESS,
    ABI,
    signer,
  )
  const [loading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [percentageOfEquity, setPercentageOfEquity] = useState(0)
  const [sharesOffered, setSharesOffered] = useState(zero)
  const [pricePerShare, setPricePerShare] = useState(zero)
  const [deadlineHour, setDeadlineHour] = useState("")
  const [deadlineDate, setDeadlineDate] = useState("")
  const [isImageAdded, setIsImageAdded] = useState(false)
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (
      typeof companyName === 'string' &&
      typeof industry === 'string' &&
      typeof deadlineHour === 'string' &&
      typeof deadlineDate === 'string' &&
      typeof Number(percentageOfEquity) === 'number' &&
      Number(percentageOfEquity) <= 100 &&
      Number(percentageOfEquity) > 0 &&
      !(deadlineHour === "") && !(deadlineDate === "") &&
      isImageAdded &&
      !(/^\d+\.\d+$/.test(sharesOffered)) && !(/^\d+\.\d+$/.test(pricePerShare)) && // check that it's not float
      (!(sharesOffered === "") && (BigNumber.isBigNumber(BigNumber.from(sharesOffered)) && BigNumber.from(sharesOffered) != 0)) &&
      (!(pricePerShare === "") && (BigNumber.isBigNumber(BigNumber.from(pricePerShare)) && BigNumber.from(pricePerShare) != 0)) &&
      !loading
    )
      setIsDisabled(false)
    else
      setIsDisabled(true)
  }, [companyName, industry, percentageOfEquity, sharesOffered, pricePerShare, deadlineHour, deadlineDate, isImageAdded])

  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'http'
  })

  async function storeStringOnIpfs() {
    const campaignID = equityCampaignContract.s_numberCampaigns() + 1
    const body = {
      name: campaignID,
      message: industry + '||' + companyName
    }
      const content = JSON.stringify(body)
      const contentBuffer = Buffer.from(content)
      const options = {
        wrapWithDirectory: true,
        progress: (prog) => console.log(`Upload progress: ${prog}`),
        pin: true
      }
      const results = await ipfs.add({ path: campaignID, content: contentBuffer }, options)
      return results[0].hash
  }

  const fileOptions = {
    wrapWithDirectory: true,
    progress: (prog) => console.log(`Upload progress: ${prog}`),
    pin: true
  }

  const handleImageChange = () => {
    const inputLabel = document.getElementById('img-input-label')
    const fileInput = document.getElementById('img-input')
    if (fileInput.value) {
      setIsImageAdded(true)
      inputLabel.style["borderColor"] = 'green'
    } else {
      setIsImageAdded(false)
      inputLabel.style["borderColor"] = 'red'
      return
    }
  }

  const handleImageInput = () => {
    const file = document.getElementById("img-input").files[0]
    console.log(file)
    const fileUrl = URL.createObjectURL(file)

    // Open a new window and display the selected file
    const newWindow = window.open(fileUrl, '_blank')
    newWindow.focus()
    const reader = new FileReader()

    reader.onload = async () => {
      const campaignID = equityCampaignContract.s_numberCampaigns() + 1
      const buffer = Buffer.from(event.target.result)
      const ipfsResult = await ipfs.add({path: "campaignImage" + campaignID, content: buffer}, fileOptions)
      .then((result) => {
        console.log(`File uploaded to IPFS with hash ${result.cid.toString()}`)
      })
      .catch((error) => {
        console.error(`Error uploading file to IPFS: ${error}`)
        return
      })
      const ipfsHash = ipfsResult.path
      console.log(`Image uploaded to IPFS with hash: ${ipfsHash}`)
      setImage(ipfsHash)
    }
    reader.readAsArrayBuffer(file)
  }
  

  const submitCampaign = async () => {
    try {
      const deadline = inputsToUnixTime(deadlineHour, deadlineDate)
      setLoading(true)
      setIsDisabled(true)
      const ipfsCID = await storeStringOnIpfs()
      handleImageInput()
      console.log(ipfsCID)
      await createCampaign(ipfsCID, industry, equityCampaignContract, percentageOfEquity, sharesOffered, pricePerShare, deadline)
      setIsDisabled(false)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setIsDisabled(false)
      setLoading(false)
    }
  }

  return (
    <div className={styles.rectangle}>
      <Grid.Container gap={2} justify="center">
        <Grid xs={6}>
          <Input onChange={(e) => setCompanyName(e.target.value)} css={{ label: { color: "white" } }} clearable label="Company name" placeholder="Company name" />
        </Grid>
        <Grid xs={6}>
          <Input onChange={(e) => setIndustry(e.target.value)} css={{ label: { color: "white" } }} clearable label="Industry" placeholder="Industry" />
        </Grid>
        <Grid xs={6}>
          <Input onChange={(e) => setPercentageOfEquity(e.target.value)} css={{ label: { color: "white" } }}clearable label="Percentage of Equity" placeholder="Percentage of Equity" />
        </Grid>
        <Grid xs={6}>
          <Input onChange={(e) => setSharesOffered(e.target.value)} css={{ label: { color: "white" } }} clearable label="Shares Offered" placeholder="Shares Offered"/>
        </Grid>
        <Grid xs={6}>
          <div>
            <Input onChange={(e) => setPricePerShare(e.target.value)} css={{ label: { color: "white" } }} clearable label="Price per Share" placeholder="In Wei" />
          <div style={{height: 8}}></div>
            <label for="img-input" id="img-input-label" className={styles.img_input_label}>Campaign Image</label>
            <input
              type="file"
              id="img-input"
              className={styles.img_input}
              placeholder="Campaign Image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && (
            <div>
              <img src={`https://ipfs.io/ipfs/${image}`} alt="Uploaded Image" />
            </div>
            )}
          </div>
        </Grid>
        <Grid xs={6}>
            <div> 
          <Input
            css={{ label: { color: "white" } }}
            onChange={(e) => setDeadlineHour(e.target.value)}
            width="186px" 
            label="Deadline (UTC)" 
            type="time" 
          />
          <div style={{height: 10}}></div>
          <Input
            onChange={(e) => setDeadlineDate(e.target.value)}
            width="186px" 
            type="date" 
          />
          </div>
        </Grid>
      </Grid.Container>
      <Spacer y={0.4}/>
      <div style={{ display: "flex", justifyContent: "center" }}>
      { (isConnected) ?
      <Button onPress={submitCampaign} icon={<LockIcon fill="currentColor" />} color="gradient" size='lg' disabled={isDisabled}>
        {loading ?
        <Loading type="points" color="currentColor" size="sm" />
        : <>Deploy</>}
      </Button>
      : <Button disabled icon={<LockIcon fill="currentColor" />} color="gradient" size='lg'>Connect Wallet</Button>}
      </div>
    </div>
  )
}

export default Rectangle
