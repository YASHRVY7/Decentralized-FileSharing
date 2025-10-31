// Import Web3 library
const web3 = new Web3(window.ethereum);

// Pinata API credentials (Replace with your actual JWT token)
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMGUxY2IwMC1mYzg4LTQ2YjAtYTFlOC1hYzA5MzMyYmUwZDkiLCJlbWFpbCI6InNoYXJ2ZXNobTQ4MEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDRhYzExODRlMmMzOWFlYTQxM2IiLCJzY29wZWRLZXlTZWNyZXQiOiJkZDg4Nzg0MDc0MGIwZmM5ZmFjOGI1ZjljNjEwNmNhZmY3ZjllN2Y0ZjFmYTg1YTgyNjJiNjQ4NGNiNDg5ZGM2IiwiZXhwIjoxNzcxMTU5MDI2fQ.7NOqS5Z0WjCtImuaOBOZ54Cjs1-mYpXsgPgVOWy3HE4"; // Replace with your Pinata JWT token

// AES Encryption Secret Key - This should be a secure key in production
const AES_SECRET_KEY = "FileStorageSecretKey123"; // Replace with a strong secret key in production

// Smart contract ABI and address
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "AccessGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "AccessRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "FileAccessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "FileUploaded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "accessList",
    "outputs": [
      {
        "internalType": "bool",
        "name": "hasAccess",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "accessKey",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "grantedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "accessedFiles",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "fileAccessList",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "fileShareHistory",
    "outputs": [
      {
        "internalType": "address",
        "name": "originalOwner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "sharedBy",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "sharedTo",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "sharedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "files",
    "outputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userFiles",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "uploadFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "accessKey",
        "type": "string"
      }
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "accessKey",
        "type": "string"
      }
    ],
    "name": "verifyAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "recordFileAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getAccessedFiles",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getFilesByUser",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "getFileDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "getFileAccessList",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getAccessDetails",
    "outputs": [
      {
        "internalType": "bool",
        "name": "hasAccess",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "grantedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "getFileShareHistory",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "originalOwners",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "sharedBy",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "sharedTo",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "sharedAt",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
  ] ; // Copy from build/contracts/FileStorage.json
const contractAddress = "0xf3C7e7Fc561944B5ad56Ef0519286F115251d58D"; // Replace with your deployed contract address
let contract;
let accounts;
let isConnected = false;

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Add interactive chart controls
    const chartContainer = document.querySelector('.transaction-chart');
    if (chartContainer) {
        // Create control buttons
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'd-flex gap-2 justify-content-end mb-2';
        controlsDiv.innerHTML = `
            <div class="btn-group btn-group-sm" role="group" aria-label="Chart type">
                <button type="button" class="btn btn-outline-secondary active" data-chart-type="bar">
                    <i class="bi bi-bar-chart-fill"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary" data-chart-type="line">
                    <i class="bi bi-graph-up"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary" data-chart-type="pie">
                    <i class="bi bi-pie-chart-fill"></i>
                </button>
            </div>
        `;
        
        // Insert controls before the canvas
        const canvasElement = document.getElementById('transactionHistoryChart');
        if (canvasElement) {
            chartContainer.insertBefore(controlsDiv, canvasElement);
            
            // Add event listeners to chart type buttons
            const chartTypeButtons = document.querySelectorAll('[data-chart-type]');
            chartTypeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Update active state
                    chartTypeButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Get selected chart type
                    const chartType = this.getAttribute('data-chart-type');
                    
                    // Update chart if it exists
                    if (globalChart) {
                        // Get current data
                        const data = globalChart.data;
                        
                        // Destroy current chart
                        globalChart.destroy();
                        
                        // Create new chart with selected type
                        const ctx = document.getElementById('transactionHistoryChart').getContext('2d');
                        
                        // Configure options based on chart type
                        let options = {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: chartType === 'pie' ? 'right' : 'top',
                                    labels: {
                                        color: '#adb5bd'
                                    }
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false
                                }
                            }
                        };
                        
                        // Add scales for bar and line charts
                        if (chartType !== 'pie') {
                            options.scales = {
                                x: {
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.05)'
                                    },
                                    ticks: {
                                        color: '#adb5bd'
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.05)'
                                    },
                                    ticks: {
                                        color: '#adb5bd',
                                        precision: 0
                                    }
                                }
                            };
                        }
                        
                        // Create new chart
                        globalChart = new Chart(ctx, {
                            type: chartType,
                            data: data,
                            options: options
                        });
                    }
                });
            });
        }
    }
});

// Connect to MetaMask and load files
async function connectMetamask() {
  try {
    console.log("Attempting to connect to MetaMask...");
    
    // Check if MetaMask is installed
    if (!window.ethereum) {
      showAlert("error", "MetaMask is not installed. Please install MetaMask to use this application.");
      return false;
    }
    
    // Show loading state
    const connectButton = document.getElementById('connectMetamask');
    if (connectButton) {
    try {
            showLoadingState('connectMetamask', true);
      } catch (loadingError) {
        console.error("Error showing loading state:", loadingError);
        // Continue despite error with loading state
      }
    } else {
      console.warn("Connect button element not found in DOM");
    }
    
    // Initialize Web3 with safety check
    try {
      console.log("Initializing Web3...");
      window.web3 = new Web3(window.ethereum);
    } catch (web3Error) {
      console.error("Error initializing Web3:", web3Error);
      showAlert("error", "Failed to initialize Web3: " + web3Error.message);
      
      // Reset the connect button
      if (connectButton) {
        showLoadingState('connectMetamask', false);
      }
      return false;
    }
    
    // Request account access
    let accounts;
    try {
      console.log("Requesting accounts from MetaMask...");
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Accounts received:", accounts);
      
      if (!accounts || accounts.length === 0) {
        showAlert("error", "No accounts found. Please unlock your MetaMask wallet.");
        
        // Reset the connect button
        if (connectButton) {
          showLoadingState('connectMetamask', false);
        }
        return false;
      }
    } catch (accountError) {
      console.error("Error requesting accounts:", accountError);
      
      // Handle user rejection of MetaMask connection separately
      if (accountError.code === 4001) {
        showAlert("error", "MetaMask connection was rejected. Please try again and approve the connection request.");
      } else {
        showAlert("error", "Error connecting to MetaMask: " + accountError.message);
      }
      
      // Reset the connect button
      if (connectButton) {
            showLoadingState('connectMetamask', false);
      }
      return false;
    }
    
    // Make global accounts variable point to the accounts array
    window.accounts = accounts;
    
    // Don't update temporary account variables 
    // THIS IS KEY - make sure we use window.accounts globally
    const userAccount = window.accounts[0];
    console.log("Connected to account:", userAccount);
    
    // Initialize contract with safety check
    try {
      console.log("Initializing contract at address:", contractAddress);
      if (!contractABI) {
        throw new Error("Contract ABI is not defined");
      }
      window.contract = new window.web3.eth.Contract(contractABI, contractAddress);
      
      // Update global contract variable to point to the new contract instance
      contract = window.contract;
      
      // Verify contract is initialized correctly
      if (!window.contract || !window.contract.methods) {
        throw new Error("Contract initialization failed - methods not available");
      }
      console.log("Contract initialized successfully");
    } catch (contractError) {
      console.error("Error initializing contract:", contractError);
      showAlert("error", "Failed to initialize contract: " + contractError.message);
      
      // Reset the connect button
      if (connectButton) {
        showLoadingState('connectMetamask', false);
      }
      return false;
    }
    
    // Update global isConnected variable
    window.isConnected = true;
    isConnected = true;
    
    // Rest of the function...
    
    // Update UI to show connected state - with safety checks
    try {
      // Update account display
      const accountsElement = document.getElementById('accounts');
      if (accountsElement) {
        accountsElement.textContent = formatAddressForDisplay(userAccount);
      }
      
      // Update connect section visibility
      const connectSection = document.getElementById('connectSection');
      if (connectSection) {
        connectSection.classList.add('d-none');
      }
      
      // Update connected section visibility
      const connectedSection = document.getElementById('connectedSection');
      if (connectedSection) {
        connectedSection.classList.remove('d-none');
      }
      
      // Show account badge
      const accountBadge = document.getElementById('accountBadge');
      if (accountBadge) {
        accountBadge.textContent = formatAddressForDisplay(userAccount);
        accountBadge.classList.remove('d-none');
      }
      
      // Update connect button
      if (connectButton) {
        connectButton.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Connected to MetaMask';
        connectButton.classList.remove('btn-primary');
        connectButton.classList.add('btn-success');
        showLoadingState('connectMetamask', false);
      }
      
      // Set isConnected flag
      window.isConnected = true;
    } catch (uiError) {
      console.error("Error updating UI after connection:", uiError);
      // Continue despite UI errors
    }
    
    // Load files for the account with error handling
    try {
      console.log("Loading files for account:", userAccount);
      await loadFilesForAccount(userAccount);
      console.log("Files loaded successfully");
    } catch (filesError) {
      console.error("Error loading files:", filesError);
      showAlert("error", "Error loading your files: " + filesError.message);
      // Continue despite file loading errors
    }
    
    // Load global file share history with error handling
    try {
      console.log("Loading global file share history...");
      await loadGlobalFileShareHistory();
      console.log("Transaction history loaded successfully");
    } catch (historyError) {
      console.error("Error loading transaction history:", historyError);
      showAlert("error", "Error loading transaction history: " + historyError.message);
      // Continue despite history loading errors
    }
    
    // Set up event listeners for MetaMask account changes
    try {
      // Remove any existing listeners first to prevent duplicates
      // The problem is here - we're using null as the listener which causes an error
      // Instead of trying to remove with null, we'll simply overwrite any existing listeners
      // by using the 'on' method which replaces existing listeners
      
      window.ethereum.on('accountsChanged', async (newAccounts) => {
        console.log("MetaMask accounts changed:", newAccounts);
        window.accounts = newAccounts;
        
        if (!newAccounts || newAccounts.length === 0) {
          console.log("User disconnected from MetaMask");
          
          // Update UI with safety checks
          const connectSectionEvent = document.getElementById('connectSection');
          const connectedSectionEvent = document.getElementById('connectedSection');
          const accountBadgeEvent = document.getElementById('accountBadge');
          
          if (connectSectionEvent) {
            connectSectionEvent.classList.remove('d-none');
          }
          
          if (connectedSectionEvent) {
            connectedSectionEvent.classList.add('d-none');
          }
          
          if (accountBadgeEvent) {
            accountBadgeEvent.classList.add('d-none');
          }
          
          if (connectButton) {
            connectButton.innerHTML = '<i class="bi bi-wallet2 me-2"></i>Connect MetaMask';
            connectButton.classList.remove('btn-success');
            connectButton.classList.add('btn-primary');
          }
          
          // Update isConnected flag
          window.isConnected = false;
          
          // Clear tables and show empty state
          clearTables();
          showEmptyState();
          
          // Update transaction history
          try {
            await loadGlobalFileShareHistory();
          } catch (error) {
            console.error("Error updating transaction history after disconnect:", error);
    }
  } else {
          // Account changed but still connected
          const newAccount = newAccounts[0];
          console.log("Switched to account:", newAccount);
          
          // Update UI with safety checks
          try {
            const accountsElementEvent = document.getElementById('accounts');
            if (accountsElementEvent) {
              accountsElementEvent.textContent = formatAddressForDisplay(newAccount);
            }
            
            const accountBadgeEvent = document.getElementById('accountBadge');
            if (accountBadgeEvent) {
              accountBadgeEvent.textContent = formatAddressForDisplay(newAccount);
            }
          } catch (uiError) {
            console.error("Error updating UI after account change:", uiError);
          }
          
          // Load files for the new account
          try {
            await loadFilesForAccount(newAccount);
          } catch (error) {
            console.error("Error loading files for new account:", error);
            showAlert("error", "Error loading files for new account: " + error.message);
          }
          
          // Update transaction history
          try {
            await loadGlobalFileShareHistory();
          } catch (error) {
            console.error("Error updating transaction history after account change:", error);
            showAlert("error", "Error updating transaction history: " + error.message);
          }
        }
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', async (chainId) => {
        console.log("MetaMask chain changed to:", chainId);
        showAlert("info", "Blockchain network changed. Reloading application...");
        
        // Reload the page on chain change as recommended by MetaMask
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
    } catch (listenerError) {
      console.error("Error setting up MetaMask event listeners:", listenerError);
      // Continue despite listener setup errors
    }
    
    return true;
    
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    showAlert("error", "Error connecting to MetaMask: " + error.message);
    
    const connectButton = document.getElementById('connectMetamask');
    if (connectButton) {
      showLoadingState('connectMetamask', false);
    }
    
    return false;
  }
}

// Upload File to IPFS
document.getElementById('uploadButton').addEventListener('click', async () => {
    if (!isConnected) {
        return showAlert('error', 'Please connect to MetaMask first.');
    }

  const file = document.getElementById('fileInput').files[0];
  const fileName = document.getElementById('fileNameInput').value.trim();
  const description = document.getElementById('descriptionInput').value.trim();

  if (!file || !fileName || !description) {
        return showAlert('error', 'Please select a file and provide a name and description.');
  }

  try {
        showLoadingState('uploadButton', true);
        const fileHash = await uploadToIPFS(file);

    await window.contract.methods.uploadFile(fileHash, fileName, description).send({
      from: window.accounts[0],
            gas: 3000000
        });

        showAlert('success', `File uploaded successfully! IPFS Hash: ${fileHash}`);
        await loadFilesForAccount(window.accounts[0]);
        clearUploadForm();
  } catch (error) {
        console.error('Upload error:', error);
        showAlert('error', 'Error uploading file: ' + error.message);
    } finally {
        showLoadingState('uploadButton', false);
  }
});

// Share File Access
document.getElementById('shareButton').addEventListener('click', () => {
    if (!isConnected) {
        return showAlert('error', 'Please connect to MetaMask first.');
    }
  const modal = new bootstrap.Modal(document.getElementById('shareModal'));
  modal.show();
});

// Grant Access with 4-digit key
document.getElementById('grantAccessButton').addEventListener('click', async () => {
    if (!isConnected) {
        return showAlert('error', 'Please connect to MetaMask first.');
    }

  const receiver = document.getElementById('receiverAddress').value.trim();
  const fileHash = document.getElementById('shareFileHash').value.trim();
    const accessKey = document.getElementById('accessKey').value.trim();

  if (!window.web3.utils.isAddress(receiver)) {
        return showAlert('error', 'Invalid Ethereum address.');
  }

  if (!fileHash) {
        return showAlert('error', 'Please enter a valid file hash.');
    }

    if (!/^\d{4}$/.test(accessKey)) {
        return showAlert('error', 'Please enter a valid 4-digit access key.');
  }

  try {
        showLoadingState('grantAccessButton', true);
        await window.contract.methods.grantAccess(fileHash, receiver, accessKey).send({
      from: window.accounts[0],
            gas: 3000000
        });

        showAlert('success', `Access granted to ${receiver}`);
        await loadFilesForAccount(window.accounts[0]);
        clearShareForm();
    const modal = bootstrap.Modal.getInstance(document.getElementById('shareModal'));
    modal.hide();
  } catch (error) {
        console.error('Grant access error:', error);
        showAlert('error', 'Error granting access: ' + error.message);
    } finally {
        showLoadingState('grantAccessButton', false);
    }
});

// Access Shared File with 4-digit key
document.getElementById('accessFileButton').addEventListener('click', async () => {
    if (!isConnected) {
        return showAlert('error', 'Please connect to MetaMask first.');
    }

  const sender = document.getElementById('senderAddress').value.trim();
  const fileHash = document.getElementById('fileHashInput').value.trim();
    const accessKey = document.getElementById('accessKeyInput').value.trim();

  if (!window.web3.utils.isAddress(sender)) {
        return showAlert('error', 'Invalid sender address.');
  }

  if (!fileHash) {
        return showAlert('error', 'Please enter a valid file hash.');
    }

    if (!/^\d{4}$/.test(accessKey)) {
        return showAlert('error', 'Please enter a valid 4-digit access key.');
  }

  try {
        showLoadingState('accessFileButton', true);
        const hasAccess = await window.contract.methods.verifyAccess(fileHash, window.accounts[0], accessKey).call();
        
    if (hasAccess) {
            // Record the file access in the smart contract
            await window.contract.methods.recordFileAccess(fileHash, window.accounts[0]).send({
                from: window.accounts[0],
                gas: 3000000
            });

      const fileDetails = await window.contract.methods.getFileDetails(fileHash).call();
            const accessDetails = await window.contract.methods.getAccessDetails(fileHash, window.accounts[0]).call();
            
            addFileToTable(fileDetails, fileHash, accessDetails.grantedAt, true);
            showAlert('success', 'Access verified! File added to your list.');
            clearAccessForm();
            
            // Reload the files to update the table
            await loadFilesForAccount(window.accounts[0]);
    } else {
            showAlert('error', 'Access denied. Please check your access key.');
    }
  } catch (error) {
        console.error('Access verification error:', error);
        showAlert('error', 'Error verifying access: ' + error.message);
    } finally {
        showLoadingState('accessFileButton', false);
    }
});

// Load files and shared access list
async function loadFilesForAccount(account) {
  try {
        clearTables();
    
    // Check if contract is initialized
    if (!window.contract || !window.contract.methods) {
      console.error("Contract not properly initialized");
      showAlert("error", "Contract not initialized. Please reconnect to MetaMask.");
      return;
    }
        
        // Get all files (both owned and accessed)
    try {
      const fileHashes = await window.contract.methods.getFilesByUser(account).call({
      from: account,
      gas: 3000000
    });

    if (!Array.isArray(fileHashes) || fileHashes.length === 0) {
            showEmptyState();
      return;
    }

        // Get accessed files to differentiate between owned and accessed files
      const accessedFiles = await window.contract.methods.getAccessedFiles(account).call({
          from: account,
          gas: 3000000
        });
        const accessedFilesSet = new Set(accessedFiles);

      // Process each file hash
    for (const fileHash of fileHashes) {
      try {
          const fileDetails = await window.contract.methods.files(fileHash).call({
          from: account,
          gas: 3000000
        });
                const isAccessedFile = accessedFilesSet.has(fileHash);
                
                if (isAccessedFile) {
                    // Check if access is still valid
            const accessDetails = await window.contract.methods.getAccessDetails(fileHash, account).call({
                      from: account,
                      gas: 3000000
                    });
                    
                    // Add file to table with access status
                    addFileToTable(fileDetails, fileHash, accessDetails[1], true, accessDetails[0]); // accessDetails[0] is hasAccess, accessDetails[1] is grantedAt
                } else {
                    // Owner always has access
                    addFileToTable(fileDetails, fileHash, null, false, true);
                }
                
                // Only show access list for files owned by the user
                if (fileDetails.owner.toLowerCase() === account.toLowerCase()) {
            const accessList = await window.contract.methods.getFileAccessList(fileHash).call({
                        from: account,
                        gas: 3000000
                    });
                    if (accessList.length > 0) {
                        for (const address of accessList) {
                const accessDetails = await window.contract.methods.getAccessDetails(fileHash, address).call({
                                from: account,
                                gas: 3000000
                            });
                            
                            // accessDetails[0] is hasAccess, accessDetails[1] is grantedAt
                            const accessInfo = {
                                hasAccess: accessDetails[0],
                                grantedAt: accessDetails[1]
                            };
                            
                            addToSharedAccessTable(fileHash, address, accessInfo);
                        }
                    }
                }
      } catch (error) {
                console.error(`Error loading file details: ${fileHash}`, error);
                // Continue with other files even if one fails
      }
    }
    } catch (error) {
      console.error('Error loading files:', error);
      showAlert('error', 'Error loading files: ' + error.message);
    }
  } catch (error) {
    console.error('Error loading files:', error);
        showAlert('error', 'Error loading files: ' + error.message);
  }
}

// AES Encryption/Decryption Functions
function encryptIpfsHash(ipfsHash) {
  try {
    const encrypted = CryptoJS.AES.encrypt(ipfsHash, AES_SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt IPFS hash');
  }
}

function decryptIpfsHash(encryptedHash) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedHash, AES_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt IPFS hash');
  }
}

// Helper Functions
async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`IPFS Upload Error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    // Encrypt the IPFS hash before returning it
    const encryptedHash = encryptIpfsHash(result.IpfsHash);
    
    // Store the original hash in localStorage for reference (optional)
    localStorage.setItem(`original_hash_${encryptedHash}`, result.IpfsHash);
    
    return encryptedHash;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
}

async function downloadFile(encryptedHash) {
  try {
    if (!isConnected) {
      return showAlert('error', 'Please connect to MetaMask first.');
    }
    
    const buttonId = `downloadButton_${encryptedHash.substring(0, 8)}`;
    showLoadingState(buttonId, true);
    
    // First check if the user still has access to this file
    const currentAccount = window.accounts[0];
    
    // Check if user is the owner or has access
    const fileDetails = await window.contract.methods.files(encryptedHash).call({ from: currentAccount });
    const isOwner = fileDetails.owner.toLowerCase() === currentAccount.toLowerCase();
    
    if (!isOwner) {
      // Check access rights from the smart contract
      const accessDetails = await window.contract.methods.getAccessDetails(encryptedHash, currentAccount).call({ from: currentAccount });
      if (!accessDetails[0]) { // hasAccess is the first return value
        showAlert('error', 'Access to this file has been revoked by the owner');
        showLoadingState(buttonId, false);
        return;
      }
    }
    
    // Show decryption notification
    showAlert('info', 'Decrypting file hash...', 1500);
    
    // Decrypt the IPFS hash to get the original hash
    let originalHash;
    
    // Try to get from localStorage first (optional fallback)
    const storedHash = localStorage.getItem(`original_hash_${encryptedHash}`);
    if (storedHash) {
      originalHash = storedHash;
    } else {
      // Decrypt the hash
      originalHash = decryptIpfsHash(encryptedHash);
    }
    
    // Validate the decrypted hash
    if (!originalHash || originalHash.length === 0) {
      throw new Error('Failed to decrypt the file hash');
    }
    
    // Update the encryption badge to show decrypted status
    updateEncryptionBadge(encryptedHash, false);
    
    // Show decryption success notification
    showAlert('success', 'File hash decrypted successfully! Downloading file...', 2000);
    
    // Get file details from data attribute to use the original filename
    let fileName = originalHash; // Default to hash if filename can't be found
    
    // Try to find the file's original name from the table row
    const fileRow = document.querySelector(`tr[data-file-hash="${encryptedHash}"]`);
    if (fileRow) {
      const nameCell = fileRow.querySelector('td:first-child');
      if (nameCell) {
        const nameSpan = nameCell.querySelector('.hover-effect');
        if (nameSpan && nameSpan.textContent) {
          fileName = nameSpan.textContent.trim();
        }
      }
    }
    
    const response = await fetch(`https://ipfs.io/ipfs/${originalHash}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Use the original filename instead of the hash
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
    showAlert('success', 'File downloaded successfully!');
  } catch (error) {
    console.error('Download error:', error);
    showAlert('error', 'Error downloading file: ' + error.message);
  } finally {
    const buttonId = `downloadButton_${encryptedHash.substring(0, 8)}`;
    showLoadingState(buttonId, false);
  }
}

