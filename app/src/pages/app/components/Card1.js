import { Card, Col, Row, Button, Text } from "@nextui-org/react";
import React, { useState, useEffect } from "react"
import { BigNumber, Contract, ethers, providers, Wallet } from "ethers"
import { EQUITY_CAMPAIGN_CONTRACT_ADDRESS, ABI } from "constants/constants"

export const Card1 = (props) => {
  const index = props.index
  const signer = props.signer
  console.log("index", index)
  console.log(signer)
  const [equityCampaignContract, setContract] = useState(null)
  const [deadline, setDeadline] = useState("null")
  const [amountRaised, setAmountRaised] = useState("null")
  let contract
  useEffect(() => {
    if (!signer) return 
    contract = new Contract(
      EQUITY_CAMPAIGN_CONTRACT_ADDRESS,
      ABI,
      signer,
    )
    setContract(contract);
    console.log("hehe");
    (async () => {
      await getDeadline()
      await getAmountRaised()
    })()
  }, [])

  const getDeadline = async () => {
    const campaign = await contract.campaigns(index)
    const deadline = campaign.deadline
    const date = new Date(deadline*1000)
    setDeadline(date.toUTCString())
  }
  const getAmountRaised = async () => {
    const campaign = await contract.campaigns(index)
    const amountRaised = (campaign.sharesBought * campaign.pricePerShare / 10e18) + " ETH"
    setAmountRaised(amountRaised)
  }

  return (
    <div>
  <Card css={{ w: "100%", h: "400px" }}>
    <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
      <Col>
        <Text size={12} weight="bold" transform="uppercase" color="#ffffffAA">
          Industry
        </Text>
        <Text h3 color="black">
          Business name
        </Text>
      </Col>
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
        bgBlur: "#ffffff66",
        borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Row>
        <Col>
          <Text color="#000" size={12}>
            {deadline}
          </Text>
          <Text color="#000" size={12}>
            {amountRaised}
          </Text>
        </Col>
        <Col>
          <Row justify="flex-end">
            <Button flat auto rounded color="secondary" css={{right: "18%"}}>
              <Text
                css={{ color: "inherit" }}
                size={12}
                weight="bold"
                transform="uppercase"
              >
                Information
              </Text>
            </Button>
          </Row>
        </Col>
      </Row>
    </Card.Footer>
  </Card>
  </div>
)};
