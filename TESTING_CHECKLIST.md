# Testing Checklist for iPhone 14

Use this checklist when testing the Finance Tracker app on your iPhone 14.

## Pre-Launch

- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npx expo start` to start the development server
- [ ] Open Expo Go on iPhone 14
- [ ] Scan the QR code
- [ ] App loads without crashes

## First Launch

- [ ] Splash screen appears
- [ ] Database initializes successfully
- [ ] Default categories are loaded
- [ ] Default payment methods are loaded
- [ ] App opens to Overview screen
- [ ] Empty states are shown

## Overview Screen

- [ ] Screen title shows "Overview"
- [ ] Total Balance card is visible and shows €0.00
- [ ] Income and Expenses cards show €0.00
- [ ] "Recent Transactions" section shows empty state
- [ ] Empty state icon and text are displayed
- [ ] FAB (+) button is visible in bottom right
- [ ] Tapping FAB opens Add Transaction modal

## Add Transaction

### Adding an Expense
- [ ] Modal opens with "Add Transaction" title
- [ ] "Expense" button is selected by default
- [ ] Amount input is visible
- [ ] Can type decimal amounts (e.g., 25.50)
- [ ] Currency picker shows EUR by default
- [ ] Category picker shows expense categories only
- [ ] Payment method picker shows options
- [ ] Description field is optional
- [ ] "Add Transaction" button is enabled
- [ ] Tapping "Add Transaction" saves and closes modal
- [ ] Transaction appears in Overview screen

### Adding an Income
- [ ] Tap "Income" button at top
- [ ] Category picker changes to income categories
- [ ] Enter amount (e.g., 1500)
- [ ] Select "Salary" category
- [ ] Add description "Monthly salary"
- [ ] Tap "Add Transaction"
- [ ] Income appears with green + prefix
- [ ] Balance updates correctly

### Validation
- [ ] Empty amount shows error when submitting
- [ ] Zero amount shows error
- [ ] Negative amount shows error
- [ ] Non-numeric input is prevented

## Transactions Screen

- [ ] Navigation to "Transactions" tab works
- [ ] Filter buttons are visible (All, Income, Expenses)
- [ ] "All" is selected by default
- [ ] All transactions are listed
- [ ] Tapping "Income" filters to income only
- [ ] Tapping "Expenses" filters to expenses only
- [ ] Transactions show correct icons
- [ ] Amounts show correct colors (green for income, red for expenses)
- [ ] Category names are displayed
- [ ] Dates are formatted correctly
- [ ] FAB (+) button works from this screen

## Edit Transaction

- [ ] Tap any transaction in the list
- [ ] Edit screen opens with "Edit Transaction" title
- [ ] All fields are pre-filled with existing data
- [ ] Can modify amount
- [ ] Can change category
- [ ] Can change payment method
- [ ] Can edit description
- [ ] "Update" button saves changes
- [ ] Changes are reflected in list
- [ ] "Delete" button is visible
- [ ] Tapping "Delete" shows confirmation dialog
- [ ] Confirmation dialog has "Cancel" and "Delete" buttons
- [ ] Confirming deletes the transaction
- [ ] Deleted transaction disappears from list

## Multi-Currency

### Adding Transaction in Different Currency
- [ ] Add new expense
- [ ] Select USD as currency
- [ ] Enter amount: 100
- [ ] Complete transaction
- [ ] Transaction shows both USD amount and EUR converted amount
- [ ] Balance is updated with converted amount

### Changing Primary Currency
- [ ] Go to Settings
- [ ] Tap "Primary Currency" picker
- [ ] Select USD
- [ ] Confirmation dialog appears
- [ ] Confirm the change
- [ ] All amounts now display in USD
- [ ] Conversions are recalculated
- [ ] Previous transaction amounts update

## Analytics Screen

### With No Data
- [ ] Empty state is shown
- [ ] Icon and message are clear

### With Data (After Adding Transactions)
- [ ] Pie chart appears
- [ ] Chart shows category breakdown
- [ ] Colors are distinct
- [ ] Percentages are displayed
- [ ] "Top Categories" list shows items
- [ ] Each category shows:
  - [ ] Color indicator
  - [ ] Category name
  - [ ] Amount
  - [ ] Percentage
- [ ] Toggle to "Income" view works
- [ ] Income categories are shown
- [ ] Bar chart displays 6-month trend
- [ ] Months are labeled
- [ ] Bars are proportional

## Settings Screen

### General Section
- [ ] Primary Currency picker is visible
- [ ] Current currency is selected
- [ ] Changing currency shows confirmation
- [ ] Hint text is displayed

### Data Section
- [ ] "Export to CSV" button is visible
- [ ] Tapping button with no data shows alert
- [ ] With transactions, export works
- [ ] iOS share sheet appears
- [ ] Can save file
- [ ] Can share via AirDrop/Messages

### Statistics Section
- [ ] Total Transactions count is correct
- [ ] Income Transactions count is correct
- [ ] Expense Transactions count is correct

### About Section
- [ ] App name is shown: "Finance Tracker"
- [ ] Version is shown: "1.0.0"
- [ ] Description text is visible

## Navigation

- [ ] Bottom tabs are visible
- [ ] All 4 tabs are accessible
- [ ] Tab icons are displayed
- [ ] Active tab is highlighted in blue
- [ ] Inactive tabs are gray
- [ ] Tab bar has proper dark background
- [ ] Tapping tabs switches screens instantly
- [ ] Screen titles match tabs

## UI/UX Details

### Theme
- [ ] App uses dark theme consistently
- [ ] Background is dark (#0A0A0A)
- [ ] Cards are elevated (#1A1A1A)
- [ ] Text is readable (white/gray)
- [ ] Primary color is blue (#4A9EFF)

### Typography
- [ ] Headings are clear and large
- [ ] Body text is readable
- [ ] Small text is not too small
- [ ] Font weights are consistent

### Spacing
- [ ] Consistent padding around elements
- [ ] Cards have proper spacing
- [ ] Lists have good spacing
- [ ] Buttons are easy to tap

### Interactions
- [ ] Buttons respond to taps
- [ ] Active opacity provides feedback
- [ ] Modals slide in smoothly
- [ ] Transitions are smooth
- [ ] No janky animations

## Edge Cases

### Large Amounts
- [ ] Enter amount: 999999.99
- [ ] Displays correctly
- [ ] No overflow issues

### Long Descriptions
- [ ] Enter 200 character description
- [ ] Text wraps properly
- [ ] Doesn't break layout

### Many Transactions
- [ ] Add 20+ transactions
- [ ] List scrolls smoothly
- [ ] Performance is good
- [ ] Charts render correctly

### Future Dates
- [ ] Can select future dates (if date picker implemented)
- [ ] Future transactions appear in list
- [ ] Included in balance calculations

### Zero Balance
- [ ] Delete all transactions
- [ ] Balance shows €0.00
- [ ] Analytics show empty state
- [ ] No crashes

## App Lifecycle

- [ ] Close app completely
- [ ] Reopen app
- [ ] All data is still there
- [ ] Database persists correctly

- [ ] Add transaction
- [ ] Put app in background (home button)
- [ ] Reopen app
- [ ] Transaction is saved

- [ ] Force quit app (swipe up)
- [ ] Reopen app
- [ ] All data intact

## Keyboard Handling

- [ ] Keyboard opens for amount input
- [ ] Keyboard is numeric for amount
- [ ] Keyboard is default for description
- [ ] Tapping outside dismisses keyboard
- [ ] Form remains visible with keyboard open
- [ ] Can scroll to see all fields

## Error Handling

- [ ] Try to add transaction with no category selected
- [ ] Error message is clear
- [ ] Form doesn't submit

- [ ] Try to export with no transactions
- [ ] Alert message is shown
- [ ] User-friendly message

## Performance

- [ ] App launches in < 3 seconds
- [ ] Screens load instantly
- [ ] Transitions are 60fps
- [ ] No lag when typing
- [ ] Charts render quickly
- [ ] List scrolling is smooth

## Final Verification

- [ ] No console errors in terminal
- [ ] No visual glitches
- [ ] All features work as expected
- [ ] App feels polished and complete
- [ ] Would use this app daily ✓

---

## Issues Found

Document any issues you find during testing:

1.
2.
3.

---

## Sign-off

- [ ] All critical features tested
- [ ] All sections of checklist completed
- [ ] App is ready for daily use
- [ ] Ready to recommend to others

Tested by: ________________
Date: ________________
iPhone Model: iPhone 14
iOS Version: ________________
