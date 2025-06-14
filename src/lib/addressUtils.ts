import { randomBytes } from 'crypto';

// Generate a mock Bitcoin address
export function generateBitcoinAddress(): string {
  // Generate a realistic-looking Bitcoin address (P2PKH format)
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = '1'; // P2PKH addresses start with '1'
  
  for (let i = 0; i < 33; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return address;
}

// Generate a mock Ethereum address
export function generateEthereumAddress(): string {
  // Generate a realistic-looking Ethereum address
  const hex = randomBytes(20).toString('hex');
  return `0x${hex}`;
}

// Validate Bitcoin address format (basic)
export function isValidBitcoinAddress(address: string): boolean {
  const bitcoinRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1([02-9ac-hj-np-z]){7,87}$/;
  return bitcoinRegex.test(address);
}

// Validate Ethereum address format
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Get blockchain explorer URL
export function getExplorerUrl(currency: 'BTC' | 'ETH', address: string): string {
  switch (currency) {
    case 'BTC':
      return `https://blockchair.com/bitcoin/address/${address}`;
    case 'ETH':
      return `https://etherscan.io/address/${address}`;
    default:
      return '#';
  }
}

// Get transaction explorer URL
export function getTxExplorerUrl(currency: 'BTC' | 'ETH', txHash: string): string {
  switch (currency) {
    case 'BTC':
      return `https://blockchair.com/bitcoin/transaction/${txHash}`;
    case 'ETH':
      return `https://etherscan.io/tx/${txHash}`;
    default:
      return '#';
  }
} 