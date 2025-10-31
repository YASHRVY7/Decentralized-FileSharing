
# 🌐 Decentralized File Storage System

A **secure and decentralized file storage dApp** built using **Ethereum Smart Contracts**, **IPFS**, and **Pinata**.  
This system allows users to **upload**, **share**, and **manage** files safely — all while maintaining **data ownership** and **transparency** on the blockchain.

---

## 🚀 Overview

The project combines **blockchain-based access control** with **IPFS decentralized storage**.  
Users can upload files to IPFS via Pinata, and a **4-digit key** mechanism ensures only authorized users can access shared files.

> 🔒 Designed for **simplicity**, **security**, and **real-world usability**.

---

## ⚙️ Tech Stack

| Component | Technology Used |
|------------|----------------|
| **Smart Contract** | Solidity (Ethereum) |
| **Decentralized Storage** | IPFS via Pinata |
| **Blockchain Access** | MetaMask + Web3.js |
| **Frontend** | HTML, Bootstrap, JavaScript |
| **Framework (Optional)** | Truffle / Hardhat for deployment |

---

## 🌟 Key Features

### 🗂️ 1. File Upload
- Upload files to **IPFS** via **Pinata**.
- Metadata (name, description, timestamp) stored in the smart contract.
- Files displayed with IPFS hashes on the frontend.

### 🔑 2. Secure Access Control
- File owners can grant access to others by providing:
  - Receiver’s Ethereum address
  - File’s IPFS hash
  - A **4-digit access key**
- Only users with the correct key can view/download shared files.

### 👥 3. Shared Access List
- View all addresses granted access to each file.
- Helps manage permissions and revoke access easily.

### 📥 4. Direct File Download
- Download files **directly from IPFS** without opening them in the browser.

### 🦊 5. MetaMask Integration
- MetaMask used for secure wallet-based authentication.
- All blockchain transactions are signed using the user’s wallet.

---

## 🧩 Project Architecture

```
project/
│
├── contracts/                  # Solidity smart contracts
│   └── FileStorage.sol         # Main smart contract logic
│
├── build/                      # Auto-generated after compilation
│   └── contracts/
│       └── FileStorage.json    # ABI and bytecode
│
├── app.js                      # Frontend JS (Web3 + Pinata logic)
├── index.html                  # Frontend UI (Bootstrap + MetaMask)
└── README.md                   # Project documentation
```

---

## 💻 Smart Contract – `FileStorage.sol`

### 🧱 Core Data Structures
- **File Struct**: Stores
  - IPFS hash  
  - File name, description, timestamp  
  - Owner’s address  
- **Access Mapping**: Links IPFS hash → list of authorized addresses  
- **Key Mapping**: Stores receiver’s address + IPFS hash → 4-digit key  

### 🔧 Key Functions
| Function | Description |
|-----------|-------------|
| `uploadFile` | Stores file metadata (IPFS hash, name, etc.) |
| `grantAccess` | Grants file access to another user |
| `hasAccess` | Verifies user access using 4-digit key |
| `getFileDetails` | Retrieves metadata of a file |
| `getFileAccessList` | Lists all users with access to a file |

---

## 🌐 Frontend Overview

### 🖥️ Components
- **Navbar** – MetaMask connect & file sharing
- **Upload Form** – For file uploads
- **Files Table** – Displays uploaded files
- **Access List Table** – Shows shared access per file
- **Access Form** – For receivers to unlock shared files
- **Share Modal** – Allows owners to grant file access

### 🔄 Workflow
1. **Connect MetaMask** – Initialize Web3.js connection.  
2. **Upload File** – Upload to IPFS → Store metadata on-chain.  
3. **Grant Access** – Share file by setting receiver address + 4-digit key.  
4. **Access File** – Receivers enter sender address, hash, and key.  
5. **Download File** – Retrieve from IPFS via direct download link.  

---

## ⚙️ Setup Instructions

### 🧰 Prerequisites
- [Node.js](https://nodejs.org/)
- [MetaMask](https://metamask.io/)
- [Pinata Account](https://pinata.cloud/)
- [Truffle](https://trufflesuite.com/) or [Hardhat](https://hardhat.org/)

### 🔨 Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/decentralized-file-storage.git
cd decentralized-file-storage

# 2. Install dependencies
npm install

# 3. Compile and deploy the smart contract
truffle compile
truffle migrate --network <network-name>
```

### 🌍 Configure the Frontend
- Open `app.js` and add:
  - **Pinata API Key** and **Secret**
  - **Deployed Smart Contract Address**

### ▶️ Run the App
```bash
# Serve locally
npx live-server
```
Open `index.html` in your browser and connect MetaMask.

---

## 🧠 How It Works

1. **File Upload** → Pinata uploads → IPFS returns hash  
2. **Smart Contract** → Stores metadata & owner info  
3. **Grant Access** → Save receiver, hash, and key  
4. **Verify Key** → Smart contract authenticates request  
5. **Access File** → IPFS delivers the file to authorized users  

---

## 📊 Example Flow

| Action | User | Result |
|--------|------|---------|
| Upload file | Owner | File hash & metadata stored |
| Share file | Owner | Access granted via 4-digit key |
| Access file | Receiver | Smart contract validates access |
| Download file | Receiver | File fetched directly from IPFS |

---

## 🧾 License

This project is released under the **MIT License**.  
You’re free to use, modify, and distribute it with proper attribution.

---

## 🙌 Acknowledgements
- [Ethereum](https://ethereum.org/)
- [IPFS](https://ipfs.tech/)
- [Pinata](https://www.pinata.cloud/)
- [MetaMask](https://metamask.io/)
- [Web3.js](https://web3js.readthedocs.io/)

---

## 💡 Conclusion

This project showcases the power of **decentralized applications (dApps)** by integrating blockchain-based authentication with IPFS file storage.  
Through its **4-digit key access system**, it ensures that **only authorized users** can view shared content — making it an ideal foundation for future decentralized cloud systems.

> ✨ *Built to make file storage simple, secure, and truly decentralized.*
````

Would you like me to include **badges** (like `Solidity`, `IPFS`, `Web3.js`, etc.) and a **preview image section** (for your app UI screenshot)? Those make the README look even more professional for GitHub.
