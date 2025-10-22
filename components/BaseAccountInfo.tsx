'use client'

import { useMiniApp } from '../hooks/useMiniApp'
import { useBaseAccountCapabilities } from '../hooks/useBaseAccountCapabilities'

export default function BaseAccountInfo() {
  const { isInMiniApp, user } = useMiniApp()
  const capabilities = useBaseAccountCapabilities()

  if (!isInMiniApp || !user) {
    return null
  }

  if (capabilities.isLoading) {
    return (
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#f9f9f9'
      }}>
        🔍 Detecting Base Account capabilities...
      </div>
    )
  }

  return (
    <div style={{
      border: '2px solid #0052ff',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#f0f7ff'
    }}>
      <div style={{ fontWeight: 'bold', color: '#0052ff', marginBottom: '0.75rem' }}>
        🚀 Base Account Features
      </div>
      
      <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: capabilities.atomicBatch ? '#28a745' : '#6c757d' }}>
            {capabilities.atomicBatch ? '✅' : '❌'} Batch Transactions
          </span>
          {capabilities.atomicBatch && (
            <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              (Multiple operations in one click!)
            </span>
          )}
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: capabilities.paymasterService ? '#28a745' : '#6c757d' }}>
            {capabilities.paymasterService ? '✅' : '❌'} Sponsored Gas
          </span>
          {capabilities.paymasterService && (
            <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              (Gasless transactions!)
            </span>
          )}
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: capabilities.auxiliaryFunds ? '#28a745' : '#6c757d' }}>
            {capabilities.auxiliaryFunds ? '✅' : '❌'} Auxiliary Funds
          </span>
          {capabilities.auxiliaryFunds && (
            <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              (Smart payment routing!)
            </span>
          )}
        </div>
      </div>

      {capabilities.isBaseAccount && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem',
          backgroundColor: '#e7f3ff',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#0052ff',
          textAlign: 'center'
        }}>
          🎉 Your Base Account unlocks premium Web3 UX!
        </div>
      )}
    </div>
  )
}