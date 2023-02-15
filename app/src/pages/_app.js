import '@/styles/globals.css'
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon, optimism, goerli } from '@wagmi/core/chains'

const { chains, provider } = configureChains(
  [mainnet, goerli, polygon, optimism],
  [alchemyProvider({ apiKey: 'n47skukukkxpwhFSGnTCMWNkzkRLQdR1'}), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} initialChian={goerli} theme={darkTheme()} showRecentTransactions={true} coolMode>
        <Component {...pageProps} />
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