// Add this helper function for copying text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showAlert('success', 'Copied to clipboard!');
    } catch (err) {
        showAlert('error', 'Failed to copy text');
    }
}

// UI Helper Functions
function updateConnectedState() {
    const connectButton = document.getElementById('connectMetamask');
    connectButton.innerHTML = isConnected ? 
        `<img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask Logo" width="20" height="20" class="me-2">Connected` :
        `<img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask Logo" width="20" height="20" class="me-2">Connect MetaMask`;
    connectButton.classList.toggle('btn-warning', !isConnected);
    connectButton.classList.toggle('btn-success', isConnected);
}

function showAlert(type, message, duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-4`;
    alertDiv.style.zIndex = '1050';
    alertDiv.setAttribute('data-aos', 'fade-down');
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${type === 'error' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} icon-pulse me-2"></i>
            <div>${message}</div>
            <button type="button" class="btn-close ms-3" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideUp 0.3s ease-out forwards';
        setTimeout(() => alertDiv.remove(), 300);
    }, duration);
}

function showLoadingState(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    button.disabled = isLoading;
    const originalContent = button.getAttribute('data-original-content') || button.innerHTML;
    
    if (isLoading) {
        button.setAttribute('data-original-content', originalContent);
        button.innerHTML = `
            <div class="d-flex align-items-center justify-content-center">
                <div class="loading-spinner me-2"></div>
                <span class="loading-shimmer px-2">Processing...</span>
            </div>
        `;
        button.classList.add('loading-shimmer');
    } else {
        button.innerHTML = originalContent;
        button.classList.remove('loading-shimmer');
    }
}

function clearUploadForm() {
    document.getElementById('fileInput').value = '';
    document.getElementById('fileNameInput').value = '';
    document.getElementById('descriptionInput').value = '';
}

function clearShareForm() {
    document.getElementById('receiverAddress').value = '';
    document.getElementById('shareFileHash').value = '';
    document.getElementById('accessKey').value = '';
}

function clearAccessForm() {
    document.getElementById('senderAddress').value = '';
    document.getElementById('fileHashInput').value = '';
    document.getElementById('accessKeyInput').value = '';
}

function clearTables() {
    document.getElementById('fileListTable').innerHTML = '';
    document.getElementById('sharedAccessTable').innerHTML = '';
    document.getElementById('shareHistoryTable').innerHTML = '';
}

function showEmptyState() {
    document.getElementById('fileListTable').innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-5">
                <div class="text-secondary" data-aos="fade-up">
                    <i class="bi bi-cloud-slash icon-pulse fs-1 mb-3 d-block"></i>
                    <p class="mb-0">No files uploaded yet</p>
                    <p class="text-muted small">Upload your first file to get started</p>
                    <button class="btn btn-outline-primary btn-hover-effect mt-3" onclick="document.getElementById('fileInput').click()">
                        <i class="bi bi-cloud-upload me-2"></i>Upload Now
                    </button>
                </div>
            </td>
        </tr>
    `;
    
    document.getElementById('sharedAccessTable').innerHTML = `
        <tr>
            <td colspan="4" class="text-center py-5">
                <div class="text-secondary" data-aos="fade-up">
                    <i class="bi bi-people-slash icon-pulse fs-1 mb-3 d-block"></i>
                    <p class="mb-0">No shared access yet</p>
                    <p class="text-muted small">Share your files with others to see them here</p>
                    <button class="btn btn-outline-primary btn-hover-effect mt-3" onclick="document.getElementById('shareButton').click()">
                        <i class="bi bi-share me-2"></i>Share Files
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return 'Unknown';
  
  // Convert to number and handle both seconds and milliseconds
  const ts = Number(timestamp);
  const date = new Date(ts < 10000000000 ? ts * 1000 : ts);
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
    const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);
    
  if (diffSeconds < 60) {
        return 'Just now';
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffSeconds < 604800) {
    const days = Math.floor(diffSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
}

// Helper function to show a message on the chart canvas
function showChartMessage(canvas, message) {
  if (!canvas) return;
  
  canvas.style.opacity = '1';
  
  if (globalChart) {
    globalChart.destroy();
    globalChart = null;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set up for text drawing
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
  // Draw icon (info circle)
  ctx.fillStyle = '#6c757d';
  ctx.font = '24px "Bootstrap Icons"';
  ctx.fillText('\uf430', canvas.width / 2, canvas.height / 2 - 20);
  
  // Draw message
  ctx.fillStyle = '#6c757d';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  
  // Handle multi-line messages
  const lineHeight = 20;
  const words = message.split(' ');
  const lines = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > canvas.width * 0.8 && i > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  
  // Draw each line
  let y = canvas.height / 2 + 10;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], canvas.width / 2, y);
    y += lineHeight;
  }
}

// Helper function to add a loading overlay to an element
function addLoadingOverlay(elementId, message = 'Loading...') {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Remove any existing overlay
  removeLoadingOverlay(elementId);
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';
  
  // Add spinner
  const spinner = document.createElement('div');
  spinner.className = 'spinner-border text-primary';
  spinner.setAttribute('role', 'status');
  
  // Add message
  const messageEl = document.createElement('p');
  messageEl.className = 'mt-2 mb-0';
  messageEl.textContent = message;
  
  // Assemble overlay
  overlay.appendChild(spinner);
  overlay.appendChild(messageEl);
  
  // Position the parent relatively if it's not already
  const computedStyle = window.getComputedStyle(element.parentElement);
  if (computedStyle.position === 'static') {
    element.parentElement.style.position = 'relative';
  }
  
  // Add overlay to parent of the element
  element.parentElement.appendChild(overlay);
}

// Helper function to remove a loading overlay
function removeLoadingOverlay(elementId) {
  const element = document.getElementById(elementId);
  if (!element || !element.parentElement) return;
  
  const overlay = element.parentElement.querySelector('.loading-overlay');
  if (overlay) {
    element.parentElement.removeChild(overlay);
    }
}

// Function to add file to the table
function addFileToTable(fileDetails, fileHash, grantedAt = null, isAccessedFile = false, hasAccess = true) {
    // Create download button with disabled state if access is revoked
    const downloadButton = hasAccess ? 
        `<button class="btn btn-sm btn-primary btn-hover-effect btn-ripple" onclick="downloadFile('${fileHash}')" id="downloadButton_${fileHash.substring(0, 8)}">
            <i class="bi bi-cloud-download me-1"></i>
            Download
        </button>` :
        `<button class="btn btn-sm btn-primary btn-hover-effect btn-ripple" disabled title="Access revoked by owner" id="downloadButton_${fileHash.substring(0, 8)}">
            <i class="bi bi-lock me-1"></i>
            No Access
        </button>`;
    
    // Create share button - now available for both owners and receivers with access
    const shareButton = hasAccess ? 
        `<button class="btn btn-sm btn-success btn-hover-effect btn-ripple" onclick="prepareShareModal('${fileHash}')" id="shareButton_${fileHash.substring(0, 8)}">
            <i class="bi bi-share me-1"></i>
            Share
        </button>` : 
        `<button class="btn btn-sm btn-success btn-hover-effect btn-ripple" disabled title="Cannot share - access revoked" id="shareButton_${fileHash.substring(0, 8)}">
            <i class="bi bi-share-slash me-1"></i>
            Share
        </button>`;

    // Update file type label to show access status
    let fileTypeLabel;
    if (isAccessedFile) {
        fileTypeLabel = hasAccess ? 
            '<span class="badge bg-info"><i class="bi bi-unlock-fill icon-pulse me-1"></i>Accessed</span>' :
            '<span class="badge bg-danger"><i class="bi bi-lock-fill icon-pulse me-1"></i>Access Revoked</span>';
    } else {
        fileTypeLabel = '<span class="badge bg-primary"><i class="bi bi-person-check-fill icon-pulse me-1"></i>Owned</span>';
    }

    const shortenedHash = `${fileHash.substring(0, 6)}...${fileHash.substring(fileHash.length - 4)}`;

    const row = document.createElement('tr');
    row.className = 'align-middle table-row-new';
    row.setAttribute('data-aos', 'fade-up');
    row.setAttribute('data-file-hash', fileHash);
    
    // Create the table cells
    // File name without owner indicator
    const nameCell = document.createElement('td');
    nameCell.innerHTML = `
        <div class="d-flex align-items-center gap-2">
            <span class="hover-effect">${fileDetails.fileName}</span>
            ${fileTypeLabel}
        </div>
    `;
    
    const descCell = document.createElement('td');
    descCell.innerHTML = `
        <span class="text-secondary hover-effect">${fileDetails.description}</span>
    `;
    
    // File hash with copy button and encryption status
    const hashCell = document.createElement('td');
    const hashContainer = document.createElement('div');
    hashContainer.className = 'd-flex align-items-center gap-2';
    hashContainer.id = `hash_container_${fileHash.substring(0, 8)}`;
    
    hashContainer.innerHTML = `
        <span class="d-inline-block text-truncate hover-effect" style="max-width: 150px;" title="${fileHash}">
            ${shortenedHash}
        </span>
        <button class="btn btn-sm btn-outline-secondary ms-2" onclick="copyToClipboard('${fileHash}')" title="Copy full hash">
            <i class="bi bi-clipboard"></i>
        </button>
    `;
    
    // Add encryption status badge in red
    const encryptionBadge = document.createElement('span');
    encryptionBadge.className = 'badge bg-danger ms-2';
    encryptionBadge.id = `encryption_badge_${fileHash.substring(0, 8)}`;
    encryptionBadge.innerHTML = '<i class="bi bi-lock-fill"></i> Encrypted';
    encryptionBadge.setAttribute('data-bs-toggle', 'tooltip');
    encryptionBadge.setAttribute('data-bs-placement', 'top');
    encryptionBadge.setAttribute('title', 'This hash is encrypted for security');
    hashContainer.appendChild(encryptionBadge);
    
    hashCell.appendChild(hashContainer);
    
    // Action buttons (download)
    const actionCell = document.createElement('td');
    actionCell.innerHTML = downloadButton;
    
    // Timestamp
    const timeCell = document.createElement('td');
    timeCell.innerHTML = `
        <span class="text-secondary hover-effect">
            ${grantedAt ? formatTimestamp(grantedAt) : formatTimestamp(fileDetails.timestamp)}
        </span>
    `;
    
    // Share button - now shown for all files with access
    const shareCell = document.createElement('td');
    shareCell.innerHTML = shareButton;
    
    // Append all cells to the row
    row.appendChild(nameCell);
    row.appendChild(descCell);
    row.appendChild(hashCell);
    row.appendChild(actionCell);
    row.appendChild(timeCell);
    row.appendChild(shareCell);
    
    document.getElementById('fileListTable').appendChild(row);
    
    // Initialize tooltips for the new elements
    const tooltips = row.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
}

// Add a helper function to format addresses for display with responsive behavior
function formatAddressForDisplay(address, fullDisplay = false) {
    if (fullDisplay) {
        return address;
    }
    
    // For smaller screens, truncate address
    return window.innerWidth < 768 ? 
        `${address.substring(0, 6)}...${address.substring(address.length - 4)}` :
        address;
}

// Function to display transaction details in modal
function showTransactionDetails(fileHash, originalOwner, sharedBy, sharedTo, sharedAt, fileName, eventType, eventDescription) {
    // Reset modal fields
    document.getElementById('txFileNameDisplay').textContent = fileName || 'Unnamed File';
    document.getElementById('txFileHashDisplay').textContent = fileHash || 'Unknown';
    document.getElementById('txOriginalOwnerDisplay').textContent = originalOwner || 'Unknown';
    
    // Handle sharedBy display
    const sharedByElement = document.getElementById('txSharedByDisplay');
    const sharedByRow = document.getElementById('sharedByRow');
    
    if (!sharedBy || sharedBy === '-') {
        sharedByElement.innerHTML = '<span class="fst-italic text-muted">Not Applicable</span>';
        sharedByRow.classList.add('text-muted');
    } else {
        sharedByElement.textContent = sharedBy;
        sharedByRow.classList.remove('text-muted');
    }
    
    // Handle sharedTo display
    const sharedToElement = document.getElementById('txSharedToDisplay');
    const sharedToRow = document.getElementById('sharedToRow');
    
    if (!sharedTo || sharedTo === '-' || sharedTo === 'No recipient yet') {
        sharedToElement.innerHTML = '<span class="fst-italic text-muted">Not Applicable</span>';
        sharedToRow.classList.add('text-muted');
    } else {
        sharedToElement.textContent = sharedTo;
        sharedToRow.classList.remove('text-muted');
    }
    
    // Format timestamp
    const txTimeDisplay = document.getElementById('txTimeDisplay');
    if (sharedAt) {
        const ts = Number(sharedAt);
        const date = new Date(ts < 10000000000 ? ts * 1000 : ts);
        
        if (!isNaN(date.getTime())) {
            txTimeDisplay.innerHTML = `
                <div>${formatTimestamp(sharedAt)}</div>
                <div class="text-muted small">${date.toLocaleString()}</div>
            `;
        } else {
            txTimeDisplay.textContent = 'Unknown';
        }
    } else {
        txTimeDisplay.textContent = 'Unknown';
    }
    
    // Add event type with appropriate badge color and icon
    const eventBadge = document.getElementById('txEventTypeDisplay');
    let eventIcon;
    
    // Set badge color and icon based on event type
    switch(eventType) {
        case 'FileUploaded':
            eventIcon = 'bi-cloud-upload-fill';
            eventBadge.className = 'badge bg-success';
            break;
        case 'AccessGranted':
            eventIcon = 'bi-person-check-fill';
            eventBadge.className = 'badge bg-primary';
            break;
        case 'AccessRevoked':
            eventIcon = 'bi-person-x-fill';
            eventBadge.className = 'badge bg-danger';
            break;
        case 'FileAccessed':
            eventIcon = 'bi-eye-fill';
            eventBadge.className = 'badge bg-info';
            break;
        default:
            eventIcon = 'bi-asterisk';
            eventBadge.className = 'badge bg-secondary';
    }
    
    eventBadge.innerHTML = `<i class="bi ${eventIcon} me-1"></i>${eventDescription || eventType}`;
    
    // Show the transaction hash section based on transaction type
    const txHashSection = document.getElementById('txHashSection');
    if (eventType === 'FileUploaded' || eventType === 'AccessGranted') {
        txHashSection.classList.remove('d-none');
        // This would be where you'd set the actual transaction hash if available
        document.getElementById('txHashDisplay').textContent = "Transaction hash not available in current implementation";
    } else {
        txHashSection.classList.add('d-none');
    }
    
    // Show the modal
    const transactionModal = new bootstrap.Modal(document.getElementById('transactionDetailsModal'));
    transactionModal.show();
}

// Function to copy transaction data from the modal
function copyTransactionData(elementId) {
    const text = document.getElementById(elementId).textContent;
    copyToClipboard(text);
}

// Function to add an entry to the share history table
function addToShareHistoryTable(fileHash, fileName, originalOwner, sharedBy, sharedTo, timestamp, eventType) {
  try {
    console.log("addToShareHistoryTable called with:", { 
      fileHash, fileName, originalOwner, sharedBy, sharedTo, timestamp, eventType 
    });
    
    // Get the table
    const shareHistoryTable = document.getElementById('shareHistoryTable');
    if (!shareHistoryTable) {
      console.error("Share history table element not found");
      return;
    }
    
    // Ensure we have valid values
    fileName = fileName || "Unnamed File";
    fileHash = fileHash || '';
    originalOwner = originalOwner || '';
    timestamp = timestamp || '';
        
    // Determine event description
    let eventDescription;
    switch(eventType) {
      case 'FileUploaded':
        eventDescription = 'File Uploaded';
        break;
      case 'AccessGranted':
        eventDescription = 'Access Granted';
        break;
      case 'AccessRevoked':
        eventDescription = 'Access Revoked';
        break;
      case 'FileAccessed':
        eventDescription = 'File Accessed';
        break;
      default:
        eventDescription = 'Unknown Event';
    }
    
    // Create full addresses for display with proper formatting based on event type
    const fullFileHash = fileHash;
    
    // Handle original owner field - ensure it's always displayed properly
    // If original owner is missing but we have sharedBy for an upload, use that
    const fullOriginalOwner = originalOwner || (eventType === 'FileUploaded' ? sharedBy : '-');
    
    // Handle sharedBy field - ensure it's properly displayed based on event type
    let fullSharedBy;
    if (eventType === 'FileUploaded') {
      // For file uploads, the uploader (original owner) is the sharer
      fullSharedBy = originalOwner || sharedBy;
    } else if (eventType === 'FileAccessed') {
      // For file access, if it's blank, use the value we determined
      fullSharedBy = sharedBy || originalOwner || '-';
    } else {
      // For grant/revoke, it should be present
      fullSharedBy = sharedBy || originalOwner || '-';
    }
    
    // Handle sharedTo field - ensure it's properly displayed based on event type
    let fullSharedTo;
    if (eventType === 'FileUploaded') {
      // For file uploads, explain that there's no recipient yet
      fullSharedTo = 'No recipient yet';
    } else if (eventType === 'FileAccessed' || eventType === 'AccessGranted' || eventType === 'AccessRevoked') {
      // For file access/grant/revoke, the accessor/recipient should be shown
      fullSharedTo = sharedTo || '-';
    } else {
      // For other events, default
      fullSharedTo = sharedTo || '-';
    }
    
    // Create responsive versions for display
    const displayFileHash = formatAddressForDisplay(fullFileHash);
    const displayOriginalOwner = formatAddressForDisplay(fullOriginalOwner);
    const displaySharedBy = formatAddressForDisplay(fullSharedBy);
    const displaySharedTo = formatAddressForDisplay(fullSharedTo);
    
    // Handle display of sharedBy element with proper address
    let sharedByElement;
    if (fullSharedBy === '-') {
      // Not applicable for this event type
      sharedByElement = `<span class="text-muted fst-italic">N/A</span>`;
    } else {
      sharedByElement = `
        <div class="d-flex align-items-center">
          <span class="text-monospace" title="${fullSharedBy}">
            ${displaySharedBy}
          </span>
          <button class="btn btn-sm btn-outline-secondary ms-2 copy-btn" onclick="event.stopPropagation(); copyToClipboard('${fullSharedBy}')">
            <i class="bi bi-clipboard"></i>
          </button>
        </div>
      `;
    }
    
    // Handle display of sharedTo element with proper address
    let sharedToElement;
    if (fullSharedTo === '-') {
      // Not applicable for this event type
      sharedToElement = `<span class="text-muted fst-italic">N/A</span>`;
    } else if (fullSharedTo === 'No recipient yet') {
      // For FileUploaded events, explain why there's no recipient
      sharedToElement = `<span class="text-muted fst-italic">No recipient yet</span>`;
    } else {
      sharedToElement = `
        <div class="d-flex align-items-center">
          <span class="text-monospace" title="${fullSharedTo}">
            ${displaySharedTo}
          </span>
          <button class="btn btn-sm btn-outline-secondary ms-2 copy-btn" onclick="event.stopPropagation(); copyToClipboard('${fullSharedTo}')">
            <i class="bi bi-clipboard"></i>
          </button>
        </div>
      `;
    }
    
    // Create badge for event type with icon
    let eventBadge;
    let eventIcon;
    
    // Set badge color and icon based on event type
    switch(eventType) {
      case 'FileUploaded':
        eventIcon = 'bi-cloud-upload-fill';
        eventBadge = `<span class="badge bg-success"><i class="bi ${eventIcon} me-1"></i>${eventDescription}</span>`;
        break;
      case 'AccessGranted':
        eventIcon = 'bi-person-check-fill';
        eventBadge = `<span class="badge bg-primary"><i class="bi ${eventIcon} me-1"></i>${eventDescription}</span>`;
        break;
      case 'AccessRevoked':
        eventIcon = 'bi-person-x-fill';
        eventBadge = `<span class="badge bg-danger"><i class="bi ${eventIcon} me-1"></i>${eventDescription}</span>`;
        break;
      case 'FileAccessed':
        eventIcon = 'bi-eye-fill';
        eventBadge = `<span class="badge bg-info"><i class="bi ${eventIcon} me-1"></i>${eventDescription}</span>`;
        break;
      default:
        eventIcon = 'bi-asterisk';
        eventBadge = `<span class="badge bg-secondary"><i class="bi ${eventIcon} me-1"></i>${eventDescription}</span>`;
    }
    
    // Create special highlight for rows based on event type
    let rowClass = 'align-middle table-row-new transaction-row';
    if (eventType === 'FileUploaded') {
      rowClass += ' table-row-uploaded';
    } else if (eventType === 'AccessGranted') {
      rowClass += ' table-row-granted';
    } else if (eventType === 'AccessRevoked') {
      rowClass += ' table-row-revoked';
    }
    
    const row = document.createElement('tr');
    row.className = rowClass;
    row.setAttribute('data-aos', 'fade-up');
    
    // Set data attributes for filtering
    row.setAttribute('data-file-hash', fullFileHash);
    row.setAttribute('data-file-name', fileName || '');
    row.setAttribute('data-owner', fullOriginalOwner);
    row.setAttribute('data-shared-by', fullSharedBy);
    row.setAttribute('data-shared-to', fullSharedTo);
    row.setAttribute('data-timestamp', timestamp || '');
    row.setAttribute('data-event-type', eventType || '');
    
    row.style.cursor = 'pointer';
    
    // Format the timestamp for display
    let formattedTimestamp = 'Unknown';
    let displayDate = '';
    
    if (timestamp) {
      try {
        // Ensure timestamp is treated as a number and handle both seconds and milliseconds
        const ts = Number(timestamp);
        const date = new Date(ts < 10000000000 ? ts * 1000 : ts);
        
        if (!isNaN(date.getTime())) {
          formattedTimestamp = formatTimestamp(timestamp);
          displayDate = date.toLocaleString();
        }
      } catch (error) {
        console.error("Error formatting timestamp:", timestamp, error);
      }
    }
    
    // Add click event to show transaction details
    row.addEventListener('click', () => {
      if (typeof showTransactionDetails === 'function') {
        showTransactionDetails(fullFileHash, fullOriginalOwner, fullSharedBy, fullSharedTo, timestamp, fileName, eventType, eventDescription);
      } else {
        console.error("showTransactionDetails function not found");
      }
    });
    
    row.innerHTML = `
        <td>
        <div class="d-flex flex-column">
          ${fileName ? `<span class="fw-bold text-primary">${fileName}</span>` : '<span class="text-muted fst-italic">Unnamed File</span>'}
        </div>
        </td>
        <td>
        <div class="d-flex align-items-center">
          <span class="text-monospace" title="${fullOriginalOwner}">
            ${displayOriginalOwner}
            </span>
          <button class="btn btn-sm btn-outline-secondary ms-2 copy-btn" onclick="event.stopPropagation(); copyToClipboard('${fullOriginalOwner}')">
            <i class="bi bi-clipboard"></i>
          </button>
        </div>
        </td>
        <td>
        ${sharedByElement}
        </td>
        <td>
        ${sharedToElement}
        </td>
        <td>
        <div class="d-flex flex-column">
            <span class="text-secondary hover-effect">
            ${formattedTimestamp}
            </span>
          <span class="text-muted small">
            ${displayDate}
          </span>
        </div>
      </td>
      <td>
        <div class="d-flex justify-content-center">
          ${eventBadge}
        </div>
        </td>
    `;
    
    // Add the row to the table 
    if (shareHistoryTable) {
      try {
        shareHistoryTable.appendChild(row);
        
        // Apply fade-in animation
        setTimeout(() => {
          row.classList.remove('table-row-new');
        }, 100);
      } catch (appendError) {
        console.error("Error appending row to table:", appendError);
      }
    }
    
    // Update transaction stats after adding a row
    try {
      if (typeof updateTransactionStats === 'function') {
        updateTransactionStats();
      }
    } catch (statsError) {
      console.error("Error updating transaction stats:", statsError);
    }
    
  } catch (error) {
    console.error("Error in addToShareHistoryTable:", error, { fileHash, fileName, originalOwner, sharedBy, sharedTo, timestamp, eventType });
  }
}

// Function to update access status in the UI
function updateAccessStatus(fileHash, userAddress, hasAccess) {
  const statusId = `status_${fileHash.substring(0, 6)}_${userAddress.substring(0, 6)}`;
  const statusElement = document.getElementById(statusId);
  
  if (statusElement) {
    const statusBadge = hasAccess ? 
      '<span class="badge bg-success hover-effect"><i class="bi bi-check-circle-fill icon-pulse me-1"></i>Active</span>' : 
      '<span class="badge bg-danger hover-effect"><i class="bi bi-x-circle-fill icon-pulse me-1"></i>Revoked</span>';
    
    statusElement.innerHTML = statusBadge;
    
    // Update the action cell if access is revoked
    const actionId = `action_${fileHash.substring(0, 6)}_${userAddress.substring(0, 6)}`;
    const actionElement = document.getElementById(actionId);
    if (actionElement && !hasAccess) {
      actionElement.innerHTML = '<span class="text-muted"><i class="bi bi-dash-circle"></i> No Actions</span>';
    }
  }
}

// Function to prepare the share modal with the encrypted hash
function prepareShareModal(encryptedHash) {
  if (!isConnected) {
    return showAlert('error', 'Please connect to MetaMask first.');
  }
  
  // Set the encrypted hash in the share modal
  document.getElementById('shareFileHash').value = encryptedHash;
  
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('shareModal'));
  modal.show();
}

// Share File Access - Update to use prepareShareModal
document.getElementById('shareButton').addEventListener('click', () => {
  if (!isConnected) {
    return showAlert('error', 'Please connect to MetaMask first.');
  }
  
  // Show empty modal - user will select file from their list
  const modal = new bootstrap.Modal(document.getElementById('shareModal'));
  modal.show();
});

// Function to update encryption badge
function updateEncryptionBadge(fileHash, isEncrypted = true) {
  const badgeId = `encryption_badge_${fileHash.substring(0, 8)}`;
  const badge = document.getElementById(badgeId);
  
  if (badge) {
    if (isEncrypted) {
      badge.className = 'badge bg-danger ms-2';
      badge.innerHTML = '<i class="bi bi-lock-fill"></i> Encrypted';
      badge.setAttribute('title', 'This hash is encrypted for security');
    } else {
      badge.className = 'badge bg-success ms-2';
      badge.innerHTML = '<i class="bi bi-unlock-fill"></i> Decrypted';
      badge.setAttribute('title', 'This hash has been decrypted');
    }
    
    // Refresh tooltip
    const tooltip = bootstrap.Tooltip.getInstance(badge);
    if (tooltip) {
      tooltip.dispose();
    }
    new bootstrap.Tooltip(badge);
  }
}

// Function to revoke access to a file
async function revokeAccess(fileHash, userAddress) {
  try {
    if (!isConnected) {
      return showAlert('error', 'Please connect to MetaMask first.');
    }
    
    const buttonId = `revokeButton_${fileHash.substring(0, 6)}_${userAddress.substring(0, 6)}`;
    showLoadingState(buttonId, true);
    
    // Call the smart contract to revoke access
    await window.contract.methods.revokeAccess(fileHash, userAddress).send({ from: window.accounts[0] });
    
    // Update the UI to show revoked status
    updateAccessStatus(fileHash, userAddress, false);
    
    showAlert('success', 'Access successfully revoked!');
  } catch (error) {
    console.error('Error revoking access:', error);
    showAlert('error', 'Error revoking access: ' + error.message);
  } finally {
    const buttonId = `revokeButton_${fileHash.substring(0, 6)}_${userAddress.substring(0, 6)}`;
    showLoadingState(buttonId, false);
  }
}

// Enhanced UI Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .fade-in {
        animation: fadeIn 0.5s ease-out forwards;
    }

    .slide-in {
        animation: slideIn 0.3s ease-out forwards;
    }

    .pulse {
        animation: pulse 2s infinite;
    }

    .table tr {
        opacity: 0;
        animation: fadeIn 0.5s ease-out forwards;
    }

    .table tr:nth-child(1) { animation-delay: 0.1s; }
    .table tr:nth-child(2) { animation-delay: 0.2s; }
    .table tr:nth-child(3) { animation-delay: 0.3s; }
    .table tr:nth-child(4) { animation-delay: 0.4s; }
    .table tr:nth-child(5) { animation-delay: 0.5s; }

    .btn-loading {
        position: relative;
        pointer-events: none;
    }

    .btn-loading::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: inherit;
        border-radius: inherit;
        animation: pulse 1.5s infinite;
    }

    .hover-effect {
        transition: all 0.3s ease;
    }

    .hover-effect:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
    }

    .copy-button {
        opacity: 0.7;
        transition: all 0.2s ease;
    }

    .copy-button:hover {
        opacity: 1;
        transform: scale(1.1);
    }

    .badge {
        transition: all 0.3s ease;
    }

    .badge:hover {
        transform: scale(1.1);
    }

    @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
    }

    @keyframes slideDown {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
    }

    .loading-shimmer {
        background: linear-gradient(90deg, 
            rgba(139, 92, 246, 0.1),
            rgba(139, 92, 246, 0.2),
            rgba(139, 92, 246, 0.1)
        );
        background-size: 1000px 100%;
        animation: shimmer 2s infinite linear;
    }

    .btn-ripple {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.6s linear;
    }

    .table-row-new {
        animation: slideDown 0.3s ease-out forwards;
    }

    .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .btn-hover-effect:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
    }

    .icon-pulse {
        animation: iconPulse 1.5s ease infinite;
    }

    @keyframes iconPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size/2;
        const y = e.clientY - rect.top - size/2;
        
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
});

function addToSharedAccessTable(fileHash, address, accessDetails) {
    const shortenedAddress = `${address.substring(0, 6)}...${address.substring(38)}`;
    const shortenedHash = `${fileHash.substring(0, 6)}...${fileHash.substring(fileHash.length - 4)}`;
    const statusBadge = accessDetails.hasAccess ? 
        '<span class="badge bg-success hover-effect"><i class="bi bi-check-circle-fill icon-pulse me-1"></i>Active</span>' :
        '<span class="badge bg-danger hover-effect"><i class="bi bi-x-circle-fill icon-pulse me-1"></i>Revoked</span>';
    
    // Create revoke button (only show for active access)
    const revokeButton = accessDetails.hasAccess ? 
        `<button class="btn btn-sm btn-danger btn-hover-effect btn-ripple" 
            onclick="revokeAccess('${fileHash}', '${address}')" 
            id="revokeButton_${fileHash.substring(0, 6)}_${address.substring(0, 6)}">
            <i class="bi bi-x-circle me-1"></i>Revoke
        </button>` : 
        '<span class="text-muted"><i class="bi bi-dash-circle"></i> No Actions</span>';

    const row = document.createElement('tr');
    row.className = 'align-middle table-row-new';
    row.setAttribute('data-aos', 'fade-up');
    row.setAttribute('data-file-hash', fileHash);
    row.setAttribute('data-address', address);
    row.innerHTML = `
        <td>
            <span class="d-inline-block text-truncate hover-effect" style="max-width: 150px;" title="${fileHash}">
                ${shortenedHash}
            </span>
        </td>
        <td>
            <span class="d-inline-block text-truncate hover-effect" style="max-width: 150px;" title="${address}">
                ${shortenedAddress}
            </span>
        </td>
        <td>
            <span class="text-secondary hover-effect">
                ${formatTimestamp(accessDetails.grantedAt)}
            </span>
        </td>
        <td>
            <div id="status_${fileHash.substring(0, 6)}_${address.substring(0, 6)}">
                ${statusBadge}
            </div>
        </td>
        <td>
            <div id="action_${fileHash.substring(0, 6)}_${address.substring(0, 6)}">
                ${revokeButton}
            </div>
        </td>
    `;
    document.getElementById('sharedAccessTable').appendChild(row);
}

// Update transaction statistics
function updateTransactionStats(uploadCount, grantCount, revokeCount, accessCount) {
  try {
    // If counts are provided, use them, otherwise count from the table
    let totalTransactions, uploadedCount, grantedCount, revokedCount, accessedCount;
    
    if (uploadCount !== undefined && grantCount !== undefined && 
        revokeCount !== undefined && accessCount !== undefined) {
      // Use the provided counts
      uploadedCount = uploadCount;
      grantedCount = grantCount;
      revokedCount = revokeCount;
      accessedCount = accessCount;
      totalTransactions = uploadedCount + grantedCount + revokedCount + accessedCount;
    } else {
      // Count from the table
      totalTransactions = document.querySelectorAll('.transaction-row').length;
      
      // Count by event type
      uploadedCount = document.querySelectorAll('.transaction-row[data-event-type="FileUploaded"]').length;
      grantedCount = document.querySelectorAll('.transaction-row[data-event-type="AccessGranted"]').length;
      revokedCount = document.querySelectorAll('.transaction-row[data-event-type="AccessRevoked"]').length;
      accessedCount = document.querySelectorAll('.transaction-row[data-event-type="FileAccessed"]').length;
    }
    
    console.log("Transaction stats:", {
      total: totalTransactions,
      uploaded: uploadedCount,
      granted: grantedCount,
      revoked: revokedCount,
      accessed: accessedCount
    });
    
    // Update the counts with animation
    animateCountUpdate('totalTransactionsCount', totalTransactions);
    animateCountUpdate('uploadTransactionsCount', uploadedCount);
    animateCountUpdate('grantedTransactionsCount', grantedCount);
    animateCountUpdate('revokedTransactionsCount', revokedCount);
    animateCountUpdate('accessedTransactionsCount', accessedCount);
    
    // Update last updated time
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const lastUpdatedElement = document.getElementById('lastUpdatedTime');
    if (lastUpdatedElement) {
      lastUpdatedElement.textContent = timeString;
    }
  } catch (error) {
    console.error('Error updating transaction stats:', error);
  }
}

// Animate count updates
function animateCountUpdate(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const startValue = parseInt(element.textContent) || 0;
  const duration = 1000; // 1 second animation
  const stepTime = 50; // Update every 50ms
  const steps = duration / stepTime;
  const increment = (targetValue - startValue) / steps;
  
  let currentValue = startValue;
  let currentStep = 0;
  
  const timer = setInterval(() => {
    currentStep++;
    currentValue += increment;
    
    if (currentStep >= steps) {
      clearInterval(timer);
      currentValue = targetValue;
    }
    
    element.textContent = Math.round(currentValue);
    
    if (currentStep >= steps) {
      // Add pulse animation once completed
      element.classList.add('text-pulse');
      setTimeout(() => {
        element.classList.remove('text-pulse');
      }, 1000);
    }
  }, stepTime);
}

// Global chart reference
let globalChart = null;

// Create transaction history chart
function createTransactionHistoryChart(transactions) {
  console.log("Creating transaction history chart with", transactions.length, "transactions");
  
  // Get the canvas element
  const canvas = document.getElementById('transactionHistoryChart');
  if (!canvas) {
    console.error("Chart canvas element not found");
    return;
  }
  
  // Clear any existing chart
  if (globalChart) {
    globalChart.destroy();
    globalChart = null;
  }
  
  // Handle case with no transactions
  if (!transactions || transactions.length === 0) {
    showChartMessage(canvas, 'No transaction data available');
    return;
  }
  
  try {
    // Group transactions by date and type
    const groupedData = groupTransactionsByDateAndType(transactions);
    console.log("Grouped data:", groupedData);
    
    // If no dates were found in the grouping, show a message
    if (Object.keys(groupedData.datasets[0].data).length === 0) {
      showChartMessage(canvas, 'No transactions with valid timestamps found');
      return;
    }
    
    // Set a fixed height for the canvas to prevent infinite growth
    canvas.style.height = '300px';
    
    // Create chart configuration
    const config = {
      type: 'bar',
      data: groupedData,
      options: {
        responsive: true,
        maintainAspectRatio: true, // Keep this true to maintain aspect ratio
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: function(tooltipItems) {
                return 'Date: ' + tooltipItems[0].label;
              },
              label: function(context) {
                const label = context.dataset.label || '';
                return label + ': ' + context.parsed.y;
              },
              footer: function(tooltipItems) {
                let sum = 0;
                tooltipItems.forEach(function(tooltipItem) {
                  sum += tooltipItem.parsed.y;
                });
                return 'Total: ' + sum;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            min: 0,
            suggestedMax: 10,
            title: {
              display: true,
              text: 'Number of Transactions'
            },
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };
    
    // Save original data for chart type switching
    window.chartData = JSON.parse(JSON.stringify(config.data));
    
    // Create the chart
    globalChart = new Chart(canvas, config);
    
    // Set initial active button state
    const barChartBtn = document.getElementById('barChartBtn');
    if (barChartBtn) {
      barChartBtn.classList.add('active');
    }
    
  } catch (error) {
    console.error("Error creating transaction chart:", error);
    showChartMessage(canvas, 'Error creating chart: ' + error.message);
  }
}

// Group transactions by date and type
function groupTransactionsByDateAndType(transactions) {
  if (!transactions || transactions.length === 0) {
  return {
      labels: [],
      datasets: [
        {
          label: 'File Uploaded',
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: 'rgb(40, 167, 69)',
          borderWidth: 1,
          data: {}
        },
        {
          label: 'Access Granted',
          backgroundColor: 'rgba(0, 123, 255, 0.7)',
          borderColor: 'rgb(0, 123, 255)',
          borderWidth: 1,
          data: {}
        },
        {
          label: 'Access Revoked',
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: 'rgb(220, 53, 69)',
          borderWidth: 1,
          data: {}
        },
        {
          label: 'File Accessed',
          backgroundColor: 'rgba(23, 162, 184, 0.7)',
          borderColor: 'rgb(23, 162, 184)',
          borderWidth: 1,
          data: {}
        }
      ]
    };
  }
  
  // Track transaction counts by date and type
  const datesByType = {
    'FileUploaded': {},
    'AccessGranted': {},
    'AccessRevoked': {},
    'FileAccessed': {}
  };
  
  // Get today's date for reference
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Process each transaction
  transactions.forEach(tx => {
    try {
      // Skip transactions without timestamps
      if (!tx.timestamp) {
        console.warn("Transaction missing timestamp:", tx);
      return;
    }
    
      // Convert timestamp to Date (handle both seconds and milliseconds)
      const ts = Number(tx.timestamp);
      const txDate = new Date(ts < 10000000000 ? ts * 1000 : ts);
      
      // Skip invalid dates
      if (isNaN(txDate.getTime())) {
        console.warn("Invalid timestamp in transaction:", tx.timestamp);
      return;
    }
    
      // Format the date as YYYY-MM-DD
      const dateKey = txDate.toISOString().split('T')[0];
      
      // Validate event type
      if (!tx.eventType || !datesByType.hasOwnProperty(tx.eventType)) {
        console.warn("Transaction has invalid or missing event type:", tx.eventType);
        return;
      }
      
      // Increment the count for this date and event type
      if (datesByType[tx.eventType][dateKey]) {
        datesByType[tx.eventType][dateKey]++;
      } else {
        datesByType[tx.eventType][dateKey] = 1;
        }
      } catch (error) {
      console.error("Error processing transaction for chart:", tx, error);
    }
  });
  
  // Get all unique dates across all event types
  const allDates = new Set();
  Object.values(datesByType).forEach(typeData => {
    Object.keys(typeData).forEach(date => allDates.add(date));
  });
  
  // Sort dates
  const sortedDates = Array.from(allDates).sort();
  
  // Create datasets for Chart.js
  const datasets = [
    {
      label: 'File Uploaded',
      backgroundColor: 'rgba(40, 167, 69, 0.7)',
      borderColor: 'rgb(40, 167, 69)',
      borderWidth: 1,
      data: {}
    },
    {
      label: 'Access Granted',
      backgroundColor: 'rgba(0, 123, 255, 0.7)',
      borderColor: 'rgb(0, 123, 255)',
      borderWidth: 1,
      data: {}
    },
    {
      label: 'Access Revoked',
      backgroundColor: 'rgba(220, 53, 69, 0.7)',
      borderColor: 'rgb(220, 53, 69)',
      borderWidth: 1,
      data: {}
    },
    {
      label: 'File Accessed',
      backgroundColor: 'rgba(23, 162, 184, 0.7)',
      borderColor: 'rgb(23, 162, 184)',
      borderWidth: 1,
      data: {}
    }
  ];
  
  // Fill in the data for each date for each event type
  sortedDates.forEach(date => {
    datasets[0].data[date] = datesByType['FileUploaded'][date] || 0;
    datasets[1].data[date] = datesByType['AccessGranted'][date] || 0;
    datasets[2].data[date] = datesByType['AccessRevoked'][date] || 0;
    datasets[3].data[date] = datesByType['FileAccessed'][date] || 0;
  });
  
  // Format dates for display
  const formattedLabels = sortedDates.map(date => formatDateLabel(date));
  
  return {
    labels: formattedLabels,
    datasets: datasets
  };
}

// Format date labels for chart
function formatDateLabel(dateString) {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

// ... existing code ...

// Add event listener for window resize to update display of addresses
window.addEventListener('resize', function() {
    // Re-render the file sharing history table
    if (accounts && accounts.length > 0) {
        loadGlobalFileShareHistory(accounts[0]);
    }
});

// Event listener for refreshing transaction history
document.getElementById('refreshTransactions').addEventListener('click', async () => {
    if (!isConnected) {
        return showAlert('error', 'Please connect to MetaMask first.');
    }

    try {
        // Show loading state 
        showLoadingState('refreshTransactions', true);
        
        // Show loading indicator in table
        const historyTable = document.getElementById('shareHistoryTable');
        if (historyTable) {
            historyTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5">
                        <div class="d-flex flex-column align-items-center">
                            <div class="loading-spinner mb-3"></div>
                            <p>Refreshing transactions from blockchain...</p>
                        </div>
                    </td>
                </tr>
            `;
        }
        
        // Reset the chart and show loading indicator
        const chartCanvas = document.getElementById('transactionHistoryChart');
        if (chartCanvas) {
            if (globalChart) {
                globalChart.destroy();
                globalChart = null;
            }
            const ctx = chartCanvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Loading chart data...', chartCanvas.width/2 || 150, chartCanvas.height/2 || 100);
            }
        }
        
        // Reset transaction stats
        const statElements = document.querySelectorAll('.stat-count');
        statElements.forEach(element => {
            element.textContent = '0';
        });
        
        // Load fresh transaction data
        await loadGlobalFileShareHistory();
        showAlert('success', 'Transaction history refreshed successfully!');
    } catch (error) {
        console.error('Error refreshing transaction history:', error);
        showAlert('error', 'Error refreshing transaction history: ' + error.message);
        
        // Update the table to show error message
        const historyTable = document.getElementById('shareHistoryTable');
        if (historyTable) {
            historyTable.innerHTML = `<tr><td colspan="6" class="text-center"><div class="alert alert-danger">Error refreshing transaction history: ${error.message}</div></td></tr>`;
        }
        
        // Show error in chart
        const chartCanvas = document.getElementById('transactionHistoryChart');
        if (chartCanvas) {
            if (globalChart) {
                globalChart.destroy();
                globalChart = null;
            }
            const ctx = chartCanvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
                ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Error loading chart data', chartCanvas.width/2 || 150, chartCanvas.height/2 || 100);
            }
        }
    } finally {
        showLoadingState('refreshTransactions', false);
    }
});

