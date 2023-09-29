'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Chain, configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

export const pegoTestnet = {
  id: 2020_1022,
  name: 'PEGO',
  network: 'pegochain',
  nativeCurrency: {
    decimals: 18,
    name: 'Pego Token',
    symbol: 'PG',
  },
  rpcUrls: {
    public: { http: ['https://pegorpc.com/'] },
    default: { http: ['https://pegorpc.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'PegoScan', url: 'https://scan.pego.network' },
    default: { name: 'PegoScan', url: 'https://scan.pego.network' },
  },
} as const satisfies Chain

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    pegoTestnet,
  ],
  [publicProvider()]
);


const { connectors } = getDefaultWallets({
  appName: 'PegoTrack',
  projectId: '9904ebb190195acdcc552c331c1a8087',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default WalletProvider;
