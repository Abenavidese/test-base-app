'use client'

import { useWallet } from '../hooks/useWallet'
import { formatAddress } from '../lib/contracts'

export default function WalletConnection() {
  const { 
    account, 
    chainId, 
    connected, 
    connecting, 
    error, 
    isCorrectNetwork,
    connect, 
    disconnect,
    switchToBaseSepolia 
  } = useWallet()

  const checkMetaMask = () => {
    if (typeof window !== 'undefined') {
      console.log('Window.ethereum:', !!window.ethereum)
      console.log('Is MetaMask:', window.ethereum?.isMetaMask)
      console.log('Current chainId:', window.ethereum?.chainId)
      console.log('Provider details:', window.ethereum)
    }
  }

  const getNetworkStatus = () => {
    if (!connected) return 'Not connected'
    if (!isCorrectNetwork) return `Wrong network (${chainId})`
    return `✅ Base Sepolia (${chainId})`
  }

  const getNetworkColor = () => {
    if (!connected) return '#666'
    if (!isCorrectNetwork) return '#ff6b6b'
    return '#51cf66'
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Wallet Connection</h2>
      
      {/* Wallet Status */}
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>MetaMask:</strong> {typeof window !== 'undefined' && window.ethereum?.isMetaMask ? '✅ Detected' : '❌ Not found'}
        </div>
        
        {/* Instructions */}
        {!connected && (
          <div style={{ 
            backgroundColor: '#e6f3ff', 
            padding: '0.75rem', 
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: '#1a5490'
          }}>
            <strong>Before connecting:</strong>
            <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
              <li>Make sure MetaMask is installed and unlocked</li>
              <li>Ensure you have at least one account created/imported</li>
              <li>If you have multiple wallets, disable others temporarily</li>
            </ol>
          </div>
        )}
        
        <button 
          onClick={checkMetaMask}
          style={{ 
            marginTop: '0.5rem',
            padding: '0.25rem 0.5rem', 
            fontSize: '0.8rem',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Debug Provider
        </button>
      </div>
      
      {error && (
        <div style={{ 
          color: '#ff6b6b', 
          marginBottom: '1rem',
          padding: '0.5rem',
          backgroundColor: '#ffe0e0',
          borderRadius: '6px'
        }}>
          Error: {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <strong>Status:</strong> {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {account && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Account:</strong> {formatAddress(account)}
          <br />
          <small style={{ color: '#666' }}>{account}</small>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <strong>Network:</strong>{' '}
        <span style={{ color: getNetworkColor() }}>
          {getNetworkStatus()}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {!connected ? (
          <button
            onClick={connect}
            disabled={connecting}
            style={{
              backgroundColor: '#007cff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: connecting ? 'not-allowed' : 'pointer',
              opacity: connecting ? 0.5 : 1
            }}
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <>
            <button
              onClick={disconnect}
              style={{
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Disconnect
            </button>

            {!isCorrectNetwork && (
              <button
                onClick={switchToBaseSepolia}
                style={{
                  backgroundColor: '#ffa500',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Switch to Base Sepolia
              </button>
            )}
          </>
        )}
      </div>

      {connected && isCorrectNetwork && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#e6ffe6', 
          borderRadius: '6px' 
        }}>
          ✅ Ready to interact with contracts!
        </div>
      )}
    </div>
  )
}