// Add event handlers for transaction filters
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get the filter value
      const filterValue = this.getAttribute('data-filter');
      
      // Filter the transaction rows
      const transactionRows = document.querySelectorAll('.transaction-row');
      
      transactionRows.forEach(row => {
        if (filterValue === 'all') {
          row.style.display = '';
        } else {
          // Convert the existing event types to match the filter values
          let rowEventType = row.getAttribute('data-event-type');
          
          // Map the existing event types to the new format
          if (rowEventType === 'file_uploaded') rowEventType = 'FileUploaded';
          else if (rowEventType === 'access_granted') rowEventType = 'AccessGranted';
          else if (rowEventType === 'access_revoked') rowEventType = 'AccessRevoked';
          else if (rowEventType === 'file_accessed') rowEventType = 'FileAccessed';
          
          if (rowEventType === filterValue) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
      
      // Show message if no transactions match the filter
      const visibleRows = [...transactionRows].filter(row => row.style.display !== 'none');
      const shareHistoryTable = document.getElementById('shareHistoryTable');
      
      if (visibleRows.length === 0 && shareHistoryTable.querySelector('.no-transactions-message') === null) {
        const messageRow = document.createElement('tr');
        messageRow.className = 'no-transactions-message';
        messageRow.innerHTML = `
          <td colspan="6" class="text-center py-4">
            <div class="d-flex flex-column align-items-center">
              <i class="bi bi-search text-muted mb-2" style="font-size: 2rem;"></i>
              <p class="mb-0">No transactions found matching the selected filter</p>
            </div>
          </td>
        `;
        shareHistoryTable.appendChild(messageRow);
      } else if (visibleRows.length > 0) {
        const noTransactionsMessage = shareHistoryTable.querySelector('.no-transactions-message');
        if (noTransactionsMessage) {
          noTransactionsMessage.remove();
        }
      }
    });
  });
});

