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
  const web3ModalRef = useRef();
  
  return (
    <>
      <Navbar>
      </Navbar>
      <Header/>
      <div className={styles.bg_image}></div>
    </>
  );
};
