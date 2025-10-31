import { Contract, RpcProvider, Account, shortString } from "starknet";

// Initialize provider with error handling
let provider;
try {
  provider = new RpcProvider({
    nodeUrl: process.env.STARKNET_RPC || "https://starknet-sepolia.public.blastapi.io"
  });
} catch (error) {
  console.error("Failed to initialize StarkNet provider:", error);
}

const contractAddress = process.env.CONTRACT_ADDRESS;
let contract;

if (provider && contractAddress) {
  try {
    // Import ABI dynamically to avoid issues in serverless
    const abi = await import('../abi/artisan_escrow.json', {
      assert: { type: 'json' }
    }).then(module => module.default);
    
    contract = new Contract(abi, contractAddress, provider);
  } catch (error) {
    console.error("Failed to initialize contract:", error);
  }
}

// Helper function to convert string to felt252
export function strToFelt(str) {
  if (!str) return "0x0";
  try {
    return shortString.encodeShortString(str);
  } catch (error) {
    console.error("Error converting string to felt:", error);
    return "0x0";
  }
}

// Helper function to convert felt252 to string
export function feltToStr(felt) {
  if (!felt || felt === "0x0") return "";
  try {
    return shortString.decodeShortString(felt);
  } catch (error) {
    console.error("Error converting felt to string:", error);
    return "";
  }
}

// Check if StarkNet services are available
export function isStarkNetAvailable() {
  return !!(provider && contract);
}

// Register artisan on blockchain
export async function registerArtisan(account, name, service, location) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  try {
    const contractWithAccount = new Contract(contract.abi, contractAddress, provider);
    contractWithAccount.connect(account);
    
    return await contractWithAccount.register_artisan(
      strToFelt(name),
      strToFelt(service),
      strToFelt(location)
    );
  } catch (error) {
    console.error("Error registering artisan:", error);
    throw error;
  }
}

// Create booking (escrow payment)
export async function createBooking(account, artisanAddress, amount) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  try {
    const contractWithAccount = new Contract(contract.abi, contractAddress, provider);
    contractWithAccount.connect(account);
    
    return await contractWithAccount.create_booking(artisanAddress, amount);
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

// Release payment to artisan
export async function releasePayment(account, artisanAddress, customerAddress) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  try {
    const contractWithAccount = new Contract(contract.abi, contractAddress, provider);
    contractWithAccount.connect(account);
    
    return await contractWithAccount.release_payment(artisanAddress, customerAddress);
  } catch (error) {
    console.error("Error releasing payment:", error);
    throw error;
  }
}

// View functions (don't need account)
export async function getBalance(userAddress) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  try {
    return await contract.get_balance(userAddress);
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
}

export async function getArtisanDetails(artisanAddress) {
  if (!isStarkNetAvailable()) {
    throw new Error("StarkNet services not available");
  }
  
  try {
    const details = await contract.get_artisan_details(artisanAddress);
    return {
      name: feltToStr(details[0]),
      service: feltToStr(details[1]),
      location: feltToStr(details[2])
    };
  } catch (error) {
    console.error("Error getting artisan details:", error);
    throw error;
  }
}

// Create account from private key
export function createAccount(privateKey, address) {
  if (!provider) {
    throw new Error("StarkNet provider not available");
  }
  
  try {
    return new Account(provider, address, privateKey);
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}