// ... existing code ...

// Function to export transaction history to CSV
function exportTransactionsToCSV() {
  try {
    if (!isConnected) {
      return showAlert('error', 'Please connect to MetaMask first.');
    }
    
    // Get all transaction rows
    const transactionRows = document.querySelectorAll('.transaction-row');
    
    if (transactionRows.length === 0) {
      return showAlert('error', 'No transactions to export.');
    }
    
    // Show loading state
    showLoadingState('exportTransactions', true);
    
    // Create CSV header
    let csvContent = 'File Name,File Hash,Original Owner,Shared By,Shared To,Transaction Time,Event Type\n';
    
    // Process each row to extract data
    transactionRows.forEach(row => {
      // Only include visible rows (respect current filter)
      if (row.style.display !== 'none') {
        // Extract data from row
        const fileNameElement = row.querySelector('td:nth-child(1) .fw-bold');
        const fileName = fileNameElement ? fileNameElement.textContent : 'Unknown';
        
        const fileHash = row.getAttribute('data-file-hash') || 'Unknown';
        
        const originalOwnerElement = row.querySelector('td:nth-child(2) .text-monospace');
        const originalOwner = originalOwnerElement ? originalOwnerElement.textContent.trim() : 'Unknown';
        
        const sharedByElement = row.querySelector('td:nth-child(3) .text-monospace');
        const sharedBy = sharedByElement ? sharedByElement.textContent.trim() : 'N/A';
        
        const sharedToElement = row.querySelector('td:nth-child(4) .text-monospace');
        const sharedTo = sharedToElement ? sharedToElement.textContent.trim() : 'N/A';
        
        const timeElement = row.querySelector('td:nth-child(5) .text-secondary');
        const transactionTime = timeElement ? timeElement.textContent.trim() : 'Unknown';
        
        const eventElement = row.querySelector('td:nth-child(6) .badge');
        const eventType = eventElement ? eventElement.textContent.trim() : 'Unknown';
        
        // Format as CSV row (handle commas in data)
        csvContent += `"${fileName}","${fileHash}","${originalOwner}","${sharedBy}","${sharedTo}","${transactionTime}","${eventType}"\n`;
      }
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `blockchain-transactions-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('success', 'Transaction history exported successfully!');
  } catch (error) {
    console.error('Error exporting transactions:', error);
    showAlert('error', 'Error exporting transactions: ' + error.message);
  } finally {
    showLoadingState('exportTransactions', false);
  }
}

// Function to handle transaction search and filtering
function filterTransactions() {
  try {
    console.log("Filtering transactions");
    
    // Get DOM elements with null checks
    const searchInput = document.getElementById('transactionSearch');
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const timeFilter = document.getElementById('timeFilter');
    const timeFilterValue = timeFilter ? timeFilter.value : 'all';
    
    // Get all event type checkboxes
    const uploadedCheckbox = document.getElementById('filter-uploaded');
    const accessedCheckbox = document.getElementById('filter-accessed');
    const grantedCheckbox = document.getElementById('filter-granted');
    const revokedCheckbox = document.getElementById('filter-revoked');
    
    // Check if checkboxes exist before accessing their checked property
    const showUploaded = uploadedCheckbox ? uploadedCheckbox.checked : true;
    const showAccessed = accessedCheckbox ? accessedCheckbox.checked : true;
    const showGranted = grantedCheckbox ? grantedCheckbox.checked : true;
    const showRevoked = revokedCheckbox ? revokedCheckbox.checked : true;
    
    console.log(`Filter settings - Search: "${searchQuery}", Time: ${timeFilterValue}, Show Uploaded: ${showUploaded}, Show Accessed: ${showAccessed}, Show Granted: ${showGranted}, Show Revoked: ${showRevoked}`);
    
    // Get the history table with a null check
    const historyTable = document.getElementById('shareHistoryTable');
    if (!historyTable) {
      console.error("Cannot filter transactions - shareHistoryTable not found");
      return;
    }
    
    // Find all rows in the table
    const rows = historyTable.querySelectorAll('tr');
    if (!rows || rows.length === 0) {
      console.log("No rows found in the history table");
      return;
    }
    
    // Get current date for time-based filtering
    const now = new Date();
    
    // Track visible rows for chart update
    let visibleTransactions = [];
    let hiddenCount = 0;
    
    // Examine each row
    for (const row of rows) {
      // Skip rows that are not transaction entries (like messages)
      if (!row.hasAttribute('data-file-hash')) {
        continue;
      }
      
      try {
        const fileHash = row.getAttribute('data-file-hash');
        const fileName = row.getAttribute('data-file-name') || '';
        const owner = row.getAttribute('data-owner') || '';
        const sharedBy = row.getAttribute('data-shared-by') || '';
        const sharedTo = row.getAttribute('data-shared-to') || '';
        const eventType = row.getAttribute('data-event-type') || '';
        const timestamp = row.getAttribute('data-timestamp');
        
        if (!fileHash) {
          console.warn("Row missing file hash attribute, skipping:", row);
          continue;
        }
        
        // Check event type filter
        let passesEventFilter = false;
        
        switch (eventType) {
          case 'FileUploaded':
            passesEventFilter = showUploaded;
            break;
          case 'FileAccessed':
            passesEventFilter = showAccessed;
            break;
          case 'AccessGranted':
            passesEventFilter = showGranted;
            break;
          case 'AccessRevoked':
            passesEventFilter = showRevoked;
            break;
          default:
            // If unknown event type, show it by default
            passesEventFilter = true;
            console.warn(`Unknown event type: ${eventType}`);
        }
        
        // Check time filter
        let passesTimeFilter = true;
        
        if (timestamp && timeFilterValue !== 'all') {
          const txDate = new Date(parseInt(timestamp) * 1000);
          const diffDays = Math.floor((now - txDate) / (1000 * 60 * 60 * 24));
          
          switch (timeFilterValue) {
            case 'today':
              passesTimeFilter = diffDays < 1;
              break;
            case 'week':
              passesTimeFilter = diffDays < 7;
              break;
            case 'month':
              passesTimeFilter = diffDays < 30;
              break;
            default:
              // For 'all' or any unknown value, we show everything
              passesTimeFilter = true;
          }
        } else if (!timestamp) {
          console.warn(`Row missing timestamp attribute: ${fileHash}`);
        }
        
        // Check search query
        let passesSearchFilter = true;
        
        if (searchQuery) {
          const searchTerms = [
            fileName.toLowerCase(),
            fileHash.toLowerCase(),
            owner.toLowerCase(),
            sharedBy.toLowerCase(),
            sharedTo.toLowerCase(),
            eventType.toLowerCase()
          ];
          
          passesSearchFilter = searchTerms.some(term => term.includes(searchQuery));
        }
        
        // Apply combined filter
        const isVisible = passesEventFilter && passesTimeFilter && passesSearchFilter;
        row.style.display = isVisible ? '' : 'none';
        
        // If visible, add to our list of visible transactions for the chart
        if (isVisible) {
          visibleTransactions.push({
                        fileHash,
            fileName,
            timestamp,
            eventType
          });
        } else {
          hiddenCount++;
        }
      } catch (rowError) {
        console.error("Error filtering row:", rowError, row);
      }
    }
    
    // Update the filter counter if it exists
    const filterCounter = document.getElementById('filter-counter');
    if (filterCounter) {
      if (hiddenCount > 0) {
        filterCounter.textContent = `${hiddenCount} hidden`;
        filterCounter.style.display = 'inline-block';
      } else {
        filterCounter.style.display = 'none';
      }
    }
    
    // Show "no results" message if no visible transactions
    if (visibleTransactions.length === 0) {
      // Check if we already have a "no results" message
      let noResultsRow = historyTable.querySelector('.no-results-message');
      
      if (!noResultsRow) {
        noResultsRow = document.createElement('tr');
        noResultsRow.className = 'no-results-message';
        noResultsRow.innerHTML = `
          <td colspan="6" class="text-center py-4">
            <div class="alert alert-info">
              <i class="bi bi-info-circle-fill me-2"></i>
              No transactions match your filter criteria.
            </div>
          </td>
        `;
        historyTable.appendChild(noResultsRow);
      } else {
        noResultsRow.style.display = '';
      }
    } else {
      // Hide "no results" message if we have visible transactions
      const noResultsRow = historyTable.querySelector('.no-results-message');
      if (noResultsRow) {
        noResultsRow.style.display = 'none';
      }
    }
    
    // Update the chart based on visible transactions if it exists
    try {
      const chartCanvas = document.getElementById('transactionHistoryChart');
      if (chartCanvas && globalChart) {
        console.log("Updating chart with filtered transactions:", visibleTransactions);
        
        if (visibleTransactions.length === 0) {
          showChartMessage(chartCanvas, 'No transactions match the current filters.');
        } else {
          // Clear any existing message
          removeChartMessage(chartCanvas);
          
          // Update the chart with visible transactions
          updateTransactionHistoryChart(visibleTransactions);
        }
      }
    } catch (chartError) {
      console.error("Error updating chart with filtered transactions:", chartError);
    }
    
            } catch (error) {
    console.error("Error in filterTransactions:", error);
  }
}

// Function to update stats for filtered transactions
function updateFilteredStats(visibleCount) {
  const totalElem = document.getElementById('totalTransactionsCount');
  if (totalElem) {
    totalElem.textContent = visibleCount;
    
    // Add pulsing effect
    totalElem.classList.add('text-pulse');
    setTimeout(() => {
      totalElem.classList.remove('text-pulse');
    }, 1000);
  }
  
  // We could update the other counts here as well, but we're simplifying by just showing total
}

// Event listeners for transaction search and filters
document.addEventListener('DOMContentLoaded', function() {
  // Search input event
  const searchInput = document.getElementById('transactionSearch');
  if (searchInput) {
    searchInput.addEventListener('input', filterTransactions);
  }
  
  // Clear search button
  const clearSearchBtn = document.getElementById('clearSearch');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterTransactions();
    });
  }
  
  // Time filter dropdown
  const timeFilter = document.getElementById('timeFilter');
  if (timeFilter) {
    timeFilter.addEventListener('change', filterTransactions);
  }
  
  // Modify the existing filter button click handlers to also trigger our new combined filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    const originalClickListener = button.onclick;
    button.onclick = function(e) {
      // First remove active class from all buttons and add to clicked one
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Then trigger the combined filter
      filterTransactions();
    };
  });
});

// Event listener for exporting transaction history
document.getElementById('exportTransactions').addEventListener('click', exportTransactionsToCSV);

// Add window resize event listener for chart responsiveness
window.addEventListener('resize', function() {
  if (globalChart) {
    globalChart.resize();
  }
});

// Existing event listener for refreshing transaction history

// Connect MetaMask button event listener
document.addEventListener('DOMContentLoaded', () => {
  // Setup MetaMask UI elements
  setupMetaMaskUI();
  
  // Add listeners for search and filter controls
  setupSearchAndFilterListeners();
  
  // Setup chart type toggle buttons
  setupChartTypeToggle();
});

// Setup search and filter event listeners
function setupSearchAndFilterListeners() {
  try {
    console.log("Setting up search and filter listeners");
    
    // Search input related elements
    const searchInput = document.getElementById('transactionSearch');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    // Time filter dropdown
    const timeFilterSelect = document.getElementById('timeFilter');
    
    // Event type checkboxes - these might need to be created if they don't exist
    const uploadedCheckbox = document.getElementById('filter-uploaded') || createFilterCheckbox('filter-uploaded', 'Uploads');
    const accessedCheckbox = document.getElementById('filter-accessed') || createFilterCheckbox('filter-accessed', 'Access');
    const grantedCheckbox = document.getElementById('filter-granted') || createFilterCheckbox('filter-granted', 'Grants');
    const revokedCheckbox = document.getElementById('filter-revoked') || createFilterCheckbox('filter-revoked', 'Revokes');
    
    // Reset filter button
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    // Set up search input event listener
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        console.log("Search input changed:", searchInput.value);
        filterTransactions();
      });
      
      // Add keydown event to trigger search on Enter
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          filterTransactions();
        }
      });
    } else {
      console.warn("Search input element not found");
    }
    
    // Set up clear search button
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          filterTransactions();
        }
      });
    }
    
    // Set up time filter dropdown
    if (timeFilterSelect) {
      timeFilterSelect.addEventListener('change', () => {
        console.log("Time filter changed:", timeFilterSelect.value);
        filterTransactions();
      });
    } else {
      console.warn("Time filter select element not found");
    }
    
    // Set up event type checkboxes
    if (uploadedCheckbox) {
      uploadedCheckbox.addEventListener('change', () => {
        console.log("Uploaded checkbox changed:", uploadedCheckbox.checked);
        filterTransactions();
      });
    }
    
    if (accessedCheckbox) {
      accessedCheckbox.addEventListener('change', () => {
        console.log("Accessed checkbox changed:", accessedCheckbox.checked);
        filterTransactions();
      });
    }
    
    if (grantedCheckbox) {
      grantedCheckbox.addEventListener('change', () => {
        console.log("Granted checkbox changed:", grantedCheckbox.checked);
        filterTransactions();
      });
    }
    
    if (revokedCheckbox) {
      revokedCheckbox.addEventListener('change', () => {
        console.log("Revoked checkbox changed:", revokedCheckbox.checked);
        filterTransactions();
      });
    }
    
    // Set up reset filters button
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        console.log("Resetting all filters");
        
        // Reset search input
        if (searchInput) searchInput.value = '';
        
        // Reset time filter
        if (timeFilterSelect) timeFilterSelect.value = 'all';
        
        // Reset event type checkboxes
        if (uploadedCheckbox) uploadedCheckbox.checked = true;
        if (accessedCheckbox) accessedCheckbox.checked = true;
        if (grantedCheckbox) grantedCheckbox.checked = true;
        if (revokedCheckbox) revokedCheckbox.checked = true;
        
        // Apply the filters
        filterTransactions();
      });
    }
    
    // Set up export button if it exists
    const exportBtn = document.getElementById('exportTransactions');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (typeof exportTransactionsToCSV === 'function') {
          exportTransactionsToCSV();
        } else {
          console.error("exportTransactionsToCSV function not found");
        }
      });
    }
    
    console.log("Search and filter listeners setup complete");
  } catch (error) {
    console.error("Error setting up search and filter listeners:", error);
  }
}

// Helper function to create a filter checkbox if it doesn't exist
function createFilterCheckbox(id, label) {
  try {
    const filterControls = document.querySelector('.filter-controls');
    if (!filterControls) {
      console.warn(`Could not find filter controls container to add ${id}`);
      return null;
    }
    
    console.log(`Creating filter checkbox: ${id}`);
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'form-check form-check-inline';
    
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input';
    checkbox.id = id;
    checkbox.checked = true;
    
    // Create label
    const checkLabel = document.createElement('label');
    checkLabel.className = 'form-check-label';
    checkLabel.htmlFor = id;
    checkLabel.textContent = label;
    
    // Assemble and insert
    wrapper.appendChild(checkbox);
    wrapper.appendChild(checkLabel);
    filterControls.appendChild(wrapper);
    
    return checkbox;
  } catch (error) {
    console.error(`Error creating filter checkbox ${id}:`, error);
    return null;
  }
}

// Setup chart type toggle buttons
function setupChartTypeToggle() {
  try {
    console.log("Setting up chart type toggle buttons");
    
    // Get chart type buttons
    const barChartBtn = document.getElementById('barChartBtn');
    const lineChartBtn = document.getElementById('lineChartBtn');
    const pieChartBtn = document.getElementById('pieChartBtn');
    
    // Set up bar chart button
    if (barChartBtn) {
      barChartBtn.addEventListener('click', () => {
        console.log("Switching to bar chart");
        try {
          setChartType('bar');
        } catch (error) {
          console.error("Error setting chart type to bar:", error);
          showAlert("error", "Could not switch to bar chart");
        }
      });
    } else {
      console.warn("Bar chart button not found");
    }
    
    // Set up line chart button
    if (lineChartBtn) {
      lineChartBtn.addEventListener('click', () => {
        console.log("Switching to line chart");
        try {
          setChartType('line');
        } catch (error) {
          console.error("Error setting chart type to line:", error);
          showAlert("error", "Could not switch to line chart");
        }
      });
    } else {
      console.warn("Line chart button not found");
    }
    
    // Set up pie chart button
    if (pieChartBtn) {
      pieChartBtn.addEventListener('click', () => {
        console.log("Switching to pie chart");
        try {
          setChartType('pie');
        } catch (error) {
          console.error("Error setting chart type to pie:", error);
          showAlert("error", "Could not switch to pie chart");
        }
      });
    } else {
      console.warn("Pie chart button not found");
    }
    
    // Set active class on default chart type (bar)
    const defaultChartType = 'bar';
    if (barChartBtn) {
      barChartBtn.classList.add('active');
    }
    
    console.log("Chart type toggle setup complete");
  } catch (error) {
    console.error("Error setting up chart type toggle:", error);
  }
}

// Set chart type and update the chart
function setChartType(type) {
  try {
    console.log(`Setting chart type to: ${type}`);
    
    if (!globalChart) {
      console.warn("Chart not initialized yet, cannot change type");
      return;
    }
    
    // Validate chart type
    const validTypes = ['bar', 'line', 'pie'];
    if (!validTypes.includes(type)) {
      console.error(`Invalid chart type: ${type}. Must be one of: ${validTypes.join(', ')}`);
      return;
    }
    
    // Get chart type buttons
    const buttons = {
      bar: document.getElementById('barChartBtn'),
      line: document.getElementById('lineChartBtn'),
      pie: document.getElementById('pieChartBtn')
    };
    
    // Update active button state
    Object.keys(buttons).forEach(key => {
      if (buttons[key]) {
        if (key === type) {
          buttons[key].classList.add('active');
        } else {
          buttons[key].classList.remove('active');
        }
      }
    });
    
    // Update chart type
    globalChart.config.type = type;
    
    // For pie chart, adjust options
    if (type === 'pie') {
      globalChart.options.plugins.legend.display = true;
      
      try {
        // Update data structure for pie chart
        const eventCounts = {
          'File Uploaded': 0,
          'Access Granted': 0,
          'Access Revoked': 0,
          'File Accessed': 0
        };
        
        // Get all visible transaction rows
        const historyTable = document.getElementById('shareHistoryTable');
        if (!historyTable) {
          console.warn("Share history table not found, using default data");
        } else {
          // Count by event type from visible rows only
          const visibleRows = historyTable.querySelectorAll('tr.transaction-row:not([style*="display: none"])');
          
          if (visibleRows && visibleRows.length > 0) {
            visibleRows.forEach(row => {
              const eventType = row.getAttribute('data-event-type');
              
              if (eventType === 'FileUploaded') eventCounts['File Uploaded']++;
              else if (eventType === 'AccessGranted') eventCounts['Access Granted']++;
              else if (eventType === 'AccessRevoked') eventCounts['Access Revoked']++;
              else if (eventType === 'FileAccessed') eventCounts['File Accessed']++;
            });
          } else {
            console.log("No visible transaction rows found for pie chart");
          }
        }
        
        // Update chart data
        globalChart.data = {
          labels: Object.keys(eventCounts),
          datasets: [{
            data: Object.values(eventCounts),
            backgroundColor: [
              'rgba(40, 167, 69, 0.7)',   // success - uploads
              'rgba(0, 123, 255, 0.7)',   // primary - grants
              'rgba(220, 53, 69, 0.7)',   // danger - revokes
              'rgba(23, 162, 184, 0.7)'   // info - access
            ],
            borderColor: [
              'rgba(40, 167, 69, 1)',
              'rgba(0, 123, 255, 1)',
              'rgba(220, 53, 69, 1)',
              'rgba(23, 162, 184, 1)'
            ],
            borderWidth: 1
          }]
        };
      } catch (pieDataError) {
        console.error("Error preparing pie chart data:", pieDataError);
      }
    } else {
      // For bar/line charts, restore original structure
      try {
        globalChart.options.plugins.legend.display = false;
        
        // This assumes the original data is still accessible
        if (window.chartData) {
          console.log("Restoring original chart data for bar/line chart");
          globalChart.data = window.chartData;
        } else {
          console.warn("Original chart data not found in window.chartData");
        }
      } catch (barLineDataError) {
        console.error("Error preparing bar/line chart data:", barLineDataError);
      }
    }
    
    try {
      // Apply the update to the chart
      globalChart.update();
      console.log(`Chart type updated to ${type} successfully`);
    } catch (updateError) {
      console.error("Error updating chart:", updateError);
      
      // Attempt to fix the chart if update fails
      const chartCanvas = document.getElementById('transactionHistoryChart');
      if (chartCanvas) {
        showChartMessage(chartCanvas, `Error updating chart to ${type} type. Try refreshing the page.`);
      }
    }
  } catch (error) {
    console.error("Error in setChartType:", error);
  }
}

async function loadGlobalFileShareHistory() {
  try {
    // Create a loading message element to show while loading data
    const loadingMessage = document.createElement('tr');
    loadingMessage.className = 'loading-message';
    loadingMessage.innerHTML = `
      <td colspan="6" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 mb-0">Loading transaction history...</p>
      </td>
    `;
    
    console.log("Loading global file share history");
    
    // Get the history table with a null check
    const historyTable = document.getElementById('shareHistoryTable');
    if (!historyTable) {
      console.error("Share history table element not found in the DOM");
      return;
    }
    
    // Clear table and show loading message
    historyTable.innerHTML = '';
    historyTable.appendChild(loadingMessage);
    
    // Get the chart canvas with a null check
    const chartCanvas = document.getElementById('transactionHistoryChart');
    if (chartCanvas) {
      chartCanvas.style.opacity = '0.5';
      if (globalChart) {
        globalChart.destroy();
        globalChart = null;
      }
      addLoadingOverlay('transactionHistoryChart', 'Loading transaction chart...');
    } else {
      console.warn("Transaction history chart canvas not found in the DOM");
    }
    
    // Check for Web3 and contract initialization
    if (!window.web3) {
      console.error("Web3 not initialized. MetaMask connection may be missing.");
      if (historyTable) {
        historyTable.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-4">
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                Please connect to MetaMask to view transaction history.
              </div>
            </td>
          </tr>
        `;
      }
      
      if (chartCanvas) {
        removeLoadingOverlay('transactionHistoryChart');
        showChartMessage(chartCanvas, 'Please connect to MetaMask to view transaction data.');
      }
      
      return;
    }
    
    // Check for contract initialization specifically
    if (!window.contract || !window.contract.methods) {
      console.error("Contract not properly initialized");
      if (historyTable) {
        historyTable.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-4">
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                Contract not initialized. Please reconnect to MetaMask.
              </div>
            </td>
          </tr>
        `;
      }
      
      if (chartCanvas) {
        removeLoadingOverlay('transactionHistoryChart');
        showChartMessage(chartCanvas, 'Contract not initialized. Please reconnect to MetaMask.');
      }
      
      return;
    }
    
    console.log("Connected to web3 and contract. Getting accounts...");
    
    try {
      // Get accounts with proper error handling
      let accounts;
      try {
        accounts = await window.web3.eth.getAccounts();
      } catch (accountError) {
        console.error("Error fetching accounts:", accountError);
        throw new Error("Could not fetch Ethereum accounts. Please check your MetaMask connection.");
      }
      
      // Log current contract and account information
      const contractAddress = window.contract._address;
      console.log(`Current contract address: ${contractAddress}`);
      
      if (!accounts || accounts.length === 0) {
        console.error("No accounts found");
        if (historyTable) {
          historyTable.innerHTML = `
            <tr>
              <td colspan="6" class="text-center py-4">
                <div class="alert alert-warning">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  No account detected. Please connect to MetaMask.
                </div>
              </td>
            </tr>
          `;
        }
        
        if (chartCanvas) {
          removeLoadingOverlay('transactionHistoryChart');
          showChartMessage(chartCanvas, 'No account detected. Please connect to MetaMask.');
        }
        
        return;
      }
      
      console.log(`Current account: ${accounts[0]}`);
      
      // Array to store all transaction data
      const transactions = [];
      
      // Helper function to get file name from the blockchain
      async function getFileName(ipfsHash) {
        let fileName = "Unnamed File";
        try {
          if (!ipfsHash || !window.contract || !window.web3) {
            console.warn(`Cannot get file name for hash ${ipfsHash} - missing contract connection`);
            return fileName;
          }

          if (!window.accounts || window.accounts.length === 0) {
            console.warn("Cannot get file name - no connected account");
            return fileName;
          }

          console.log(`Attempting to get file name for hash: ${ipfsHash}`);
          
          // First try to get file details using the getFileDetails method if available
          try {
            const fileDetails = await window.contract.methods.getFileDetails(ipfsHash).call({ from: window.accounts[0] });
            if (fileDetails && fileDetails.fileName) {
              if (typeof fileDetails.fileName === 'string' && fileDetails.fileName.trim() !== '') {
                fileName = fileDetails.fileName;
                console.log(`Found file name via getFileDetails: ${fileName}`);
                return fileName;
              } else if (fileDetails.fileName.startsWith('0x')) {
                try {
                  fileName = window.web3.utils.hexToUtf8(fileDetails.fileName);
                  console.log(`Decoded hex file name via getFileDetails: ${fileName}`);
                  return fileName;
                } catch (e) {
                  console.warn("Could not decode hex file name from getFileDetails:", e);
                }
              }
            }
          } catch (methodError) {
            console.warn(`getFileDetails method failed for ${ipfsHash}, falling back to files mapping:`, methodError);
          }
          
          // Fall back to the files mapping
          try {
            const fileInfo = await window.contract.methods.files(ipfsHash).call({ from: window.accounts[0] });
            if (fileInfo && fileInfo.fileName) {
              if (typeof fileInfo.fileName === 'string' && fileInfo.fileName.trim() !== '') {
                fileName = fileInfo.fileName;
                console.log(`Found file name via files mapping: ${fileName}`);
                return fileName;
              } else if (fileInfo.fileName.startsWith('0x')) {
                try {
                  fileName = window.web3.utils.hexToUtf8(fileInfo.fileName);
                  console.log(`Decoded hex file name via files mapping: ${fileName}`);
                  return fileName;
                } catch (e) {
                  console.warn("Could not decode hex file name from files mapping:", e);
                }
              }
            }
          } catch (fileError) {
            console.warn(`files mapping access failed for ${ipfsHash}:`, fileError);
          }
          
          // If we get here, we couldn't get the file name from the contract
          console.warn(`Could not retrieve file name for hash ${ipfsHash} from blockchain`);
        } catch (error) {
          console.error(`Error getting file name for hash ${ipfsHash}:`, error);
        }
        return fileName;
      }
      
      console.log("Fetching FileUploaded events...");
      try {
        const fileUploadedEvents = await window.contract.getPastEvents('FileUploaded', {
            fromBlock: 0,
            toBlock: 'latest'
        });
        console.log(`Found ${fileUploadedEvents.length} FileUploaded events`);
        
        for (const event of fileUploadedEvents) {
          try {
            console.log("FileUploaded event:", event);
            const returnValues = event.returnValues;
            
            // Extract event parameters
            let fileHash, fileName, description, owner, timestamp;
            
            // Handle different event formats
            if (returnValues.ipfsHash) {
              fileHash = returnValues.ipfsHash;
            } else if (returnValues[0]) {
              fileHash = returnValues[0]; // First parameter is ipfsHash
            }
            
            if (returnValues.fileName) {
              fileName = returnValues.fileName;
            } else if (returnValues[1]) {
              fileName = returnValues[1]; // Second parameter is fileName
            }
            
            if (returnValues.owner) {
              owner = returnValues.owner;
            } else if (returnValues[4]) {
              owner = returnValues[4]; // Fifth parameter is owner
            }
            
            if (returnValues.timestamp) {
              timestamp = returnValues.timestamp;
            } else if (returnValues[3]) {
              timestamp = returnValues[3]; // Fourth parameter is timestamp
            }
            
            // Get correct file name - use our helper function 
            let properFileName = await getFileName(fileHash);
            
            // If we couldn't get it from the contract, try from the event
            if (properFileName === "Unnamed File" && fileName) {
              try {
                if (typeof fileName === 'string' && fileName.trim() !== '') {
                  properFileName = fileName;
                } else if (fileName.startsWith('0x')) {
                  // Try to decode hex
                  properFileName = window.web3.utils.hexToUtf8(fileName);
                }
              } catch (e) {
                console.warn("Error formatting file name from event:", e);
              }
            }
            
            console.log("Resolved file name for upload event:", properFileName);
            
            const eventDetails = {
              fileHash: fileHash,
              fileName: properFileName,
              originalOwner: owner,
              sharedBy: owner,
              sharedTo: '-',
              timestamp: timestamp,
              eventType: 'FileUploaded'
            };
            
            transactions.push(eventDetails);
          } catch (eventError) {
            console.error("Error processing upload event:", eventError);
          }
        }
      } catch (error) {
        console.error("Error fetching FileUploaded events:", error);
      }
      
      console.log("Fetching AccessGranted events...");
      try {
        const accessGrantedEvents = await window.contract.getPastEvents('AccessGranted', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        console.log(`Found ${accessGrantedEvents.length} AccessGranted events`);
        
        for (const event of accessGrantedEvents) {
          try {
            console.log("AccessGranted event:", event);
            const returnValues = event.returnValues;
            
            // Extract event parameters
            let fileHash, sender, receiver, timestamp;
            
            // Handle different event formats
            if (returnValues.ipfsHash) {
              fileHash = returnValues.ipfsHash;
            } else if (returnValues[0]) {
              fileHash = returnValues[0]; // First parameter is ipfsHash
            }
            
            // The sender might be called owner or sender
            if (returnValues.sender) {
              sender = returnValues.sender;
            } else if (returnValues[1]) {
              sender = returnValues[1]; // Second parameter is sender
            }
            
            // The receiver might be called user or receiver
            if (returnValues.receiver) {
              receiver = returnValues.receiver;
            } else if (returnValues[2]) {
              receiver = returnValues[2]; // Third parameter is receiver
            }
            
            if (returnValues.timestamp) {
              timestamp = returnValues.timestamp;
            } else if (returnValues[3]) {
              timestamp = returnValues[3]; // Fourth parameter is timestamp
            }
            
            // Get accurate file name and owner details
            const properFileName = await getFileName(fileHash);
            console.log("Resolved file name for grant event:", properFileName);
            
            // Try to get original owner information from contract
            let originalOwner = sender;
            try {
              const fileInfo = await window.contract.methods.files(fileHash).call({ from: accounts[0] });
              if (fileInfo && fileInfo.owner) {
                originalOwner = fileInfo.owner;
                console.log(`Retrieved original owner for grant event: ${originalOwner}`);
              }
            } catch (ownerError) {
              console.warn(`Could not get original owner for ${fileHash}:`, ownerError);
            }
            
            const eventDetails = {
              fileHash: fileHash,
              fileName: properFileName,
              originalOwner: originalOwner, // Use the retrieved original owner
              sharedBy: sender,
              sharedTo: receiver,
              timestamp: timestamp,
              eventType: 'AccessGranted'
            };
            
            transactions.push(eventDetails);
          } catch (eventError) {
            console.error("Error processing grant event:", eventError);
          }
        }
      } catch (error) {
        console.error("Error fetching AccessGranted events:", error);
      }
      
      console.log("Fetching AccessRevoked events...");
      try {
        const accessRevokedEvents = await window.contract.getPastEvents('AccessRevoked', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        console.log(`Found ${accessRevokedEvents.length} AccessRevoked events`);
        
        for (const event of accessRevokedEvents) {
          try {
            console.log("AccessRevoked event:", event);
            const returnValues = event.returnValues;
            
            // Extract event parameters
            let fileHash, sender, receiver, timestamp;
            
            // Handle different event formats
            if (returnValues.ipfsHash) {
              fileHash = returnValues.ipfsHash;
            } else if (returnValues[0]) {
              fileHash = returnValues[0]; // First parameter is ipfsHash
            }
            
            // The sender might be called owner or sender
            if (returnValues.sender) {
              sender = returnValues.sender;
            } else if (returnValues[1]) {
              sender = returnValues[1]; // Second parameter is sender
            }
            
            // The receiver might be called user or receiver
            if (returnValues.receiver) {
              receiver = returnValues.receiver;
            } else if (returnValues[2]) {
              receiver = returnValues[2]; // Third parameter is receiver
            }
            
            if (returnValues.timestamp) {
              timestamp = returnValues.timestamp;
            } else if (returnValues[3]) {
              timestamp = returnValues[3]; // Fourth parameter is timestamp
            }
            
            // Get accurate file name
            const properFileName = await getFileName(fileHash);
            console.log("Resolved file name for revoke event:", properFileName);
            
            const eventDetails = {
              fileHash: fileHash,
              fileName: properFileName,
              originalOwner: sender, // Sender is original owner for revoked events
              sharedBy: sender,
              sharedTo: receiver,
              timestamp: timestamp,
              eventType: 'AccessRevoked'
            };
            
            transactions.push(eventDetails);
          } catch (eventError) {
            console.error("Error processing revoke event:", eventError);
          }
        }
      } catch (error) {
        console.error("Error fetching AccessRevoked events:", error);
      }
      
      console.log("Fetching FileAccessed events...");
      try {
        const fileAccessedEvents = await window.contract.getPastEvents('FileAccessed', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        console.log(`Found ${fileAccessedEvents.length} FileAccessed events`);
        
        for (const event of fileAccessedEvents) {
          try {
            console.log("FileAccessed event:", event);
            const returnValues = event.returnValues;
            
            // Extract event parameters
            let fileHash, user, timestamp;
            
            // Handle different event formats
            if (returnValues.ipfsHash) {
              fileHash = returnValues.ipfsHash;
            } else if (returnValues[0]) {
              fileHash = returnValues[0]; // First parameter is ipfsHash
            }
            
            if (returnValues.user) {
              user = returnValues.user;
            } else if (returnValues[1]) {
              user = returnValues[1]; // Second parameter is user
            }
            
            if (returnValues.timestamp) {
              timestamp = returnValues.timestamp;
            } else if (returnValues[2]) {
              timestamp = returnValues[2]; // Third parameter is timestamp
            }
            
            // Get file details to find owner and name
            let properFileName = await getFileName(fileHash);
            console.log("Resolved file name for access event:", properFileName);
            
            // Get original owner and potential sharer information
            let originalOwner = "";
            let sharedBy = "";
            
            try {
              // Try to get file info from contract
              const fileInfo = await window.contract.methods.files(fileHash).call({ from: accounts[0] });
              if (fileInfo) {
                if (fileInfo.owner) {
                  originalOwner = fileInfo.owner;
                  console.log(`Retrieved original owner for access event: ${originalOwner}`);
                }
              }
              
              // Check file share history to find who shared the file with this user
              try {
                const shareHistory = await window.contract.methods.getFileShareHistory(fileHash).call({ from: accounts[0] });
                
                if (shareHistory && 
                    shareHistory.sharedTo && 
                    shareHistory.sharedBy && 
                    shareHistory.sharedTo.length > 0) {
                  
                  // Find the entry where this user was granted access
                  for (let i = 0; i < shareHistory.sharedTo.length; i++) {
                    if (shareHistory.sharedTo[i].toLowerCase() === user.toLowerCase()) {
                      sharedBy = shareHistory.sharedBy[i];
                      console.log(`Found sharer for access event: ${sharedBy}`);
                      break;
                    }
                  }
                }
              } catch (historyError) {
                console.warn(`Could not get share history for ${fileHash}:`, historyError);
              }
            } catch (detailError) {
              console.warn(`Could not get file details for ${fileHash}:`, detailError);
            }
            
            // If we couldn't find the sharer from history, default to original owner
            if (!sharedBy && originalOwner) {
              sharedBy = originalOwner;
            }
            
            const eventDetails = {
              fileHash: fileHash,
              fileName: properFileName,
              originalOwner: originalOwner,
              sharedBy: sharedBy, // Set the sharer based on our findings
              sharedTo: user,
              timestamp: timestamp,
              eventType: 'FileAccessed'
            };
            
            transactions.push(eventDetails);
          } catch (eventError) {
            console.error("Error processing access event:", eventError);
          }
        }
      } catch (error) {
        console.error("Error fetching FileAccessed events:", error);
      }
      
      // Sort transactions by timestamp (newest first)
      transactions.sort((a, b) => {
        const tsA = Number(a.timestamp) || 0;
        const tsB = Number(b.timestamp) || 0;
        return tsB - tsA;
      });
      
      console.log("All transactions collected:", transactions);
      
      // Remove the loading message if it exists
      if (historyTable) {
        const loadingMsg = historyTable.querySelector('.loading-message');
        if (loadingMsg) {
          historyTable.removeChild(loadingMsg);
        }
        
        // Handle case with no transactions
        if (transactions.length === 0) {
          console.log("No transactions found");
          historyTable.innerHTML = `
            <tr>
              <td colspan="6" class="text-center py-4">
                <div class="alert alert-info">
                  <i class="bi bi-info-circle-fill me-2"></i>
                  No transactions found. Upload or share a file to get started.
                </div>
              </td>
            </tr>
          `;
          
          if (chartCanvas) {
            removeLoadingOverlay('transactionHistoryChart');
            showChartMessage(chartCanvas, 'No transaction data available. Upload or share a file to get started.');
          }
          
          // Update transaction stats with zeros
          updateTransactionStats(0, 0, 0, 0);
          return;
        }
        
        // Add all transactions to the table
        for (const tx of transactions) {
          try {
            addToShareHistoryTable(
              tx.fileHash,
              tx.fileName,
              tx.originalOwner,
              tx.sharedBy,
              tx.sharedTo,
              tx.timestamp,
              tx.eventType
            );
          } catch (addError) {
            console.error("Error adding transaction to history table:", addError, tx);
          }
        }
      }
      
      // Create the chart with the transaction data if canvas exists
      if (chartCanvas) {
        removeLoadingOverlay('transactionHistoryChart');
        try {
          console.log("Creating transaction history chart");
          createTransactionHistoryChart(transactions);
        } catch (error) {
          console.error("Error creating transaction chart:", error);
          showChartMessage(chartCanvas, 'Error creating chart. Please try again later.');
        }
      } else {
        console.warn("Cannot create chart - canvas element not found");
      }
      
      // Update transaction stats
      console.log("Updating transaction stats");
      const uploads = transactions.filter(tx => tx.eventType === 'FileUploaded').length;
      const grants = transactions.filter(tx => tx.eventType === 'AccessGranted').length;
      const revokes = transactions.filter(tx => tx.eventType === 'AccessRevoked').length;
      const accesses = transactions.filter(tx => tx.eventType === 'FileAccessed').length;
      
      updateTransactionStats(uploads, grants, revokes, accesses);
      
      // Apply any active filters
      filterTransactions();
      
    } catch (error) {
      console.error("Error loading global file share history:", error);
      
      // Show error message in table if it exists
      if (historyTable) {
        historyTable.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-4">
              <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                Error loading transaction history: ${error.message}
                    </div>
                </td>
          </tr>
        `;
      }
      
      // Show error message in chart if it exists
      if (chartCanvas) {
        removeLoadingOverlay('transactionHistoryChart');
        showChartMessage(chartCanvas, `Error loading data: ${error.message}`);
      }
    }
  } catch (outerError) {
    console.error("Outer error in loadGlobalFileShareHistory:", outerError);
    showAlert("error", "Failed to load transaction history: " + outerError.message);
  }
}

