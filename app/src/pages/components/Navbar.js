import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from '@/styles/Navbar.module.css'
import {
  ConnectButton
} from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const [backgroundColor, setBackgroundColor] = useState("transparent");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 580) {
        setBackgroundColor("rgba(23, 61, 91, 1)");
      } else {
        setBackgroundColor("transparent");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={styles.navbar} style={{backgroundColor: backgroundColor}}>
    <div style={{width: 20}}></div>
    <Link href="//" style={{paddingRight: '30px', textDecoration: 'none'}}>
      <span className={styles.title}>Ignota Protocol</span>
    </Link>
    <div style={{width: 20}}></div>
    <div style={{width: 20}}></div>
    <ul>
      <a style={{paddingRight: '30px', textDecoration: 'none'}} href='https://github.com/alex-alra-arteaga/Equity-Rounds-Dapp/tree/master/app'>
        <span className={styles.span}>Smart Contract</span>
      </a>
      <a style={{paddingLeft: '10px', textDecoration: 'none'}} href='https://github.com/alex-alra-arteaga/Equity-Rounds-Dapp/tree/master/blockend'>
        <span className={styles.span}>Frontend</span>
      </a>
    </ul>
    <div style={{width: 40}}></div>
    <div style={{width: 40}}></div>
    <div style={{width: 40}}></div>
    <Link href="/app" style={{ textDecoration: 'none'}}>
        <button className={styles.launchbutton}>Launch App</button>
    </Link>
    <div style={{width: 20}}></div>
    </header>
  )
}

// <ConnectButton className={styles.container} showBalance={{
//   smallScreen: true,
//   largeScreen: true,
// }}/>
