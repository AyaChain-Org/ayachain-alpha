import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import WalletProvider from './context/walletContext'
import { ProductProvider, useProductContext } from './context/productContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PegoTrack',
  description: 'Make Your Business Stronger with Authenticity and Transparency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <WalletProvider>
          <ProductProvider>
            {children}
            <ToastContainer />
          </ProductProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