// Helper function to remove any messages from the chart canvas
function removeChartMessage(canvas) {
  try {
    if (!canvas) {
      console.warn("removeChartMessage called with null canvas");
      return;
    }
    
    // If there's an existing chart, we don't need to do anything
    if (globalChart) {
      console.log("Chart is already showing data, no message to remove");
      return;
    }
    
    // Just clear the canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log("Chart message removed");
    } else {
      console.warn("Could not get 2D context from chart canvas");
        }
    } catch (error) {
    console.error("Error removing chart message:", error);
  }
}

// Helper function to update the chart with filtered transaction data
function updateTransactionHistoryChart(transactions) {
  try {
    console.log("Updating transaction history chart with filtered data:", transactions);
    
    if (!globalChart) {
      console.warn("Cannot update chart - globalChart is null");
      return;
    }
    
    if (!transactions || transactions.length === 0) {
      console.warn("No transactions provided to update chart");
      
      // Show "no data" message on chart
      const chartCanvas = document.getElementById('transactionHistoryChart');
      if (chartCanvas) {
        showChartMessage(chartCanvas, 'No transaction data to display');
      }
      return;
    }
    
    // Get the current chart type
    const chartType = globalChart.config.type;
    console.log("Current chart type:", chartType);
    
    // For pie charts, we need to count transactions by type
    if (chartType === 'pie') {
      try {
        // Update data structure for pie chart
        const eventCounts = {
          'File Uploaded': 0,
          'Access Granted': 0,
          'Access Revoked': 0,
          'File Accessed': 0
        };
        
        // Count transactions by event type
        for (const tx of transactions) {
          const eventType = tx.eventType;
          
          if (eventType === 'FileUploaded') eventCounts['File Uploaded']++;
          else if (eventType === 'AccessGranted') eventCounts['Access Granted']++;
          else if (eventType === 'AccessRevoked') eventCounts['Access Revoked']++;
          else if (eventType === 'FileAccessed') eventCounts['File Accessed']++;
        }
        
        // Update chart data
        globalChart.data = {
          labels: Object.keys(eventCounts),
          datasets: [{
            data: Object.values(eventCounts),
            backgroundColor: [
              'rgba(40, 167, 69, 0.7)',   // success - uploads
              'rgba(0, 123, 255, 0.7)',   // primary - grants
              'rgba(220, 53, 69, 0.7)',   // danger - revokes
              'rgba(23, 162, 184, 0.7)'   // info - access
            ],
            borderColor: [
              'rgba(40, 167, 69, 1)',
              'rgba(0, 123, 255, 1)',
              'rgba(220, 53, 69, 1)',
              'rgba(23, 162, 184, 1)'
            ],
            borderWidth: 1
          }]
        };
        
        // Update chart
        globalChart.update();
        return;
      } catch (pieError) {
        console.error("Error updating pie chart:", pieError);
      }
    }
    
    // For bar and line charts, we need to group by date and type
    try {
      // Group by date and event type
      const groupedData = groupTransactionsByDateAndType(transactions);
      
      if (!groupedData || !groupedData.labels || groupedData.labels.length === 0) {
        console.warn("No valid grouped data for chart update");
        return;
      }
      
      // Update the chart data
      globalChart.data.labels = groupedData.labels;
      globalChart.data.datasets = [
        {
          label: 'Uploads',
          data: groupedData.uploads,
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1,
          stack: 'Stack 0'
        },
        {
          label: 'Access Grants',
          data: groupedData.grants,
          backgroundColor: 'rgba(0, 123, 255, 0.7)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1,
          stack: 'Stack 0'
        },
        {
          label: 'Access Revokes',
          data: groupedData.revokes,
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1,
          stack: 'Stack 0'
        },
        {
          label: 'File Access',
          data: groupedData.access,
          backgroundColor: 'rgba(23, 162, 184, 0.7)',
          borderColor: 'rgba(23, 162, 184, 1)',
          borderWidth: 1,
          stack: 'Stack 0'
        }
      ];
      
      // Save the current data for potential chart type changes
      window.chartData = JSON.parse(JSON.stringify(globalChart.data));
      
      // Update the chart
      globalChart.update();
      console.log("Chart updated successfully with filtered data");
    } catch (error) {
      console.error("Error updating transaction history chart:", error);
      
      // Show error on chart
      const chartCanvas = document.getElementById('transactionHistoryChart');
      if (chartCanvas) {
        showChartMessage(chartCanvas, `Error updating chart: ${error.message}`);
      }
    }
  } catch (outerError) {
    console.error("Outer error in updateTransactionHistoryChart:", outerError);
  }
}

