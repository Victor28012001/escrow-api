// import { Contract, RpcProvider, Account, shortString } from "starknet";

// // Initialize variables without immediate execution
// let provider = null;
// let contract = null;
// let isInitialized = false;

// // Initialize StarkNet components lazily
// async function initializeStarkNet() {
//   if (isInitialized) return;
  
//   try {
//     provider = new RpcProvider({
//       nodeUrl: process.env.STARKNET_RPC || "https://starknet-sepolia.public.blastapi.io"
//     });

//     const contractAddress = process.env.CONTRACT_ADDRESS;
    
//     if (contractAddress) {
//       // Use fs to read the ABI file instead of dynamic import
//       const abi = [
//         // Your ABI array here - but let's use a simpler approach
//       ];
      
//       // For now, let's create a minimal contract instance without ABI
//       // We'll handle ABI loading differently
//       contract = new Contract([], contractAddress, provider);
//     }
    
//     isInitialized = true;
//     console.log("StarkNet initialized successfully");
//   } catch (error) {
//     console.error("Failed to initialize StarkNet:", error);
//   }
// }

// // Helper functions (safe)
// export function strToFelt(str) {
//   if (!str) return "0x0";
//   try {
//     return shortString.encodeShortString(str);
//   } catch (error) {
//     console.error("Error converting string to felt:", error);
//     return "0x0";
//   }
// }

// export function feltToStr(felt) {
//   if (!felt || felt === "0x0") return "";
//   try {
//     return shortString.decodeShortString(felt);
//   } catch (error) {
//     console.error("Error converting felt to string:", error);
//     return "";
//   }
// }

// export function isStarkNetAvailable() {
//   return !!(provider && contract);
// }

// // Create account from private key
// export function createAccount(privateKey, address) {
//   if (!provider) {
//     throw new Error("StarkNet provider not available");
//   }
  
//   try {
//     return new Account(provider, address, privateKey);
//   } catch (error) {
//     console.error("Error creating account:", error);
//     throw error;
//   }
// }

// // Mock functions for now - replace with real implementations after deployment
// export async function registerArtisan(account, name, service, location) {
//   await initializeStarkNet();
//   if (!isStarkNetAvailable()) {
//     throw new Error("StarkNet services not available");
//   }
//   throw new Error("StarkNet functionality temporarily disabled");
// }

// export async function createBooking(account, artisanAddress, amount) {
//   await initializeStarkNet();
//   if (!isStarkNetAvailable()) {
//     throw new Error("StarkNet services not available");
//   }
//   throw new Error("StarkNet functionality temporarily disabled");
// }

// export async function releasePayment(account, artisanAddress, customerAddress) {
//   await initializeStarkNet();
//   if (!isStarkNetAvailable()) {
//     throw new Error("StarkNet services not available");
//   }
//   throw new Error("StarkNet functionality temporarily disabled");
// }

// export async function getBalance(userAddress) {
//   await initializeStarkNet();
//   if (!isStarkNetAvailable()) {
//     throw new Error("StarkNet services not available");
//   }
//   throw new Error("StarkNet functionality temporarily disabled");
// }

// export async function getArtisanDetails(artisanAddress) {
//   await initializeStarkNet();
//   if (!isStarkNetAvailable()) {
//     throw new Error("StarkNet services not available");
//   }
//   throw new Error("StarkNet functionality temporarily disabled");
// }

// export async function getEscrowStatus(artisanAddress, customerAddress) {
//   await initializeStarkNet();
//   if (!isStarkNetAvailable()) {
//     throw new Error("StarkNet services not available");
//   }
//   throw new Error("StarkNet functionality temporarily disabled");
// }

// export async function refundCustomer(account, artisanAddress, customerAddress) {
//   await initializeStarkNet();
//   if (!isStarkNetAvailable()) {
//     throw new Error("StarkNet services not available");
//   }
//   throw new Error("StarkNet functionality temporarily disabled");
// }
import { Contract, RpcProvider, Account, shortString } from "starknet";

// Initialize StarkNet
let provider = null;
let contract = null;

