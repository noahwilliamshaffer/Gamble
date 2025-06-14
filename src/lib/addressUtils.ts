import { randomBytes } from 'crypto';

// Generate a Bitcoin address for the user (mock implementation for development)
export function generateBitcoinAddress(): string {
  try {
    // Generate a mock Bitcoin address that looks realistic
    const addressBytes = randomBytes(20);
    const checksum = randomBytes(4);
    const fullAddress = Buffer.concat([Buffer.from([0x00]), addressBytes, checksum]);
    
    // Create a base58-like address starting with '1'
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = '1';
    
    for (let i = 0; i < 33; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    
    return address;
  } catch (error) {
    console.error('Error generating Bitcoin address:', error);
    // Fallback to a simple mock address format
    return `1${randomBytes(20).toString('hex').substring(0, 33)}`;
  }
}

// Generate an Ethereum address for the user
export function generateEthereumAddress(): string {
  try {
    // Generate a random 20-byte address
    const addressBytes = randomBytes(20);
    const address = '0x' + addressBytes.toString('hex');
    return address;
  } catch (error) {
    console.error('Error generating Ethereum address:', error);
    // Fallback to a mock address
    return `0x${randomBytes(20).toString('hex')}`;
  }
}

// Validate Bitcoin address format (basic validation)
export function isValidBitcoinAddress(address: string): boolean {
  try {
    // Basic Bitcoin address validation - starts with 1, 3, or bc1
    const bitcoinRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1([02-9ac-hj-np-z]){7,87}$/;
    return bitcoinRegex.test(address);
  } catch {
    return false;
  }
}

// Validate Ethereum address format
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
} 