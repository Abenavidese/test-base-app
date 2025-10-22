import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { baseSepolia } from 'viem/chains'

// Contract configuration
export const CONTRACTS = {
  MERCH_MANAGER: process.env.NEXT_PUBLIC_MERCH_MANAGER as `0x${string}`,
  PREMIUM_MERCH: process.env.NEXT_PUBLIC_PREMIUM_MERCH as `0x${string}`,
  BASIC_MERCH: process.env.NEXT_PUBLIC_BASIC_MERCH as `0x${string}`,
  EAS_INTEGRATION: process.env.NEXT_PUBLIC_EAS_INTEGRATION as `0x${string}`,
}

export const CHAIN_CONFIG = {
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'),
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org',
  CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Base Sepolia',
  EXPLORER_URL: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://sepolia.basescan.org',
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
}

// Create viem clients
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(CHAIN_CONFIG.RPC_URL)
})

export const getWalletClient = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum)
    })
  }
  return null
}

// BasicMerch ABI - New signature-based minting
export const BASIC_MERCH_ABI = [
  {
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_eventId', type: 'uint256' },
      { name: '_tokenURI', type: 'string' },
      { name: '_signature', type: 'bytes' }
    ],
    name: 'mintSBT',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_eventId', type: 'uint256' }
    ],
    name: 'getSBTByEvent',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_tokenId', type: 'uint256' }
    ],
    name: 'isApprovedOrOwner',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'eventId', type: 'uint256' },
      { indexed: false, name: 'tokenURI', type: 'string' }
    ],
    name: 'SBTMinted',
    type: 'event',
  },
] as const

// PremiumMerch ABI - Companion minting
export const PREMIUM_MERCH_ABI = [
  {
    inputs: [
      { name: '_sbtId', type: 'uint256' },
      { name: '_organizer', type: 'address' },
      { name: '_upgrader', type: 'address' }
    ],
    name: 'mintCompanion',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_sbtId', type: 'uint256' },
      { name: '_user', type: 'address' }
    ],
    name: 'canMintCompanion',
    outputs: [
      { name: '', type: 'bool' },
      { name: '', type: 'string' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'upgradeFee',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_sbtId', type: 'uint256' }],
    name: 'isSBTUsedForCompanion',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_sbtId', type: 'uint256' }],
    name: 'getPremiumTokenId',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'sbtId', type: 'uint256' },
      { indexed: true, name: 'premiumId', type: 'uint256' },
      { indexed: false, name: 'fee', type: 'uint256' }
    ],
    name: 'CompanionMinted',
    type: 'event',
  },
] as const

// MerchManager ABI - Simplified (only for reference, not used in new flow)
export const MERCH_MANAGER_ABI = [
  // Read functions
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },

] as const

// Utility functions
export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatEther = (wei: bigint): string => {
  try {
    return (Number(wei) / 1e18).toFixed(4)
  } catch {
    return '0'
  }
}

export const parseEther = (ether: string): bigint => {
  try {
    return BigInt(Math.floor(parseFloat(ether) * 1e18))
  } catch {
    return 0n
  }
}

// Contract interaction helpers
export const getExplorerUrl = (hash: string, type: 'tx' | 'address' = 'tx'): string => {
  return `${CHAIN_CONFIG.EXPLORER_URL}/${type}/${hash}`
}

// Validation helpers
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Type definitions for results
export interface ClaimResult {
  success: boolean
  txHash?: string
  tokenId?: number
  error?: string
}

export interface CompanionResult {
  success: boolean
  txHash?: string
  premiumTokenId?: number
  fee?: string
  error?: string
}

// Backend API functions
export async function validateCode(code: string): Promise<{
  valid: boolean
  eventId?: number
  tokenURI?: string
  error?: string
  status?: string
}> {
  try {
    const response = await fetch(`${CHAIN_CONFIG.BACKEND_URL}/api/validate-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      return {
        valid: false,
        error: data.error || 'Code validation failed',
        status: data.status
      }
    }

    return {
      valid: data.valid,
      eventId: data.eventId,
      tokenURI: data.tokenURI,
      status: data.status
    }
  } catch (error) {
    console.error('Error validating code:', error)
    return {
      valid: false,
      error: 'Network error validating code'
    }
  }
}

export async function getSignatureForMint(
  to: string,
  eventId: number,
  tokenURI: string,
  code: string
): Promise<{
  signature?: string
  issuer?: string
  error?: string
}> {
  try {
    const response = await fetch(`${CHAIN_CONFIG.BACKEND_URL}/api/sign-mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, eventId, tokenURI, code }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      return {
        error: data.error || 'Failed to get signature'
      }
    }

    return {
      signature: data.signature,
      issuer: data.issuer
    }
  } catch (error) {
    console.error('Error getting signature:', error)
    return {
      error: 'Network error getting signature'
    }
  }
}

// Contract interaction functions

// Get upgrade fee from PremiumMerch
export async function getUpgradeFee(): Promise<bigint> {
  try {
    const fee = await publicClient.readContract({
      address: CONTRACTS.PREMIUM_MERCH,
      abi: PREMIUM_MERCH_ABI,
      functionName: 'upgradeFee',
    })
    return fee as bigint
  } catch (error) {
    console.error('Error getting upgrade fee:', error)
    return parseEther('0.001') // Default fallback
  }
}

