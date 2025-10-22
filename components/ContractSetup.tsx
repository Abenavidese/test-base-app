'use client'

import { useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { getWalletClient, publicClient, CONTRACTS } from '../lib/contracts'

const BASIC_MERCH_ADMIN_ABI = [
  {
    inputs: [{ name: '_issuer', type: 'address' }],
    name: 'setBackendIssuer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'backendIssuer',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export default function ContractSetup() {
  const { account, connected, isCorrectNetwork, ensureConnected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [currentIssuer, setCurrentIssuer] = useState<string>('')
  const [contractOwner, setContractOwner] = useState<string>('')
  const [isConfigured, setIsConfigured] = useState<boolean>(false)

  // Tu address del backend issuer (desde los logs)
  const BACKEND_ISSUER_ADDRESS = '0x6388681e6A22F8Fc30e3150733795255D4250db1'

  const checkCurrentIssuer = async () => {
    try {
      const issuer = await publicClient.readContract({
        address: CONTRACTS.BASIC_MERCH,
        abi: BASIC_MERCH_ADMIN_ABI,
        functionName: 'backendIssuer',
      }) as string
      setCurrentIssuer(issuer)

      const owner = await publicClient.readContract({
        address: CONTRACTS.BASIC_MERCH,
        abi: BASIC_MERCH_ADMIN_ABI,
        functionName: 'owner',
      }) as string
      setContractOwner(owner)

      // Check if correctly configured
      const configured = issuer.toLowerCase() === BACKEND_ISSUER_ADDRESS.toLowerCase()
      setIsConfigured(configured)
    } catch (error) {
      console.error('Error checking issuer:', error)
    }
  }

  const setBackendIssuer = async () => {
    if (!connected || !isCorrectNetwork || !account) {
      setResult('❌ Please connect wallet and switch to Base Sepolia')
      return
    }

    setLoading(true)
    setResult('')

    try {
      await ensureConnected()

      const walletClient = getWalletClient()
      if (!walletClient) {
        throw new Error('Wallet client not available')
      }

      const hash = await walletClient.writeContract({
        address: CONTRACTS.BASIC_MERCH,
        abi: BASIC_MERCH_ADMIN_ABI,
        functionName: 'setBackendIssuer',
        args: [BACKEND_ISSUER_ADDRESS as `0x${string}`],
        account: account as `0x${string}`,
      })

      await publicClient.waitForTransactionReceipt({ hash })
      
      setResult(`✅ Backend issuer set successfully! TX: ${hash}`)
      await checkCurrentIssuer() // Refresh current issuer

    } catch (error: any) {
      console.error('Error setting backend issuer:', error)
      let errorMessage = error.message || 'Failed to set backend issuer'
      
      if (error.message?.includes('Ownable: caller is not the owner')) {
        errorMessage = '❌ Only the contract owner can set the backend issuer'
      }
      
      setResult(`❌ Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      border: '2px solid #ff6b6b',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: '#ffe0e0',
      marginBottom: '1rem'
    }}>
      <h2 style={{ marginTop: 0, color: '#c92a2a' }}>⚙️ Contract Setup (Required)</h2>
      
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <strong>Issue:</strong> Contract needs to be configured with your backend issuer address.
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={checkCurrentIssuer}
          style={{
            backgroundColor: '#007cff',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          🔍 Check Current Settings
        </button>
      </div>

      {currentIssuer && (
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', backgroundColor: '#f8f9fa', padding: '0.75rem', borderRadius: '6px' }}>
          <div><strong>Contract Owner:</strong> {contractOwner || 'Loading...'}</div>
          <div><strong>Current Backend Issuer:</strong> {currentIssuer}</div>
          <div><strong>Required Backend Issuer:</strong> {BACKEND_ISSUER_ADDRESS}</div>
          <div><strong>Your Account:</strong> {account}</div>
          
          {currentIssuer.toLowerCase() === BACKEND_ISSUER_ADDRESS.toLowerCase() ? (
            <div style={{ color: '#2b8a3e', fontWeight: 'bold', marginTop: '0.5rem' }}>
              ✅ Backend issuer is correctly configured! This setup component can now be hidden.
            </div>
          ) : (
            <div style={{ color: '#c92a2a', fontWeight: 'bold', marginTop: '0.5rem' }}>
              ❌ Backend issuer needs to be updated
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={setBackendIssuer}
          disabled={loading || !connected || !isCorrectNetwork}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: (loading || !connected || !isCorrectNetwork) ? 'not-allowed' : 'pointer',
            opacity: (loading || !connected || !isCorrectNetwork) ? 0.5 : 1,
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Setting...' : '⚙️ Set Backend Issuer Address'}
        </button>
      </div>

      {result && (
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: result.includes('✅') ? '#e6ffe6' : '#ffe0e0',
          borderRadius: '6px',
          fontSize: '0.9rem',
          wordBreak: 'break-all'
        }}>
          {result}
        </div>
      )}

      <div style={{ 
        fontSize: '0.85rem', 
        color: '#666',
        marginTop: '1rem',
        lineHeight: 1.4
      }}>
        <strong>Instructions:</strong>
        <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
          <li>Make sure you're connected as the contract owner</li>
          <li>Click "Set Backend Issuer Address"</li>
          <li>Once configured, the SBT minting should work</li>
          <li>You can hide this component after setup</li>
        </ol>
      </div>
    </div>
  )
}