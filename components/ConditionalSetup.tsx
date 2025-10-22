'use client'

import { useState, useEffect } from 'react'
import { publicClient, CONTRACTS } from '../lib/contracts'
import ContractSetup from './ContractSetup'

const BASIC_MERCH_ADMIN_ABI = [
  {
    inputs: [],
    name: 'backendIssuer',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export default function ConditionalSetup() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null) // null = loading
  const [showSetup, setShowSetup] = useState(false)

  // Tu address del backend issuer
  const BACKEND_ISSUER_ADDRESS = '0x6388681e6A22F8Fc30e3150733795255D4250db1'

  const checkConfiguration = async () => {
    try {
      const issuer = await publicClient.readContract({
        address: CONTRACTS.BASIC_MERCH,
        abi: BASIC_MERCH_ADMIN_ABI,
        functionName: 'backendIssuer',
      }) as string

      const configured = issuer.toLowerCase() === BACKEND_ISSUER_ADDRESS.toLowerCase()
      setIsConfigured(configured)
    } catch (error) {
      console.error('Error checking configuration:', error)
      setIsConfigured(false) // Show setup on error
    }
  }

  useEffect(() => {
    checkConfiguration()
  }, [])

  // Loading state
  if (isConfigured === null) {
    return (
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1rem',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        color: '#666'
      }}>
        🔍 Checking contract configuration...
      </div>
    )
  }

  // Already configured
  if (isConfigured && !showSetup) {
    return (
      <div style={{
        border: '2px solid #28a745',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#e8f5e8',
        textAlign: 'center'
      }}>
        <div style={{ color: '#2b8a3e', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          ✅ Contract is properly configured!
        </div>
        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.75rem' }}>
          Backend issuer is set. Users can now claim SBTs with valid codes.
        </div>
        <button
          onClick={() => setShowSetup(true)}
          style={{
            backgroundColor: '#007cff',
            color: 'white',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          🔧 Show Setup Panel
        </button>
      </div>
    )
  }

  // Show full setup component
  return (
    <>
      <ContractSetup />
      {isConfigured && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button
            onClick={() => setShowSetup(false)}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            ↑ Hide Setup Panel
          </button>
        </div>
      )}
    </>
  )
}