// Mint SBT with signature
export async function mintSBT(
  to: string,
  eventId: number,
  tokenURI: string,
  signature: string,
  account: string
): Promise<ClaimResult> {
  try {
    const walletClient = getWalletClient()
    if (!walletClient) {
      throw new Error('Wallet client not available')
    }

    const hash = await walletClient.writeContract({
      address: CONTRACTS.BASIC_MERCH,
      abi: BASIC_MERCH_ABI,
      functionName: 'mintSBT',
      args: [to as `0x${string}`, BigInt(eventId), tokenURI, signature as `0x${string}`],
      account: account as `0x${string}`,
    })

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    // Extract tokenId from logs if available
    let tokenId: number | undefined
    for (const log of receipt.logs) {
      try {
        // Parse SBTMinted event to get tokenId
        if (log.topics[0] && log.topics[2]) {
          tokenId = Number(log.topics[2])
        }
      } catch (e) {
        // Continue if parsing fails
      }
    }

    return {
      success: true,
      txHash: hash,
      tokenId,
    }
  } catch (error: any) {
    console.error('Error minting SBT:', error)
    
    let errorMessage = error.message || 'Failed to mint SBT'
    
    if (error.message?.includes('InvalidSignature')) {
      errorMessage = 'Invalid signature from backend'
    } else if (error.message?.includes('DuplicateEventMint')) {
      errorMessage = 'Already minted SBT for this event'
    } else if (error.message?.includes('user rejected')) {
      errorMessage = 'Transaction rejected by user'
    } else if (error.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient ETH for gas'
    }

    return {
      success: false,
      error: errorMessage,
      txHash: error.receipt?.transactionHash || undefined
    }
  }
}

// Check if user can mint companion
export async function canMintCompanion(sbtId: number, userAddress: string): Promise<{canMint: boolean, reason: string}> {
  try {
    const result = await publicClient.readContract({
      address: CONTRACTS.PREMIUM_MERCH,
      abi: PREMIUM_MERCH_ABI,
      functionName: 'canMintCompanion',
      args: [BigInt(sbtId), userAddress as `0x${string}`],
    }) as [boolean, string]
    
    return {
      canMint: result[0],
      reason: result[1]
    }
  } catch (error) {
    console.error('Error checking companion eligibility:', error)
    return {
      canMint: false,
      reason: 'Unable to check eligibility'
    }
  }
}

// Get SBT balance
export async function getSBTBalance(userAddress: string): Promise<number> {
  try {
    const balance = await publicClient.readContract({
      address: CONTRACTS.BASIC_MERCH,
      abi: BASIC_MERCH_ABI,
      functionName: 'balanceOf',
      args: [userAddress as `0x${string}`],
    }) as bigint
    
    return Number(balance)
  } catch (error) {
    console.error('Error getting SBT balance:', error)
    return 0
  }
}

// Mint Companion NFT
export async function mintCompanion(
  sbtId: number,
  organizer: string,
  account: string,
  fee: bigint
): Promise<CompanionResult> {
  try {
    const walletClient = getWalletClient()
    if (!walletClient) {
      throw new Error('Wallet client not available')
    }

    // Pre-validate the mint
    const validation = await canMintCompanion(sbtId, account)
    if (!validation.canMint) {
      return {
        success: false,
        error: `Cannot mint companion: ${validation.reason}`
      }
    }

    const hash = await walletClient.writeContract({
      address: CONTRACTS.PREMIUM_MERCH,
      abi: PREMIUM_MERCH_ABI,
      functionName: 'mintCompanion',
      args: [BigInt(sbtId), organizer as `0x${string}`, account as `0x${string}`],
      account: account as `0x${string}`,
      value: fee,
    })

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    // Extract premiumTokenId from logs if available
    let premiumTokenId: number | undefined
    for (const log of receipt.logs) {
      try {
        // Parse CompanionMinted event to get premiumId
        if (log.topics[0] && log.topics[2]) {
          premiumTokenId = Number(log.topics[2])
        }
      } catch (e) {
        // Continue if parsing fails
      }
    }

    return {
      success: true,
      txHash: hash,
      premiumTokenId,
      fee: formatEther(fee),
    }
  } catch (error: any) {
    console.error('Error minting companion:', error)
    
    let errorMessage = error.message || 'Failed to mint companion'
    
    if (error.message?.includes('SBTNotOwned')) {
      errorMessage = 'You do not own this SBT token'
    } else if (error.message?.includes('SBTAlreadyUpgraded')) {
      errorMessage = 'This SBT has already been used for companion minting'
    } else if (error.message?.includes('InsufficientFee')) {
      errorMessage = 'Insufficient fee provided'
    } else if (error.message?.includes('user rejected')) {
      errorMessage = 'Transaction rejected by user'
    } else if (error.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient ETH balance'
    }

    return {
      success: false,
      error: errorMessage,
      txHash: error.receipt?.transactionHash || undefined
    }
  }
}

// Complete claim flow with code validation + signature + mint
export async function claimSBTWithCode(
  code: string,
  userAddress: string
): Promise<ClaimResult> {
  try {
    // 1. Validate code
    const validation = await validateCode(code)
    if (!validation.valid || !validation.eventId || !validation.tokenURI) {
      return {
        success: false,
        error: validation.error || 'Invalid code'
      }
    }

    // 2. Get signature
    const signatureData = await getSignatureForMint(
      userAddress,
      validation.eventId,
      validation.tokenURI,
      code
    )
    
    if (!signatureData.signature) {
      return {
        success: false,
        error: signatureData.error || 'Failed to get signature'
      }
    }

    // 3. Mint SBT
    const mintResult = await mintSBT(
      userAddress,
      validation.eventId,
      validation.tokenURI,
      signatureData.signature,
      userAddress
    )

    return mintResult

  } catch (error: any) {
    console.error('Error in complete claim flow:', error)
    return {
      success: false,
      error: error.message || 'Failed to complete claim'
    }
  }
}