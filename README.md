# Crypto Wallet Login & Deposit App

A modern, secure crypto wallet application built with Next.js 14, featuring Web3Modal wallet connections, Sign-In With Ethereum (SIWE) authentication, and simulated crypto deposits.

## 🚀 Features

- **Wallet Connection**: Connect MetaMask and WalletConnect-compatible wallets via Web3Modal v3
- **Secure Authentication**: Sign-In With Ethereum (SIWE) for secure, decentralized authentication
- **Real-time Balance**: Display ETH balance from connected wallet
- **Deposit Simulation**: Simulate crypto deposits with form validation
- **Deposit History**: Track all deposits in a clean, animated dashboard
- **Modern UI**: Beautiful dark mode interface with Framer Motion animations
- **Mobile Responsive**: Fully responsive design for all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Web3**: Web3Modal v3, Wagmi, Viem
- **Authentication**: Sign-In With Ethereum (SIWE), Iron Session
- **Database**: Prisma ORM with PostgreSQL
- **UI Components**: shadcn/ui, Lucide React icons
- **Animations**: Framer Motion
- **State Management**: React Query (TanStack Query)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/noahwilliamshaffer/Gamble.git
   cd Gamble
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/gambling_app"
   
   # NextAuth Secret (generate a random string)
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Web3Modal Project ID (get from https://cloud.walletconnect.com)
   NEXT_PUBLIC_PROJECT_ID="your-walletconnect-project-id"
   
   # SIWE Domain
   NEXT_PUBLIC_APP_DOMAIN="localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Web3Modal Setup

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID
4. Add it to your `.env.local` file as `NEXT_PUBLIC_PROJECT_ID`

### Database Setup

This app uses PostgreSQL with Prisma. You can use:
- Local PostgreSQL installation
- Docker container
- Cloud services like Supabase, PlanetScale, or Neon

Example Docker command for local PostgreSQL:
```bash
docker run --name postgres-gambling -e POSTGRES_PASSWORD=password -e POSTGRES_DB=gambling_app -p 5432:5432 -d postgres
```

## 🎯 Usage

### For Users

1. **Connect Wallet**: Click "Connect Wallet" on the homepage
2. **Sign In**: After connecting, click "Sign In with Ethereum" to authenticate
3. **View Dashboard**: Access your dashboard to see wallet info and balance
4. **Make Deposits**: Click "Deposit ETH" to simulate crypto deposits
5. **View History**: See all your deposit transactions in the history section

### For Developers

The app structure follows Next.js 14 App Router conventions:

```
src/
├── app/
│   ├── api/          # API routes
│   ├── dashboard/    # Dashboard page
│   └── page.tsx      # Landing page
├── components/       # React components
├── lib/             # Utility functions
└── prisma/          # Database schema
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security Features

- **SIWE Authentication**: Cryptographic signature-based authentication
- **Session Management**: Secure session handling with Iron Session
- **Input Validation**: Server-side validation for all user inputs
- **CSRF Protection**: Built-in protection against cross-site request forgery
- **Environment Variables**: Sensitive data stored in environment variables

## 🧪 Testing

### Test Wallet Usage

For testing, you can use:
- **Testnet**: Configure for Sepolia testnet (included in wallet config)
- **MetaMask**: Use test accounts with testnet ETH
- **Local Development**: All deposits are simulated (no real transactions)

### Test Flow

1. Connect a test wallet (MetaMask with Sepolia testnet)
2. Sign the SIWE message
3. Make test deposits (any amount)
4. Verify deposits appear in history

## 📝 API Endpoints

- `GET /api/auth/siwe` - Get authentication nonce
- `POST /api/auth/siwe` - Verify SIWE signature
- `GET /api/user` - Get user data and deposit history
- `POST /api/deposit` - Create new deposit record

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Web3Modal](https://web3modal.com/) for wallet connection
- [Sign-In With Ethereum](https://login.xyz/) for authentication standard
- [Prisma](https://prisma.io/) for database management
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Framer Motion](https://framer.com/motion/) for animations

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/noahwilliamshaffer/Gamble/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

---

Built with ❤️ by [Noah Shaffer](https://github.com/noahwilliamshaffer)
