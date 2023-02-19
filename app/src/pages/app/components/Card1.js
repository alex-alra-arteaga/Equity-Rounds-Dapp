import { Card, Col, Row, Button, Text, Input, Loading } from "@nextui-org/react";
import React, { useState, useEffect } from "react"
import { BigNumber, Contract, ethers, providers, Wallet } from "ethers"
import { EQUITY_CAMPAIGN_CONTRACT_ADDRESS, ABI } from "constants/constants"
import Link from "next/link";
import { SendButton } from "./SendButton";
import { SendIcon } from "./SendIcon";
import { contributeToCampaign } from "@/utils/contributeToCampaign";
import { create } from 'ipfs-http-client'
import { getIpfsHashFromBytes32 } from "@/utils/IPFS";

export const Card1 = (props) => {
  const index = props.index
  const signer = props.signer
  const campaignInfo = props.response
  const [equityCampaignContract, setContract] = useState(null)
  const [deadline, setDeadline] = useState("null")
  const [amountRaised, setAmountRaised] = useState("null")
  const [pricePerShare, setPricePerShare] = useState("null")
  const [sharesOffered, setSharesOffered] = useState("null")
  const [sharesBought, setSharesBought] = useState("null")
  const [loading, setLoading] = useState(false)
  const [sharesToBuy, setSharesToBuy] = useState("")
  const [ipfs, setIpfs] = useState(null)
  const [ipfsCID, setIpfsCID] = useState({infoCID: null, imgCID: null, nameCID: null})
  const [name, setName] = useState("")
  let contract

  useEffect(() => {
    if (!signer) return 
    contract = new Contract(
      EQUITY_CAMPAIGN_CONTRACT_ADDRESS,
      ABI,
      signer,
    )
    setContract(contract);
    setIpfs(
      create({
        host: '192.168.1.199',
        port: 4999
    }));
    setIpfsCID({
      ...ipfsCID,
      infoCID: getIpfsHashFromBytes32(campaignInfo.infoCID),
      imgCID: getIpfsHashFromBytes32(campaignInfo.imgCID),
      nameCID: getIpfsHashFromBytes32(campaignInfo.nameCID)
    });
  }, [])

  useEffect(() => {
    (async () => {
      await getDeadline()
      await getAmountRaised()
      await getPricePerShare()
      await getSharesInfo()
      await parseName()
    })()
  }, [])

  console.log(index, "content:", ipfsCID)
  const getDeadline = async () => {
    const campaign = await contract.campaigns(index)
    const deadline = campaign.deadline
    const date = new Date(deadline*1000)
    setDeadline(date.toUTCString())
  }
  
  const getAmountRaised = async () => {
    const campaign = await contract.campaigns(index)
    const amountRaised = "\n" + (campaign.sharesBought * campaign.pricePerShare / 10e17).toFixed(10) + " ETH"
    setAmountRaised(amountRaised)
  }

  const getPricePerShare = async () => {
    const campaign = await contract.campaigns(index)
    const priceXShare = (campaign.pricePerShare / 10e17)
    setPricePerShare(priceXShare)
  }

  const getSharesInfo = async () => {
    const campaign = await contract.campaigns(index)
    const sharesOffered = campaign.sharesOffered
    const sharesBought = campaign.sharesBought
    setSharesOffered(Number(sharesOffered))
    setSharesBought(Number(sharesBought))
  }

  const triggerContributeToCampaign = async () => {
    try {
      setLoading(true)
      await contributeToCampaign(equityCampaignContract, BigNumber.from(Number(sharesToBuy)), index)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const parseName = async () => {
    try {
      const file = await ipfs.cat(ipfsCID.nameCID)
      let content = '';
      for await (const chunk of fileStream) {
        content += chunk.toString();  
      }
      console.log(content);
      setName(content)
    } catch (err) {
      console.error(err)
    }
  }

  const getIndustry = async () => {

  }

  const getImage = async () => {

  }

  const getPDF = async () => {

  }

  return (
    <div>
  <Card css={{ w: "100%", h: "400px" }}>
    <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
    <Row>
      <Col>
        <Text size={12} weight="bold" transform="uppercase" color="#ffffffAA" css={{ position: "absolute", top: "1%", right: "12%"}}>
          Industry
        </Text>
        <Text h3 color="black">
          {name}
        </Text>
      </Col>
    </Row>
      <Text size={12} weight="bold" transform="uppercase" color="#ffffffAA"   css={{ position: "absolute", top: "-5%", right: "12%" }}>
          {deadline}
        </Text>
    </Card.Header>
    <Card.Body css={{ p: 0 }}>
      <Card.Image
        src="https://nextui.org/images/card-example-6.jpeg"
        width="100%"
        height="70%"
        objectFit="cover"
        alt="Card example background"
      />
    </Card.Body>
    <Card.Footer
      isBlurred
      css={{
        position: "absolute",
        borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
        bottom: 0,
        zIndex: 1,
        height: "27%",
      }}
    >
      <Row justify="center">
        <Col css={{paddingRight: "10%"}}>
          <Text color="#000" size={12} css={{width: "95%"}}>
          Shares bought: {sharesBought + " "}
          Total shares: {sharesOffered}
          </Text>
          <Text color="#000" size={12} css={{width: "72%"}}>
          Amount Raised:{amountRaised}
          </Text>
          <Text color="#000" size={12} css={{width: "70%"}}>
            Price per Share: {pricePerShare} ETH
          </Text>
        </Col>
        <Col>
          <Row justify="flex-end">
            <Link href={`/app/campaign/${index}`} style={{textDecoration: 'none', paddingTop: "13%"}}>
            <Button flat auto rounded color="primary" css={{right: "18%"}}>
              <Text
                css={{ color: "inherit"}}
                size={12}
                weight="bold"
                transform="uppercase"
              >
                Information
              </Text>
            </Button>
            </Link>
          </Row>
          <div style={{height: 10}}></div>
          {loading ? 
          <Input
            clearable
            bordered
            disabled
            color="primary"
            placeholder="Loading..."
            contentRight={<Loading size="xs" />}
            css={{right: "40%", width: "120%"}}
          />
          :
          <Input
            bordered
            color="primary"
            placeholder="Shares to buy"
            contentRightStyling={false}
            contentRight={
              <SendButton onClick={triggerContributeToCampaign}>
                <SendIcon />
              </SendButton>}
            contentClickable="true"
            onChange={(e) => setSharesToBuy(e.target.value)}
            css={{right: "40%", width: "120%"}}
          />
          }
          <Text size={10} css={{right: "20%"}} >Eth to pay: {(Number(pricePerShare) * sharesToBuy).toFixed(18)}</Text>
        </Col>
      </Row>
    </Card.Footer>
  </Card>
  </div>
)};
