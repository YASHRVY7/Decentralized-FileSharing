// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string ipfsHash;
        string fileName;
        string description;
        uint256 timestamp;
        address owner;
        bool exists;  // To check if file exists
    }

    struct AccessControl {
        bool hasAccess;
        string accessKey;  // 4-digit key stored as a string
        uint256 grantedAt;  // Timestamp when access was granted
    }

    // New struct to track file sharing history
    struct ShareHistory {
        address originalOwner;
        address sharedBy;
        address sharedTo;
        uint256 sharedAt;
    }

    // Mappings
    mapping(string => File) public files;
    mapping(address => string[]) public userFiles;
    mapping(string => mapping(address => AccessControl)) public accessList;
    mapping(string => address[]) public fileAccessList;
    mapping(address => string[]) public accessedFiles;  // New mapping to track accessed files
    
    // New mapping to track file sharing history
    mapping(string => ShareHistory[]) public fileShareHistory;

    // Events
    event FileUploaded(
        string indexed ipfsHash,
        string fileName,
        string description,
        uint256 timestamp,
        address indexed owner
    );
    
    event AccessGranted(
        string indexed ipfsHash,
        address indexed sender,
        address indexed receiver,
        uint256 timestamp
    );

    event AccessRevoked(
        string indexed ipfsHash,
        address indexed sender,
        address indexed receiver,
        uint256 timestamp
    );

    event FileAccessed(
        string indexed ipfsHash,
        address indexed user,
        uint256 timestamp
    );

    // Validate 4-digit key format
    modifier validKey(string memory key) {
        require(bytes(key).length == 4, "Key must be exactly 4 digits");
        for(uint i = 0; i < 4; i++) {
            require(
                uint8(bytes(key)[i]) >= 48 && uint8(bytes(key)[i]) <= 57,
                "Key must contain only numeric digits"
            );
        }
        _;
    }

    modifier fileExists(string memory ipfsHash) {
        require(files[ipfsHash].exists, "File does not exist");
        _;
    }

    modifier onlyOwner(string memory ipfsHash) {
        require(files[ipfsHash].owner == msg.sender, "Only owner can perform this action");
        _;
    }

    // Upload a file with filename, description, and timestamp
    function uploadFile(
        string memory ipfsHash,
        string memory fileName,
        string memory description
    ) public {
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        require(bytes(fileName).length > 0, "Filename cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(!files[ipfsHash].exists, "File already exists");

        files[ipfsHash] = File({
            ipfsHash: ipfsHash,
            fileName: fileName,
            description: description,
            timestamp: block.timestamp,
            owner: msg.sender,
            exists: true
        });

        userFiles[msg.sender].push(ipfsHash);

        emit FileUploaded(
            ipfsHash,
            fileName,
            description,
            block.timestamp,
            msg.sender
        );
    }

    // Grant access to another user with a 4-digit key
    function grantAccess(
        string memory ipfsHash,
        address receiver,
        string memory accessKey
    ) public 
        fileExists(ipfsHash)
        validKey(accessKey)
    {
        require(receiver != address(0), "Invalid receiver address");
        require(receiver != msg.sender, "Cannot grant access to yourself");
        require(!accessList[ipfsHash][receiver].hasAccess, "Access already granted");
        
        // Check if sender is owner or has valid access
        bool isOwner = files[ipfsHash].owner == msg.sender;
        bool hasAccess = false;
        
        if (!isOwner) {
            // If not owner, check if sender has access
            AccessControl memory senderAccess = accessList[ipfsHash][msg.sender];
            hasAccess = senderAccess.hasAccess;
            require(hasAccess, "You don't have access to share this file");
            
            // Record in share history when a receiver shares with another user
            ShareHistory memory history = ShareHistory({
                originalOwner: files[ipfsHash].owner,
                sharedBy: msg.sender,
                sharedTo: receiver,
                sharedAt: block.timestamp
            });
            
            fileShareHistory[ipfsHash].push(history);
        }

        accessList[ipfsHash][receiver] = AccessControl({
            hasAccess: true,
            accessKey: accessKey,
            grantedAt: block.timestamp
        });

        fileAccessList[ipfsHash].push(receiver);

        emit AccessGranted(
            ipfsHash,
            msg.sender,
            receiver,
            block.timestamp
        );
    }

    // Revoke access from a user
    function revokeAccess(
        string memory ipfsHash,
        address user
    ) public 
        fileExists(ipfsHash)
        onlyOwner(ipfsHash)
    {
        require(accessList[ipfsHash][user].hasAccess, "No access to revoke");

        accessList[ipfsHash][user].hasAccess = false;
        
        // Remove from fileAccessList
        address[] storage accessArray = fileAccessList[ipfsHash];
        for (uint i = 0; i < accessArray.length; i++) {
            if (accessArray[i] == user) {
                accessArray[i] = accessArray[accessArray.length - 1];
                accessArray.pop();
                break;
            }
        }

        emit AccessRevoked(
            ipfsHash,
            msg.sender,
            user,
            block.timestamp
        );
    }

    // Verify access and record accessed file
    function verifyAccess(
        string memory ipfsHash,
        address user,
        string memory accessKey
    ) public view 
        fileExists(ipfsHash)
        validKey(accessKey)
        returns (bool)
    {
        if (files[ipfsHash].owner == user) {
            return true;  // Owner always has access
        }

        AccessControl memory access = accessList[ipfsHash][user];
        return access.hasAccess && 
               keccak256(bytes(access.accessKey)) == keccak256(bytes(accessKey));
    }

    // Record file access after verification
    function recordFileAccess(
        string memory ipfsHash,
        address user
    ) public
        fileExists(ipfsHash)
    {
        require(
            files[ipfsHash].owner == user || accessList[ipfsHash][user].hasAccess,
            "User does not have access to this file"
        );

        // Check if file is already in accessed files
        bool isFileInAccessList = false;
        for (uint i = 0; i < accessedFiles[user].length; i++) {
            if (keccak256(bytes(accessedFiles[user][i])) == keccak256(bytes(ipfsHash))) {
                isFileInAccessList = true;
                break;
            }
        }

        // Add to accessed files if not already present
        if (!isFileInAccessList) {
            accessedFiles[user].push(ipfsHash);
            emit FileAccessed(ipfsHash, user, block.timestamp);
        }
    }

    // Get all accessed files for a user
    function getAccessedFiles(address user) public view returns (string[] memory) {
        return accessedFiles[user];
    }

    // Modified getFilesByUser to include both owned and accessed files
    function getFilesByUser(address user) public view returns (string[] memory) {
        string[] memory owned = userFiles[user];
        string[] memory accessed = accessedFiles[user];
        
        // Calculate total length
        uint totalLength = owned.length + accessed.length;
        
        // Create combined array
        string[] memory combined = new string[](totalLength);
        
        // Copy owned files
        for(uint i = 0; i < owned.length; i++) {
            combined[i] = owned[i];
        }
        
        // Copy accessed files
        for(uint i = 0; i < accessed.length; i++) {
            combined[owned.length + i] = accessed[i];
        }
        
        return combined;
    }

    // Get file details by IPFS hash
    function getFileDetails(string memory ipfsHash) public view 
        fileExists(ipfsHash)
        returns (
            string memory fileName,
            string memory description,
            uint256 timestamp,
            address owner
        )
    {
        File memory file = files[ipfsHash];
        return (
            file.fileName,
            file.description,
            file.timestamp,
            file.owner
        );
    }

    // Get the list of addresses that have been granted access to a file
    function getFileAccessList(string memory ipfsHash) public view 
        fileExists(ipfsHash)
        returns (address[] memory)
    {
        return fileAccessList[ipfsHash];
    }

    function getAccessDetails(string memory ipfsHash, address user) public view
        fileExists(ipfsHash)
        returns (
            bool hasAccess,
            uint256 grantedAt
        )
    {
        AccessControl memory access = accessList[ipfsHash][user];
        return (
            access.hasAccess,
            access.grantedAt
        );
    }

    // Get the file sharing history
    function getFileShareHistory(string memory ipfsHash) public view 
        fileExists(ipfsHash)
        returns (
            address[] memory originalOwners,
            address[] memory sharedBy,
            address[] memory sharedTo,
            uint256[] memory sharedAt
        )
    {
        ShareHistory[] memory history = fileShareHistory[ipfsHash];
        uint256 length = history.length;
        
        originalOwners = new address[](length);
        sharedBy = new address[](length);
        sharedTo = new address[](length);
        sharedAt = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            originalOwners[i] = history[i].originalOwner;
            sharedBy[i] = history[i].sharedBy;
            sharedTo[i] = history[i].sharedTo;
            sharedAt[i] = history[i].sharedAt;
        }
        
        return (originalOwners, sharedBy, sharedTo, sharedAt);
    }
}