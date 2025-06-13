import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'

// Get projectId from https://cloud.walletconnect.com
const projectId = 'bac3cc89403d0f15b40de5831c41a366'

const metadata = {
  name: 'Crypto Wallet App',
  description: 'A simple crypto wallet login and deposit app',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, sepolia] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
})

export const queryClient = new QueryClient() 