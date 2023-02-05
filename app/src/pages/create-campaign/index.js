import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Rectangle from './components/Rectangle';

const Home = () => {

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
          src="/create-campaign1.png"
          alt="Mountains with snow"
          fill= 'true'
          objectFit='cover'
        />
      </div>
      <Rectangle/>
    </>
  );
};

export default Home;