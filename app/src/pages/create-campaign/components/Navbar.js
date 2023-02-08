import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from '../styles/Create-campaign.Navbar.module.css'
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
      <Link href="/app" style={{paddingRight: '30px', textDecoration: 'none'}}>
        <span className={styles.span}>Campaigns</span>
      </Link>
      <Link href="//stats" style={{paddingRight: '30px', textDecoration: 'none'}}>
        <span className={styles.span}>Statistics</span>
      </Link>
    </ul>
    <div style={{width: 40}}></div>
    <ConnectButton className={styles.container} showBalance={{
      smallScreen: true,
      largeScreen: true,
    }}/>
    <div style={{width: 20}}></div>
    </header>
  )
}
