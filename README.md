# 🎰 Crypto Casino - Premium Gaming Experience

A modern cryptocurrency casino platform built with Next.js 14, Firebase, and Tailwind CSS. Features Bitcoin and Ethereum support with a sleek, Stake.com-inspired dark theme UI.

![Crypto Casino](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Firebase](https://img.shields.io/badge/Firebase-9.0-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

### 🔐 Authentication
- **Google Sign-In**: One-click authentication with Google OAuth
- **Phone Number Verification**: SMS-based login with Firebase Auth
- **Secure Sessions**: Firebase Authentication handles session management
- **Auto-redirect**: Smart routing based on authentication state

### 💎 Crypto Wallet Integration
- **Bitcoin Support**: Automatic BTC address generation for each user
- **Ethereum Support**: Automatic ETH address generation for each user
- **Address Management**: Unique deposit addresses assigned per user
- **Copy-to-Clipboard**: Easy address copying with visual feedback

### 📊 Dashboard Features
- **Real-time Data**: Live deposit history and account statistics
- **Transaction Tracking**: Sortable and filterable deposit history
- **Address Display**: Clear presentation of crypto deposit addresses
- **User Stats**: Account status, total deposits, and member information

### 🎨 UI/UX Design
- **Stake.com-inspired Design**: Dark, elegant casino-style interface
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: Framer Motion for polished transitions
- **Modern Components**: shadcn/ui for consistent design system
- **Toast Notifications**: Real-time feedback with Sonner

## 🛠 Tech Stack

### Frontend
- **Next.js 14**: App Router with server-side rendering
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### Backend & Database
- **Firebase**: Authentication and Firestore database
- **Next.js API Routes**: Server-side functionality
- **Firestore**: NoSQL database for user data and deposits

### Blockchain Tools
- **bitcoinjs-lib**: Bitcoin address generation
- **Custom Utils**: Ethereum address generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project set up
- Git installed

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/crypto-casino.git
cd crypto-casino
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Firebase Setup

#### 4.1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication and Firestore Database

#### 4.2. Configure Authentication
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable **Google** and **Phone** providers
3. Add your domain to authorized domains

#### 4.3. Set up Firestore
1. Go to Firestore Database > Create database
2. Start in test mode (configure security rules later)
3. The app will automatically create collections: `users` and `deposits`

#### 4.4. Get Firebase Config
1. Go to Project settings > General > Your apps
2. Click on the web app icon and copy the config
3. Add the values to your `.env.local` file

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── user/create/   # User creation endpoint
│   │   └── deposit/mock/  # Mock deposit endpoint
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── AuthForm.tsx     # Authentication form
│   ├── DashboardLayout.tsx  # Main dashboard
│   ├── WalletCard.tsx   # Crypto wallet display
│   └── DepositHistoryTable.tsx  # Transaction history
└── lib/                 # Utilities and configs
    ├── firebase.ts      # Firebase configuration
    ├── userUtils.ts     # User management functions
    ├── addressUtils.ts  # Crypto address generation
    └── utils.ts         # General utilities
```

## 🎮 Usage Guide

### 1. First Time Setup
1. Visit the homepage
2. Click "Get Started Now"
3. Choose login method (Google or Phone)
4. Complete authentication

### 2. Dashboard Overview
- **Account Stats**: View account status and total deposits
- **Crypto Wallet**: See your unique BTC and ETH addresses
- **Deposit History**: Track all your transactions
- **Account Info**: View your user details and login history

### 3. Making Deposits
1. Copy your BTC or ETH address from the wallet card
2. Send cryptocurrency to the address
3. View transaction in the deposit history table
4. Click transaction hashes to view on blockchain explorer

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

```bash
# Using Vercel CLI
npm i -g vercel
vercel --prod
```

### Environment Variables for Production
Make sure to add all environment variables in your deployment platform:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

## 🔧 Development

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Commit changes: `git commit -m "feat: add new feature"`
4. Push and create pull request

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Follow Next.js best practices

### Database Schema

#### Users Collection
```typescript
interface User {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  bitcoinAddress: string;
  ethereumAddress: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

#### Deposits Collection
```typescript
interface DepositHistory {
  id?: string;
  userId: string;
  currency: 'BTC' | 'ETH';
  amount: number;
  address: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Timestamp;
}
```

## 🛡 Security Considerations

### Authentication
- Firebase Authentication provides secure user management
- Session tokens are handled automatically
- Phone verification uses Firebase's secure SMS system

### Database Security
- Implement Firestore security rules in production
- Validate user permissions for data access
- Never expose sensitive data client-side

### Crypto Addresses
- Addresses are generated randomly (not connected to real wallets)
- For production, integrate with proper wallet APIs
- Implement proper key management for real transactions

## 🎨 Customization

### Theme Colors
Edit `src/app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 142 70% 50%;      /* Green */
  --secondary: 210 40% 25%;    /* Dark gray */
  --accent: 47 96% 53%;        /* Yellow */
}
```

### UI Components
All components use shadcn/ui and can be customized via:
- Tailwind classes
- CSS variables
- Component props

## 📋 Roadmap

### Phase 1 (Current)
- ✅ Firebase Authentication
- ✅ Crypto address generation
- ✅ Dashboard UI
- ✅ Deposit history tracking

### Phase 2 (Planned)
- [ ] Real blockchain integration
- [ ] Live transaction monitoring
- [ ] Multi-currency support
- [ ] Advanced user settings

### Phase 3 (Future)
- [ ] Gaming functionality
- [ ] Real-time deposits
- [ ] Advanced analytics
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://your-demo-link.vercel.app)
- [Documentation](https://your-docs-link.com)
- [GitHub Repository](https://github.com/your-username/crypto-casino)

## 💬 Support

For support, email support@cryptocasino.com or join our Discord server.

---

**Built with ❤️ by the Crypto Casino Team**

*Enjoy responsibly. This is a demo application for educational purposes.*
