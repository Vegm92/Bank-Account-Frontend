# Bank-Account-Frontend

## components

- **Card.tsx**: Reusable component for displaying content in a card layout.
- **Navigation.tsx**: Navigation bar component for routing between different pages.
- **TransferForm.tsx**: Form component for handling money transfers between accounts.
- **TransactionForm.tsx**: Generic form component for deposit and withdrawal transactions.

## hooks

- **useTransaction.ts**: Custom hook for managing deposit and withdrawal transactions.
- **useTransfer.ts**: Custom hook for managing transfer transactions.

## pages

- **Home.tsx**: Home page component displaying account overview.
- **Deposit.tsx**: Page component for handling money deposits.
- **Withdraw.tsx**: Page component for handling money withdrawals.
- **Transfer.tsx**: Page component for handling money transfers.
- **Statement.tsx**: Page component for displaying account statement and transaction history.

## services

- **api.ts**: Service for handling API calls to the backend.

## utils

- **ibanUtils.ts**: Utility functions for IBAN generation and validation.
- **tableUtils.ts**: Utility functions for table operations (sorting, filtering) in the Statement component.
- **validators.ts**: General input validation utility functions.

## types

- **transaction.ts**: TypeScript type definitions for transaction-related data.

## Root files

- **App.tsx**: Main application component handling routing and layout.
- **main.tsx**: Entry point of the React application.
