# Finance Tracker

A production-ready, local-first personal finance mobile application built with React Native and Expo. Track expenses and income across multiple currencies with automatic conversion, powerful analytics, and data export capabilities.

## Features

### Core Functionality
- **Multi-currency Support**: Track transactions in 8 major currencies (EUR, USD, GBP, JPY, CHF, CAD, AUD, CNY)
- **Automatic Currency Conversion**: All transactions are converted to your primary currency for unified tracking
- **Expense & Income Tracking**: Complete transaction management with categories and payment methods
- **Local-first Architecture**: All data stored locally using SQLite - no cloud, no servers, no authentication needed
- **Data Persistence**: Full data persistence between app launches

### Financial Management
- **Multiple Categories**: Pre-loaded default categories for both expenses and income
- **Custom Payment Methods**: Track transactions across Cash, Debit Card, Credit Card, and custom methods
- **Transaction History**: View and filter all transactions with detailed information
- **Edit & Delete**: Full CRUD operations on transactions with confirmation dialogs

### Analytics & Insights
- **Dashboard Overview**: Current balance, monthly income/expense summaries
- **Category Breakdown**: Visual pie charts showing spending/income by category
- **Historical Trends**: 6-month bar charts for expenses and income
- **Statistics**: Detailed percentage breakdowns and transaction counts

### Data Export
- **CSV Export**: Export all transactions to CSV format
- **Native Sharing**: Use iOS/Android native share functionality to save or send your data

## Tech Stack

### Core Technologies
- **React Native** with **Expo** (Managed Workflow)
- **TypeScript** throughout the entire codebase
- **Expo SQLite** for local database storage
- **Zustand** for state management

### Navigation & UI
- **React Navigation** (Bottom Tabs + Stack Navigation)
- **React Native Reanimated** for smooth animations
- **React Native Chart Kit** for data visualization
- **Custom dark theme** with Apple-inspired minimalist design

### Architecture
- Repository pattern for data access
- Clean separation of concerns
- Type-safe database operations
- No prop drilling with centralized state management

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── EmptyState.tsx
│   ├── Input.tsx
│   ├── Picker.tsx
│   └── TransactionItem.tsx
├── db/                # Database layer
│   ├── database.ts    # SQLite initialization
│   ├── schema.ts      # Database schema
│   └── repositories/  # Data access layer
│       ├── categoryRepository.ts
│       ├── paymentMethodRepository.ts
│       ├── transactionRepository.ts
│       ├── recurringTransactionRepository.ts
│       └── settingsRepository.ts
├── hooks/             # Custom React hooks
│   └── useStats.ts    # Financial statistics hooks
├── navigation/        # Navigation setup
│   ├── AppNavigator.tsx
│   └── types.ts
├── screens/           # App screens
│   ├── OverviewScreen.tsx
│   ├── TransactionsScreen.tsx
│   ├── AddTransactionScreen.tsx
│   ├── AnalyticsScreen.tsx
│   └── SettingsScreen.tsx
├── store/             # Zustand store
│   └── index.ts
├── theme/             # Theme configuration
│   └── index.ts
├── types/             # TypeScript types
│   └── index.ts
└── utils/             # Utility functions
    ├── currency.ts
    ├── date.ts
    └── csv.ts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your iPhone 14 (available on App Store)
- macOS with Xcode (for iOS development)

### Installation

1. Clone the repository:
```bash
cd Personal-finance-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

### Running on Your iPhone 14

#### Option 1: Expo Go (Recommended for Development)

1. Install **Expo Go** from the App Store on your iPhone 14
2. Run `npx expo start` in the project directory
3. Scan the QR code with your iPhone camera
4. The app will open in Expo Go

#### Option 2: Development Build

For a more production-like experience:

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Create a development build:
```bash
eas build --profile development --platform ios
```

4. Install the build on your iPhone 14
5. Run `npx expo start --dev-client`

#### Option 3: Production Build

To create a production build for TestFlight or App Store:

1. Configure signing in app.json with your Apple Developer account
2. Run:
```bash
eas build --profile production --platform ios
```

3. Submit to TestFlight:
```bash
eas submit --platform ios
```

## Usage Guide

### Adding Transactions

1. Tap the **+** button on the Overview or Transactions screen
2. Select **Expense** or **Income**
3. Enter the amount and select currency
4. Choose a category (e.g., Food & Dining, Transportation)
5. Select payment method (Cash, Card, etc.)
6. Add an optional description
7. Tap **Add Transaction**

### Viewing Analytics

1. Navigate to the **Analytics** tab
2. Switch between Expenses and Income views
3. View category breakdown in the pie chart
4. Scroll down to see 6-month trends

### Changing Primary Currency

1. Go to **Settings** tab
2. Tap on **Primary Currency**
3. Select your preferred currency
4. Confirm the change
5. All transactions will now be converted to this currency

### Exporting Data

1. Navigate to **Settings**
2. Tap **Export to CSV**
3. Use the native share sheet to save or send the file
4. The CSV includes all transaction details

## Default Data

### Categories

**Expenses:**
- Food & Dining
- Transportation
- Shopping
- Bills & Utilities
- Entertainment
- Healthcare
- Housing
- Other

**Income:**
- Salary
- Freelance
- Investments
- Other

### Payment Methods
- Cash
- Debit Card
- Credit Card

All defaults can be customized or extended through the app.

## Database Schema

The app uses SQLite with the following tables:

- **categories**: Transaction categories with icons and colors
- **payment_methods**: Payment methods for transactions
- **transactions**: All income and expense transactions
- **recurring_transactions**: Monthly recurring transactions (future feature)
- **settings**: App configuration (primary currency, etc.)

## Currency Exchange Rates

The app uses hardcoded exchange rates (all relative to EUR = 1):
- EUR: 1.00
- USD: 0.92
- GBP: 1.17
- JPY: 0.0064
- CHF: 1.05
- CAD: 0.68
- AUD: 0.62
- CNY: 0.13

Exchange rates are deterministic and consistent across all calculations.

## Future Improvements

### Planned Features
- Live exchange rate updates (optional API integration)
- Recurring transaction automation
- Budget planning and alerts
- Multiple account support
- Advanced filtering and search
- Data backup and restore
- Biometric authentication
- iCloud sync (optional)
- Widgets for iOS home screen
- Dark/light theme toggle
- Localization (multiple languages)

### Technical Improvements
- Database migrations system
- Unit and integration tests
- CI/CD pipeline
- Performance monitoring
- Error tracking
- Offline-first sync mechanism

## Development

### Code Quality Standards
- TypeScript strict mode enabled
- No `any` types
- ESLint + Prettier configuration
- Meaningful variable and function names
- Clean, self-documenting code

### Design Principles
- Dark theme only (for now)
- Apple-inspired minimalist UI
- Subtle micro-animations
- Consistent spacing and typography
- Production-ready quality

## Troubleshooting

### App won't start
- Run `npm install` to ensure all dependencies are installed
- Clear Expo cache: `npx expo start -c`
- Restart Metro bundler

### Database errors
- The database auto-initializes on first launch
- Check that `expo-sqlite` is properly installed
- Verify iOS permissions in app.json

### Charts not displaying
- Ensure `react-native-chart-kit` and `react-native-svg` are installed
- Check that you have transactions in the current month

### CSV export not working
- Verify `expo-sharing` is installed
- Check that you have transactions to export
- Ensure app has necessary permissions

## License

This project is intended for personal use. Feel free to modify and extend it for your own needs.

## Support

For issues, questions, or contributions, please refer to the GitHub repository.

---

**Built with care for real-world daily use on iPhone 14**
