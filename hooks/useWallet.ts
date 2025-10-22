'use client'

import { useState, useEffect } from 'react'

// Base Sepolia network config
const BASE_SEPOLIA = {
  chainId: `0x${(84532).toString(16)}`, // 0x14a34
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org'],
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Switch to Base Sepolia network
  const switchToBaseSepolia = async () => {
    if (!window.ethereum) {
      throw new Error('No wallet found')
    }

    try {
      // Try to switch to Base Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA.chainId }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA],
          })
        } catch (addError) {
          throw new Error('Failed to add Base Sepolia network')
        }
      } else {
        throw switchError
      }
    }
  }

  // Ensure connected and on correct network
  const ensureConnected = async () => {
    if (!account) {
      throw new Error('Wallet not connected')
    }

    if (chainId !== 84532) {
      await switchToBaseSepolia()
    }

    return true
  }

  // Simple connect function
  const connect = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask')
      return
    }

    setConnecting(true)
    setError(null)

    try {
      console.log('Requesting accounts...')
      console.log('Provider details:', {
        isMetaMask: window.ethereum.isMetaMask,
        chainId: window.ethereum.chainId,
        selectedAddress: window.ethereum.selectedAddress
      })
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      console.log('Accounts received:', accounts)
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        console.log('Connected to account:', accounts[0])

        // Get current chain
        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId'
        })
        const parsedChainId = parseInt(currentChainId, 16)
        setChainId(parsedChainId)

        // Auto-switch to Base Sepolia if not on it
        if (parsedChainId !== 84532) {
          console.log('Wrong network, switching to Base Sepolia...')
          await switchToBaseSepolia()
        }

      } else {
        setError('No accounts found - Please unlock MetaMask and create/import an account')
      }
    } catch (err: any) {
      console.log('Connection error details:', err)
      
      if (err.code === 4001) {
        setError('Connection rejected - Please approve the connection in MetaMask')
      } else if (err.code === -32002) {
        setError('Connection request pending - Please check MetaMask popup')
      } else if (err.message?.includes('wallet must has at least one account')) {
        setError('MetaMask has no accounts - Please unlock MetaMask and create/import an account')
      } else {
        setError(`Connection failed: ${err.message || 'Unknown error'}`)
      }
    } finally {
      setConnecting(false)
    }
  }

  // Simple disconnect
  const disconnect = () => {
    setAccount(null)
    setChainId(null)
    setError(null)
  }

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      // Wait a bit for providers to initialize
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (window.ethereum) {
        try {
          console.log('Checking existing connection...')
          
          // First check if MetaMask is unlocked/has accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          console.log('Existing accounts:', accounts)
          
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0])
            console.log('Already connected to:', accounts[0])

            // Get chain ID
            const currentChainId = await window.ethereum.request({
              method: 'eth_chainId'
            })
            setChainId(parseInt(currentChainId, 16))
          }
        } catch (err: any) {
          console.log('Error checking existing connection:', err)
          // Don't show error on initial check - wallet might just be locked
        }
      } else {
        console.log('No ethereum provider found')
        setError('Please install MetaMask')
      }
    }
    
    checkConnection()
  }, [])

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts[0] || null)
        if (!accounts[0]) {
          setChainId(null)
        }
      }

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16))
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  return {
    account,
    chainId,
    connected: !!account,
    connecting,
    error,
    isCorrectNetwork: chainId === 84532,
    connect,
    disconnect,
    switchToBaseSepolia,
    ensureConnected
  }
}