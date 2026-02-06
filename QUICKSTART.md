# Quick Start Guide

## Run the App in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Expo Development Server
```bash
npx expo start
```

### 3. Run on Your iPhone 14

**Option A: Using Expo Go (Easiest)**
1. Download "Expo Go" from the App Store
2. Scan the QR code from the terminal with your iPhone camera
3. App will open in Expo Go

**Option B: Web Browser (For Testing)**
- Press `w` in the terminal to open in web browser
- Note: Some features like SQLite may not work in web

## First Time Using the App?

### Adding Your First Transaction
1. Tap the **+** button on the home screen
2. Choose "Expense" or "Income"
3. Enter amount (e.g., 50.00)
4. Select a category (e.g., "Food & Dining")
5. Add a description (optional)
6. Tap "Add Transaction"

### Viewing Analytics
- Navigate to the **Analytics** tab to see charts and breakdowns
- Switch between Income and Expenses views
- View 6-month trends

### Changing Your Currency
1. Go to **Settings** tab
2. Tap "Primary Currency"
3. Select your preferred currency
4. All transactions will auto-convert

## Features at a Glance

- **Multi-currency support**: 8 currencies (EUR, USD, GBP, JPY, CHF, CAD, AUD, CNY)
- **Auto-conversion**: All amounts converted to your primary currency
- **Categories**: Pre-loaded expense and income categories
- **Analytics**: Pie charts, bar charts, and detailed breakdowns
- **Export**: Export all data as CSV
- **Local storage**: Everything stored on device with SQLite
- **No login required**: 100% local, no servers, no authentication

## Common Commands

```bash
# Start development server
npx expo start

# Clear cache and restart
npx expo start -c

# Check for TypeScript errors
npx tsc --noEmit

# Install new dependencies
npm install

# Check app configuration
cat app.json
```

## Troubleshooting

**App won't start?**
- Run `npm install` again
- Try `npx expo start -c` to clear cache

**Can't see QR code?**
- Make sure you're connected to the same WiFi network
- Try pressing `shift+d` to switch to development mode

**Database errors?**
- The app auto-initializes the database on first launch
- If issues persist, delete and reinstall the app

## File Structure Reference

```
src/
├── components/      # UI components (Button, Card, Input, etc.)
├── db/             # Database layer (SQLite + repositories)
├── hooks/          # Custom React hooks
├── navigation/     # React Navigation setup
├── screens/        # App screens (Overview, Transactions, etc.)
├── store/          # Zustand state management
├── theme/          # Dark theme configuration
├── types/          # TypeScript type definitions
└── utils/          # Utility functions (currency, date, CSV)
```

## Next Steps

- Explore all four tabs: Overview, Transactions, Analytics, Settings
- Add multiple transactions to see real analytics
- Try filtering transactions by type
- Export your data as CSV
- Customize categories in Settings

For detailed documentation, see [README.md](./README.md)
