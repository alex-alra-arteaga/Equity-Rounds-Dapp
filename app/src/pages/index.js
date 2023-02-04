import Head from 'next/head'
import Image from 'next/image'
import Background from './components/Background'
import { Inter } from '@next/font/google'
import Navbar from './components/Navbar'
import Header from './components/Header'
import {connectWallet, getProviderOrSigner} from '../utils/wallet'
import { useState, useRef, useEffect } from 'react'
import styles from '../styles/Home.module.css'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  return (
    <>
      <Navbar/>
      <img src="./logo.png" className={styles.logo}></img>
      <div className={styles.bg_image}>
        <h1 className={styles.title1}>Unleash <span class={styles.golden}>growth</span>.</h1>
        <h1 className={styles.title2}>Join the future of <span class={styles.golden}>Investing</span>.</h1>
        <h2 className={styles.subtitle1}>We're building an infrastructure for permisionless funding and investing oportunities for equity rounds,</h2>
        <h2 className={styles.subtitle2}>explore promising campaigns and fund your dreams</h2>
      </div>
      <div className={styles.container}>
        <div className={styles.blackDiv}>
        </div>
      </div>
    </>
  );
};
