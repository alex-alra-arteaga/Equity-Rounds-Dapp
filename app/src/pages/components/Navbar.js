import Link from "next/link";
import styles from '@/styles/Navbar.module.css'
import {
  ConnectButton
} from "@rainbow-me/rainbowkit";

const Navbar = () => (
    <nav className={styles.navbar}>
      <h1 style={{ margin: 0 }}>My App</h1>
      <div className={styles.wallet}>
      <ConnectButton showBalance={{
            smallScreen: false,
            largeScreen: true,
        }}/>
      </div>
    <Link href="//app.ignota.org" style={{ textDecoration: 'none'}}>
        <button className={styles.launchbutton}>Launch App</button>
    </Link>
    </nav>
  )

export default Navbar;