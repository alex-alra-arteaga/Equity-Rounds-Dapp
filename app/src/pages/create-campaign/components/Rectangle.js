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
import { getIpfsHashFromBytes32, getBytes32FromIpfsHash } from "@/utils/IPFS"

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
  const [isPdfAdded, setIsPdfAdded] = useState(false)
  const [ipfs, setIpfs] = useState(null)

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
      isImageAdded && isPdfAdded &&
      !(/^\d+\.\d+$/.test(sharesOffered)) && !(/^\d+\.\d+$/.test(pricePerShare)) && // check that it's not float
      (!(sharesOffered === "") && (BigNumber.isBigNumber(BigNumber.from(sharesOffered)) && BigNumber.from(sharesOffered) != 0)) &&
      (!(pricePerShare === "") && (BigNumber.isBigNumber(BigNumber.from(pricePerShare)) && BigNumber.from(pricePerShare) != 0)) &&
      !loading
    )
      setIsDisabled(false)
    else
      setIsDisabled(true)
  }, [companyName, industry, percentageOfEquity, sharesOffered, pricePerShare, deadlineHour, deadlineDate, isImageAdded])

  useEffect(() => {
    setIpfs(
      create({
        host: '192.168.1.199',
        port: 4999
    }))
  }, [])

  const storeStringOnIpfs = async () => {
    const campaignID = +(await equityCampaignContract.s_numberCampaigns()) + 1
    const body = {
      message: industry + '||' + companyName
    }
    const content = JSON.stringify(body)
    console.log(content)
    const contentBuffer = Buffer.from(content)
    const options = {
      wrapWithDirectory: true,
      progress: (prog) => console.log(`Upload Text progress: ${prog}`),
      pin: true
    }
    const results = await ipfs.add({ path: "textInfo" + campaignID, content: contentBuffer }, options)
    return results.cid.toString()
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

  const handlePDFChange = () => {
    const inputLabel = document.getElementById('pdf-input-label')
    const fileInput = document.getElementById('pdf-input')
    if (fileInput.value) {
      setIsPdfAdded(true)
      inputLabel.style["borderColor"] = 'green'
    } else {
      setIsPdfAdded(false)
      inputLabel.style["borderColor"] = 'red'
      return
    }
  }

  const handleImageInput = async () => {
    const fileOptions = {
      wrapWithDirectory: true,
      progress: (prog) => console.log(`Upload Image progress: ${prog}`),
      pin: true
    }
    const blob = new Blob([await document.getElementById("img-input").files[0].arrayBuffer()], { type: "image/jpg" })
    console.log("blob: ", blob)
    const campaignID = +(await equityCampaignContract.s_numberCampaigns()) + 1
    const ipfsResult = await ipfs.add({ path: "campaignImage" + campaignID, content: blob }, fileOptions)
    console.log("path", ipfsResult.path.toString())
    const ipfsCID = ipfsResult.cid.toString()
    console.log(`Image uploaded to IPFS with hash: ${ipfsCID}`)
    return ipfsCID
  }

  const handlePdfInput = async () => {
    const fileOptions = {
      wrapWithDirectory: true,
      progress: (prog) => console.log(`Upload Pdf progress: ${prog}`),
      pin: true
    }
    const blob = new Blob([await document.getElementById("pdf-input").files[0].arrayBuffer()], { type: "application/pdf" })
    console.log("blob: ", blob)
    setIsPdfAdded(true);
    const campaignID = +(await equityCampaignContract.s_numberCampaigns()) + 1
    const ipfsResult = await ipfs.add({ path: "campaignPdf" + campaignID, content: blob }, fileOptions)
    const ipfsCID = ipfsResult.cid.toString()
    console.log(`Pdf uploaded to IPFS with hash: ${ipfsCID}`)
    return ipfsCID
  }

  const submitCampaign = async () => {
    try {
      const deadline = inputsToUnixTime(deadlineHour, deadlineDate)
      setLoading(true)
      setIsDisabled(true)
      const ipfsCID = await storeStringOnIpfs()
      const ipfsCIDHex = getBytes32FromIpfsHash(ipfsCID)
      const imgCID = await handleImageInput()
      const imgCIDHex = getBytes32FromIpfsHash(imgCID)
      const pdfCID = await handlePdfInput()
      const pdfCIDHex = getBytes32FromIpfsHash(pdfCID)
      console.log("ipfsCIDHex: ", ipfsCIDHex)
      console.log("imgCIDHex: ", imgCIDHex)
      console.log("pdfCIDHex: ", pdfCIDHex)
      await createCampaign(ipfsCIDHex, imgCIDHex, pdfCIDHex, equityCampaignContract, percentageOfEquity, sharesOffered, pricePerShare, deadline)
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
          <Input onChange={(e) => setPercentageOfEquity(e.target.value)} css={{ label: { color: "white" } }} clearable label="Percentage of Equity" placeholder="Percentage of Equity" />
        </Grid>
        <Grid xs={6}>
          <Input onChange={(e) => setSharesOffered(e.target.value)} css={{ label: { color: "white" } }} clearable label="Shares Offered" placeholder="Shares Offered" />
        </Grid>
        <Grid xs={6}>
          <div>
            <Input onChange={(e) => setPricePerShare(e.target.value)} css={{ label: { color: "white" } }} clearable label="Price per Share" placeholder="In Wei" />
            <div style={{ height: 8 }}></div>
            <label htmlFor="img-input" id="img-input-label" className={styles.img_input_label}>Campaign Image</label>
            <input
              type="file"
              id="img-input"
              className={styles.img_input}
              placeholder="Campaign Image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="pdf-input" id="pdf-input-label" className={styles.pdf_input_label}>PDF Description</label>
            <input
              type="file"
              id="pdf-input"
              className={styles.pdf_input}
              placeholder="PDF INFO"
              accept="application/pdf"
              onChange={handlePDFChange}
            />
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
            <div style={{ height: 10 }}></div>
            <Input
              onChange={(e) => setDeadlineDate(e.target.value)}
              width="186px"
              type="date"
            />
          </div>
        </Grid>
      </Grid.Container>
      <Spacer y={0.4} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        {(isConnected) ?
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