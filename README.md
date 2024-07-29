# Bank-Account-Frontend

# Setup (Vite)

## Environment Variables

For local development:

1. Copy `.env.example` to `.env`
2. Update the values in `.env` as needed

For production deployment:

1. Set up a GitHub Secret named `VITE_API_URL` with your production API URL
2. Ensure Netlify is configured to use this secret (see Deployment section)

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Set up the `.env` file as described above
4. Run `npm run dev` to start the development server

## Deployment

The project is set up for deployment on Netlify:

1. Ensure you have a GitHub Secret named `VITE_API_URL` set to your production API URL
2. In Netlify, link the `VITE_API_URL` environment variable to the GitHub Secret
3. Netlify will automatically use the correct API URL during build and deployment

Note: The `netlify.toml` file in the repository root configures the build settings and environment variable usage for Netlify.

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
