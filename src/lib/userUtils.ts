import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { generateBitcoinAddress, generateEthereumAddress } from './addressUtils';

export interface User {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  bitcoinAddress: string;
  ethereumAddress: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface DepositHistory {
  id?: string;
  userId: string;
  currency: 'BTC' | 'ETH';
  amount: number;
  address: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Timestamp;
}

// Create or update user in Firestore
export async function createUserRecord(
  uid: string, 
  email?: string, 
  phoneNumber?: string, 
  displayName?: string
): Promise<User> {
  const userRef = doc(db, 'users', uid);
  
  try {
    // Check if user already exists
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Update last login time
      const userData = userSnap.data() as User;
      await setDoc(userRef, {
        ...userData,
        lastLoginAt: Timestamp.now()
      }, { merge: true });
      
      return userData;
    } else {
      // Create new user with crypto addresses
      const newUser: User = {
        uid,
        email,
        phoneNumber,
        displayName,
        bitcoinAddress: generateBitcoinAddress(),
        ethereumAddress: generateEthereumAddress(),
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now()
      };
      
      await setDoc(userRef, newUser);
      
      // Create some mock deposit history for new users
      await createMockDepositHistory(uid);
      
      return newUser;
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

// Get user data from Firestore
export async function getUserData(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Get user's deposit history
export async function getDepositHistory(userId: string): Promise<DepositHistory[]> {
  try {
    const depositsRef = collection(db, 'deposits');
    const q = query(
      depositsRef, 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const deposits: DepositHistory[] = [];
    
    querySnapshot.forEach((doc) => {
      deposits.push({
        id: doc.id,
        ...doc.data() as Omit<DepositHistory, 'id'>
      });
    });
    
    return deposits;
  } catch (error) {
    console.error('Error fetching deposit history:', error);
    return [];
  }
}

// Create mock deposit history for demo purposes
export async function createMockDepositHistory(userId: string): Promise<void> {
  try {
    const depositsRef = collection(db, 'deposits');
    
    const mockDeposits: Omit<DepositHistory, 'id'>[] = [
      {
        userId,
        currency: 'BTC',
        amount: 0.00521,
        address: generateBitcoinAddress(),
        txHash: '7d2c4e1f8a9b3c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
        status: 'confirmed',
        timestamp: Timestamp.fromDate(new Date(Date.now() - 86400000 * 2)) // 2 days ago
      },
      {
        userId,
        currency: 'ETH',
        amount: 0.0832,
        address: generateEthereumAddress(),
        txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        status: 'confirmed',
        timestamp: Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)) // 5 days ago
      },
      {
        userId,
        currency: 'BTC',
        amount: 0.00123,
        address: generateBitcoinAddress(),
        txHash: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
        status: 'pending',
        timestamp: Timestamp.fromDate(new Date(Date.now() - 86400000)) // 1 day ago
      }
    ];
    
    for (const deposit of mockDeposits) {
      await addDoc(depositsRef, deposit);
    }
  } catch (error) {
    console.error('Error creating mock deposit history:', error);
  }
} 