// Simple initialization without dynamic imports
function initializeStarkNet() {
  try {
    provider = new RpcProvider({
      nodeUrl: process.env.STARKNET_RPC || "https://starknet-sepolia.public.blastapi.io"
    });

    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (contractAddress) {
      // Create contract with minimal ABI for the functions we need
      const minimalABI = [
        {
          "type": "function",
          "name": "register_artisan",
          "inputs": [
            {"name": "name", "type": "felt252"},
            {"name": "service", "type": "felt252"},
            {"name": "location", "type": "felt252"}
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "create_booking",
          "inputs": [
            {"name": "artisan", "type": "core::starknet::contract_address::ContractAddress"},
            {"name": "amount", "type": "core::integer::u128"}
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "release_payment",
          "inputs": [
            {"name": "artisan", "type": "core::starknet::contract_address::ContractAddress"},
            {"name": "customer", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "refund_customer",
          "inputs": [
            {"name": "artisan", "type": "core::starknet::contract_address::ContractAddress"},
            {"name": "customer", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "add_balance",
          "inputs": [
            {"name": "user", "type": "core::starknet::contract_address::ContractAddress"},
            {"name": "amount", "type": "core::integer::u128"}
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_balance",
          "inputs": [
            {"name": "user", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "core::integer::u128"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_artisan_details",
          "inputs": [
            {"name": "artisan", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "(core::felt252, core::felt252, core::felt252)"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_escrow_status",
          "inputs": [
            {"name": "artisan", "type": "core::starknet::contract_address::ContractAddress"},
            {"name": "customer", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "core::felt252"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_escrow_balance",
          "inputs": [
            {"name": "artisan", "type": "core::starknet::contract_address::ContractAddress"},
            {"name": "customer", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "core::integer::u128"}],
          "state_mutability": "view"
        }
      ];
      
      contract = new Contract(minimalABI, contractAddress, provider);
      console.log("StarkNet contract initialized");
    }
  } catch (error) {
    console.error("Failed to initialize StarkNet:", error);
  }
}

// Initialize on import
initializeStarkNet();

// Helper functions
export function strToFelt(str) {
  if (!str) return "0x0";
  try {
    return shortString.encodeShortString(str);
  } catch (error) {
    return "0x0";
  }
}

export function feltToStr(felt) {
  if (!felt || felt === "0x0") return "";
  try {
    return shortString.decodeShortString(felt);
  } catch (error) {
    return "";
  }
}

export function isStarkNetAvailable() {
  return !!(provider && contract);
}

// Create account from private key
export function createAccount(privateKey, address) {
  if (!provider) {
    throw new Error("StarkNet provider not available");
  }
  return new Account(provider, address, privateKey);
}

// StarkNet contract functions
export async function registerArtisan(account, name, service, location) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  const contractWithAccount = new Contract(contract.abi, contract.address, provider);
  contractWithAccount.connect(account);
  
  return await contractWithAccount.register_artisan(
    strToFelt(name),
    strToFelt(service),
    strToFelt(location)
  );
}

export async function createBooking(account, artisanAddress, amount) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  const contractWithAccount = new Contract(contract.abi, contract.address, provider);
  contractWithAccount.connect(account);
  
  return await contractWithAccount.create_booking(artisanAddress, amount);
}

export async function releasePayment(account, artisanAddress, customerAddress) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  const contractWithAccount = new Contract(contract.abi, contract.address, provider);
  contractWithAccount.connect(account);
  
  return await contractWithAccount.release_payment(artisanAddress, customerAddress);
}

export async function refundCustomer(account, artisanAddress, customerAddress) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  const contractWithAccount = new Contract(contract.abi, contract.address, provider);
  contractWithAccount.connect(account);
  
  return await contractWithAccount.refund_customer(artisanAddress, customerAddress);
}

export async function addBalance(account, userAddress, amount) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  const contractWithAccount = new Contract(contract.abi, contract.address, provider);
  contractWithAccount.connect(account);
  
  return await contractWithAccount.add_balance(userAddress, amount);
}

// View functions
export async function getBalance(userAddress) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  return await contract.get_balance(userAddress);
}

export async function getArtisanDetails(artisanAddress) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  const details = await contract.get_artisan_details(artisanAddress);
  return {
    name: feltToStr(details[0]),
    service: feltToStr(details[1]),
    location: feltToStr(details[2])
  };
}

export async function getEscrowStatus(artisanAddress, customerAddress) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  return await contract.get_escrow_status(artisanAddress, customerAddress);
}

export async function getEscrowBalance(artisanAddress, customerAddress) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  return await contract.get_escrow_balance(artisanAddress, customerAddress);
}