// Function to check if we're on the correct chain
async function checkChainId() {
  try {
    if (!window.ethereum) {
      console.warn("MetaMask not detected");
      return false;
    }
    
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("Current chainId:", chainId);
    
    // Define allowed network IDs (Mainnet, Ropsten, Rinkeby, Goerli, local development)
    // Convert to hex strings for comparison with eth_chainId
    const allowedChains = [
      '0x1',      // Mainnet
      '0x3',      // Ropsten
      '0x4',      // Rinkeby
      '0x5',      // Goerli
      '0x539',    // Ganache (local)
      '0x7a69'    // Hardhat (local)
    ];
    
    if (!allowedChains.includes(chainId)) {
      console.warn(`Current chain ID ${chainId} not in allowed chains`);
      showAlert("warning", "You are connected to an unsupported network. Please switch to Mainnet, Goerli, or a local development network.");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking chain ID:", error);
    return false;
  }
}

// Function to check if Web3 is initialized and ready to use
function isWeb3Ready() {
  if (!window.web3 || !window.contract) {
    console.warn("Web3 or contract not initialized. MetaMask connection may be missing.");
    return false;
  }
  return true;
}

// Setup UI elements for MetaMask connection
function setupMetaMaskUI() {
  try {
    console.log("Setting up MetaMask UI elements");
    
    // Check for MetaMask availability
    if (!window.ethereum) {
      console.warn("MetaMask not detected in browser");
      
      // Find suitable container for warning
      const containerElement = document.querySelector('.connect-container') || 
                              document.querySelector('.navbar') ||
                              document.querySelector('header');
      
      if (containerElement) {
        // Add warning message about missing MetaMask
        const warningElement = document.createElement('div');
        warningElement.className = 'alert alert-warning mt-3';
        warningElement.innerHTML = `
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          MetaMask not detected. Please <a href="https://metamask.io/download/" target="_blank" class="alert-link">install MetaMask</a> to use this application.
        `;
        
        containerElement.appendChild(warningElement);
      }
      return; // Exit early if MetaMask is not available
    }
    
    // Initialize window.ethereum properties if they don't exist
    window.web3 = window.web3 || null;
    window.contract = window.contract || null;
    window.accounts = window.accounts || [];
    window.isConnected = window.isConnected || false;
    
    // Check for connect button
    const connectButton = document.getElementById('connectMetamask');
    if (!connectButton) {
      console.warn("Connect MetaMask button not found in DOM");
      
      // Try to find a suitable container to add the button
      const containerElement = document.querySelector('.connect-container') || 
                              document.querySelector('.navbar') ||
                              document.querySelector('header');
      
      if (containerElement) {
        console.log("Creating connect button in:", containerElement);
        
        const newButton = document.createElement('button');
        newButton.id = 'connectMetamask';
        newButton.className = 'btn btn-primary';
        newButton.innerHTML = '<i class="bi bi-wallet2 me-2"></i>Connect MetaMask';
        
        containerElement.appendChild(newButton);
        
        // Add click event listener
        newButton.addEventListener('click', async () => {
          try {
            const isChainValid = await checkChainId();
            if (!isChainValid) {
              console.warn("Canceling connection due to invalid chain");
              return;
            }
            
            await connectMetamask();
          } catch (error) {
            console.error("Error in connect button handler:", error);
            showAlert("error", "Connection failed: " + error.message);
          }
        });
        
        console.log("Connect button created successfully");
      } else {
        console.error("No suitable container found to add connect button");
      }
    } else {
      // Add click event listener if button exists
      connectButton.addEventListener('click', async () => {
        try {
          const isChainValid = await checkChainId();
          if (!isChainValid) {
            console.warn("Canceling connection due to invalid chain");
            return;
          }
          
          await connectMetamask();
        } catch (error) {
          console.error("Error in connect button handler:", error);
          showAlert("error", "Connection failed: " + error.message);
        }
      });
    }
    
    // Check for accounts element
    if (!document.getElementById('accounts')) {
      console.warn("Accounts element not found in DOM");
    }
    
    // Check for connect/connected sections
    if (!document.getElementById('connectSection')) {
      console.warn("Connect section not found in DOM");
    }
    
    if (!document.getElementById('connectedSection')) {
      console.warn("Connected section not found in DOM");
    }
    
    // Check for account badge
    if (!document.getElementById('accountBadge')) {
      console.warn("Account badge not found in DOM");
    }
    
    // Check for file tables
    if (!document.getElementById('fileListTable')) {
      console.warn("File list table not found in DOM");
    }
    
    if (!document.getElementById('shareHistoryTable')) {
      console.warn("Share history table not found in DOM");
    }
    
    // Initialize tooltips
    try {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    } catch (tooltipError) {
      console.warn("Error initializing tooltips:", tooltipError);
    }
    
    // Automatically connect if previously connected
    if (window.ethereum && window.ethereum.isConnected && window.ethereum.selectedAddress) {
      console.log("MetaMask already connected, attempting to reconnect");
      setTimeout(async () => {
        try {
          // First check the chain ID
          const isChainValid = await checkChainId();
          if (!isChainValid) {
            console.warn("Canceling auto-reconnect due to invalid chain");
            return;
          }
          
          // Make sure the page is fully loaded before reconnecting
          if (document.readyState === 'complete') {
            await connectMetamask();
          } else {
            // If page not fully loaded, wait for it
            console.log("Page not fully loaded, waiting for complete state before reconnecting");
            window.addEventListener('load', async () => {
              try {
                await connectMetamask();
              } catch (loadError) {
                console.error("Error auto-reconnecting after page load:", loadError);
              }
            });
          }
        } catch (error) {
          console.error("Auto reconnect error:", error);
          // Don't show an alert for auto-reconnect failures to avoid overwhelming the user
        }
      }, 2000); // Increased delay to 2 seconds to ensure page is more likely to be ready
    }
    
    console.log("MetaMask UI setup complete");
  } catch (setupError) {
    console.error("Error setting up MetaMask UI:", setupError);
  }
}

// Note: DOMContentLoaded event listener that calls setupMetaMaskUI is defined at line 3270

// Fix the window resize handler to ensure proper chart resizing
window.addEventListener('resize', function() {
  if (globalChart) {
    // Update the chart on resize
    globalChart.resize();
    
    // Ensure the chart container and canvas have proper dimensions
    const chartCanvas = document.getElementById('transactionHistoryChart');
    if (chartCanvas) {
      // Maintain the fixed height
      chartCanvas.style.height = '250px';
      
      // Force chart update
      globalChart.update();
    }
  }
});