import React, { useState, useEffect } from "react";
import { BigNumber, Contract, ethers, providers, Wallet } from "ethers";
import styles from '../styles/Create-campaign.Rectangle.module.css'
import { Input } from '@nextui-org/react';
import { Grid, Button, Loading, Spacer } from "@nextui-org/react";
import { LockIcon } from './LockIcon';
import { useAccount, useSigner } from "wagmi";
import { inputsToUnixTime, mapInfoToID, createCampaign } from "@/utils/createCampaign";
import { EQUITY_CAMPAIGN_CONTRACT_ADDRESS, ABI } from "constants/constants"

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
      !(/^\d+\.\d+$/.test(sharesOffered)) && !(/^\d+\.\d+$/.test(pricePerShare)) && // check that it's not float
      (!(sharesOffered === "") && (BigNumber.isBigNumber(BigNumber.from(sharesOffered)) && BigNumber.from(sharesOffered) != 0)) &&
      (!(pricePerShare === "") && (BigNumber.isBigNumber(BigNumber.from(pricePerShare)) && BigNumber.from(pricePerShare) != 0))
    )
    if (!loading)
      setIsDisabled(false)
    else
      setIsDisabled(true)
  }, [companyName, industry, percentageOfEquity, sharesOffered, pricePerShare, deadlineHour, deadlineDate])

  const submitCampaign = async () => {
    try {
      console.log(signer)
      console.log(equityCampaignContract)
      const deadline = inputsToUnixTime(deadlineHour, deadlineDate)
      setLoading(true)
      setIsDisabled(true)
      await createCampaign(companyName, industry, equityCampaignContract, percentageOfEquity, sharesOffered, pricePerShare, deadline)
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
          <Input onChange={(e) => setPricePerShare(e.target.value)} css={{ label: { color: "white" } }} clearable label="Price per Share" placeholder="In Wei" />
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
  );
};

export default Rectangle;
