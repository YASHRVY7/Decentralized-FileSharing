
# 🌐 Decentralized File Storage System

[![Solidity](https://img.shields.io/badge/Solidity-0.8.0-blue.svg?logo=ethereum)](https://soliditylang.org/)  
[![IPFS](https://img.shields.io/badge/IPFS-Storage-green.svg?logo=ipfs)](https://ipfs.tech/)  
[![Web3.js](https://img.shields.io/badge/Web3.js-Integration-orange.svg?logo=javascript)](https://web3js.readthedocs.io/)  
[![MetaMask](https://img.shields.io/badge/MetaMask-Enabled-yellow.svg?logo=metamask)](https://metamask.io/)  
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](./LICENSE)

A **secure and decentralized file storage dApp** built using **Ethereum Smart Contracts**, **IPFS**, and **Pinata**.  
This system allows users to **upload**, **share**, and **manage** files safely — all while maintaining **data ownership** and **transparency** on the blockchain.

> 🔒 Designed for **simplicity**, **security**, and **real-world usability**.

---

## 🖼️ Project Preview
<img width="1908" height="908" alt="image" src="https://github.com/user-attachments/assets/2790bec5-70f3-48e3-8bd8-81c7d27ef66b" />
<img width="1882" height="789" alt="image" src="https://github.com/user-attachments/assets/8377bb7f-bc34-4444-9b0c-0f202f296a9a" />

<img width="1906" height="775" alt="image" src="https://github.com/user-attachments/assets/ad6e5887-43ca-4e21-8d5d-b5236c778cc9" />


---

## 🚀 Overview

This project combines **blockchain-based access control** with **IPFS decentralized storage**.  
Users can upload files to IPFS via Pinata, and a **4-digit key** ensures only authorized users can access shared files.

---

## ⚙️ Tech Stack

| Component | Technology Used |
|------------|----------------|
| **Smart Contract** | Solidity (Ethereum) |
| **Storage** | IPFS via Pinata |
| **Blockchain Access** | MetaMask + Web3.js |
| **Frontend** | HTML, Bootstrap, JavaScript |
| **Framework** | Truffle / Hardhat |

---

## 🌟 Features

### 🗂️ File Upload
- Upload files to **IPFS** through **Pinata**.
- Metadata (name, description, timestamp) stored on the blockchain.

### 🔑 Secure Access Control
- Owners can share files by specifying:
  - Receiver’s Ethereum address  
  - File’s IPFS hash  
  - A **4-digit access key**  
- Only users with the correct key can access shared files.

### 👥 Shared Access List
- View all addresses with granted access to a file.
- Manage and revoke access easily.

### 📥 Direct File Download
- Download directly from IPFS — no need to open the file in the browser.

### 🦊 MetaMask Integration
- Authenticate and sign blockchain transactions securely via MetaMask.

---

## 🧩 Project Structure

```
project/
│
├── contracts/
│   └── FileStorage.sol          # Smart contract logic
│
├── build/
│   └── contracts/
│       └── FileStorage.json     # ABI & bytecode
│
├── app.js                       # Frontend logic (Web3 + Pinata)
├── index.html                   # UI (Bootstrap + MetaMask)
└── README.md                    # Documentation
```

---

## 💻 Smart Contract – `FileStorage.sol`

### 🧱 Data Structures
- **File Struct**
  - IPFS hash, file name, description, timestamp, owner’s address  
- **Access Mapping**
  - IPFS hash → list of authorized addresses  
- **Key Mapping**
  - Receiver’s address + IPFS hash → 4-digit key  

### 🔧 Core Functions
| Function | Description |
|-----------|-------------|
| `uploadFile` | Store file metadata on-chain |
| `grantAccess` | Grant access to another user |
| `hasAccess` | Verify access using 4-digit key |
| `getFileDetails` | Retrieve file metadata |
| `getFileAccessList` | View all authorized users |

---

## 🌐 Frontend Overview

### 🖥️ Components
- **Navbar** – MetaMask connect + share button  
- **Upload Form** – File upload + metadata  
- **Files Table** – Displays uploaded files  
- **Access Form** – Unlock shared files  
- **Share Modal** – Grant access securely  

### 🔄 Workflow
1. **Connect MetaMask** → Initialize Web3.js connection  
2. **Upload File** → Upload to IPFS + record metadata on-chain  
3. **Grant Access** → Add receiver + 4-digit key to contract  
4. **Access File** → Verify key, retrieve IPFS hash  
5. **Download File** → Fetch directly from IPFS  

---

## ⚙️ Setup Guide

### 🧰 Requirements
- Node.js and npm  
- MetaMask  
- Pinata account  
- Truffle or Hardhat  

### 🧩 Installation
```bash
# Clone the repo
git clone https://github.com/<your-username>/decentralized-file-storage.git
cd decentralized-file-storage

# Install dependencies
npm install

# Compile and deploy the contract
truffle compile
truffle migrate --network <network-name>
```

### 🌍 Configure Frontend
Edit `app.js` with your:
- **Pinata API Key & Secret**
- **Deployed Smart Contract Address**

### ▶️ Run Application
```bash
npx live-server
```
Open `index.html` in your browser and connect MetaMask.

---

## 📊 Example Usage

| Action | User | Result |
|--------|------|---------|
| Upload File | Owner | IPFS hash & metadata stored |
| Share File | Owner | Access granted using 4-digit key |
| Access File | Receiver | Contract verifies key |
| Download | Receiver | File fetched from IPFS |

---

## 🧾 License

This project is released under the **MIT License**.  
You’re free to use, modify, and distribute it with proper credit.

---

## 🙌 Acknowledgements
- [Ethereum](https://ethereum.org/)  
- [IPFS](https://ipfs.tech/)  
- [Pinata](https://www.pinata.cloud/)  
- [MetaMask](https://metamask.io/)  
- [Web3.js](https://web3js.readthedocs.io/)

---

## 💡 Conclusion

This project showcases the potential of **decentralized file storage** by integrating blockchain access control with IPFS data storage.  
With the **4-digit key authentication**, it ensures that only **authorized users** can view or download shared files.

````
