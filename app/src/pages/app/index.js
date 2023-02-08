import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Property from './components/Property';
import { Card } from '@nextui-org/react';
import { Card1 } from './components/Card1';
import Background from '../components/Background';
import Navbar from './components/Navbar';
import Image from 'next/image';
//import { createClient } from 'urql';
//import { API_URL } from 'constants/constants';
//import { execute } from 'graphql';
//
//// Have The Graph for querying new events and adding them in IPFS or "", for the statistics of the investors, use Ceramic
//
//const query = `
//query {
//  campaignCreated01S {
//    id
//    founder
//    percentageOfEquity
//    sharesOffered
//  }
//  campaignCreated02S {
//    id
//    pricePerShare
//    creationTime
//    deadline
//  }
//}`
//
//const client = createClient({
//  url: API_URL,
//})
//
//async function fetchData() {
//  const response = await client.query(query).toPromise()
//  console.log('response', response)
//  return response
//}

const Home = () => {
  const cards = [1, 2, 3, 4, 5];

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
          alt="Mountains with snow"
          fill= 'true'
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
      {cards.map((card, index) => (
        <Card1 key={index} />
      ))}
    </div>
    </>
  );
};

export default Home;
