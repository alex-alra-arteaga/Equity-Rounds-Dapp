import React, { useEffect, useState } from 'react';
import { Card1 } from './components/Card1';
import Navbar from './components/Navbar';
import Image from 'next/image';
import { BigNumber, Contract, ethers, providers, Wallet } from "ethers"
import { EQUITY_CAMPAIGN_CONTRACT_ADDRESS, ABI } from "constants/constants"
import { useSigner } from "wagmi"

const Home = () => {
  let contract
  const [cards, setCards] = useState([])
  const [equityCampaignContract, setContract] = useState(null)
  const [signer, setSigner] = useState();
  // const { data: signer } = useSigner()
  useSigner({
    onSuccess: (data) => setSigner(data)
  })
  useEffect(() => {
    if (!signer) return 
    contract = new Contract(
      EQUITY_CAMPAIGN_CONTRACT_ADDRESS,
      ABI,
      signer,
    )
    setContract(contract)
    const renderCards = async () => {
      console.log("contract: ", contract)
      if (contract) {
        const numOfCampaigns = +(await contract.s_numberCampaigns())
        console.log("num: ", numOfCampaigns)
        const cards = []
        for (let i = 0; i != numOfCampaigns; i++) {
          cards.push(<Card1 index={i + 1} signer={signer} />)
        }
        setCards(cards)
      }
    }
    renderCards()
  }, [signer])

  return (
    <>
      <Navbar/>
      <div style={{
        zIndex: -1,
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: '0'
      }}>
      <Image
          src="/image.png"
          fill= 'cover'
          objectFit='cover'
        />
      </div>
      <h1 style={{
        fontFamily: "monospace",
        fontSize: "3.5rem",
        color: 'white',
        fontWeight: "bold",
        textAlign: "center"
      }}>Campaigns</h1>
      <div style={{
      paddingLeft: '3rem',
      paddingRight: '3rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gridGap: '3rem'
    }}>
      {cards}
    </div>
    </>
  );
};

export default Home;
