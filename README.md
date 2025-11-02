# DEMO Website - 

https://legendary-duckanoo-7d5d4e.netlify.app/

# KINGG Restaurant Ledger

A modern, responsive React web application for managing restaurant customer ledger with credit and payment tracking.

## 🔑 Default Login Credentials

- **Universal ID:** `KINGG`
- **Universal Password:** `KINGG123`

## 📋 Prerequisites

Before you start, make sure you have installed:

1. **Node.js** (version 14 or higher)
   - Download from: https://nodejs.org/
   - Download the LTS version (recommended)

2. **A Code Editor** (optional, for viewing code)
   - VS Code: https://code.visualstudio.com/

## 🚀 How to Run on Windows

### Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Follow the installation wizard (keep all default settings)
5. Restart your computer after installation

### Step 2: Verify Installation

1. Open **Command Prompt** (Press `Win + R`, type `cmd`, press Enter)
2. Type the following commands to verify installation:

```bash
node --version
npm --version
```

You should see version numbers like `v18.x.x` and `9.x.x`

### Step 3: Extract the Project

1. Extract the `kingg-ledger` folder to your desired location
   Example: `C:\Users\YourName\Desktop\kingg-ledger`

### Step 4: Install Dependencies

1. Open **Command Prompt**
2. Navigate to the project folder:

```bash
cd C:\Users\YourName\Desktop\kingg-ledger
```

(Replace the path with your actual folder location)

3. Install all required packages:

```bash
npm install
```

This will take 2-5 minutes to download all dependencies.

### Step 5: Start the Application

1. In the same Command Prompt, run:

```bash
npm start
```

2. Wait for 10-20 seconds
3. Your default browser will automatically open
4. The app will be running at: http://localhost:3000

## 🎯 Features

### 1. Login System
- Secure login with Universal ID and Password
- Password can be changed from Settings

### 2. Customer Management
- Add new customers with auto-generated PINs
- View all customers with their balances
- Track total credits and payments

### 3. Transaction Tracking
- Add credit entries
- Add payment entries
- View complete transaction history
- Delete transactions (with password verification)

### 4. Data Storage
- All data stored in browser's localStorage
- No backend required
- Data persists between sessions

## 📱 Usage Guide

### Adding a Customer

1. Click the **"+ Add Customer"** floating button (bottom-right)
2. Enter customer name
3. Enter your Universal Password for verification
4. System auto-generates a unique 4-digit PIN
5. Customer appears in the list immediately

### Managing Transactions

1. Click **"View Ledger"** on any customer
2. Use **"+ Add Credit"** to record credit/debt
3. Use **"+ Add Payment"** to record payments received
4. Click trash icon to delete any transaction (requires password)

### Changing Password

1. Click the **Settings** icon (top-right)
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click "Change Password"

## 🛑 How to Stop the Application

1. Go to the Command Prompt where the app is running
2. Press `Ctrl + C`
3. Type `Y` and press Enter

## 🔄 How to Run Again Later

1. Open Command Prompt
2. Navigate to project folder:
   ```bash
   cd C:\Users\YourName\Desktop\kingg-ledger
   ```
3. Run:
   ```bash
   npm start
   ```

## 💾 Data Backup

Your data is stored in browser's localStorage. To backup:

1. Open the app
2. Open browser Developer Tools (Press F12)
3. Go to "Application" or "Storage" tab
4. Find "Local Storage" → "http://localhost:3000"
5. Find key "restaurantLedger"
6. Copy the value and save to a text file

To restore:
1. Open Developer Tools
2. Go to Console tab
3. Type:
   ```javascript
   localStorage.setItem('restaurantLedger', 'PASTE_YOUR_BACKUP_HERE')
   ```
4. Refresh the page

## 🐛 Troubleshooting

### Port 3000 is already in use

If you see this error, another application is using port 3000.

Solution:
1. Close any other apps running on port 3000
2. Or run on a different port:
   ```bash
   set PORT=3001 && npm start
   ```

### "npm is not recognized"

This means Node.js is not installed or not in PATH.

Solution:
1. Reinstall Node.js
2. Restart your computer
3. Try again

### Browser doesn't open automatically

Manually open your browser and go to: http://localhost:3000

### App shows blank page

Solution:
1. Press `Ctrl + Shift + R` to hard refresh
2. Clear browser cache
3. Check Command Prompt for errors

## 📞 Support

If you encounter any issues:

1. Make sure Node.js is properly installed
2. Make sure you're in the correct folder
3. Try deleting `node_modules` folder and running `npm install` again
4. Check if port 3000 is available

## 🎨 Features Overview

- ✅ Modern, responsive UI
- ✅ Gradient color schemes
- ✅ Real-time calculations
- ✅ Local data persistence
- ✅ Password protection
- ✅ Auto-generated PINs
- ✅ Transaction history
- ✅ Balance tracking
- ✅ Delete protection

## 🔒 Security Note

This app stores data in browser's localStorage. For production use with sensitive data, consider implementing:
- Backend API
- Database storage
- User authentication
- Data encryption

---

**Developed for KINGG Restaurant** 🍽️
