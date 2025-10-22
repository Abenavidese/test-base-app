'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import { 
  claimSBTWithCode,
  getSBTBalance,
  ClaimResult
} from '../lib/contracts'

export default function ClaimForm() {
  const { account, connected, isCorrectNetwork, ensureConnected } = useWallet()
  
  const [formData, setFormData] = useState({
    claimCode: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClaimResult | null>(null)
  const [sbtBalance, setSbtBalance] = useState<number>(0)

  // Get user's SBT balance
  const updateSBTBalance = async () => {
    if (account) {
      const balance = await getSBTBalance(account)
      setSbtBalance(balance)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setResult(null) // Clear previous results
  }

  // Validate form
  const isFormValid = () => {
    return formData.claimCode.trim().length >= 4
  }

  // Handle claim submission
  const handleClaim = async () => {
    if (!connected || !isCorrectNetwork) {
      setResult({ success: false, error: 'Please connect wallet and switch to Base Sepolia' })
      return
    }

    if (!isFormValid()) {
      setResult({ success: false, error: 'Please enter a valid claim code' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      await ensureConnected()
      
      // Use the complete claim flow (validate + sign + mint)
      const claimResult = await claimSBTWithCode(
        formData.claimCode.trim(),
        account!
      )
      
      setResult(claimResult)
      
      // Update balance if successful
      if (claimResult.success) {
        await updateSBTBalance()
      }

    } catch (error: any) {
      console.error('Claim error:', error)
      setResult({ 
        success: false, 
        error: error.message || 'Failed to process claim' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Update balance when component mounts and account changes
  useEffect(() => {
    if (connected && account) {
      updateSBTBalance()
    }
  }, [connected, account])

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>🎫 Claim SBT with Code</h2>

      {/* SBT Balance */}
      {connected && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          backgroundColor: '#e6f3ff',
          borderRadius: '6px',
          fontSize: '0.9rem'
        }}>
          <strong>Your SBT Balance:</strong> {sbtBalance} SBTs
        </div>
      )}

      {/* Form Fields */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Claim Code:
        </label>
        <input
          type="text"
          name="claimCode"
          value={formData.claimCode}
          onChange={handleInputChange}
          placeholder="Enter your claim code (e.g., EVENT2025, DEMO123)"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        <small style={{ color: '#666' }}>
          Valid codes: EVENT2025, DEMO123, TEST456, BLOCKCHAIN789, BASE2025, MERCH001
        </small>
      </div>

      {/* Result Display */}
      {result && (
        <div style={{ 
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: result.success ? '#e6ffe6' : '#ffe0e0',
          borderRadius: '6px',
          border: `1px solid ${result.success ? '#51cf66' : '#ff6b6b'}`
        }}>
          {result.success ? (
            <div>
              <div style={{ color: '#2b8a3e', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ✅ SBT Minted Successfully!
              </div>
              
              {result.txHash && (
                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>📄 Transaction Hash:</strong>{' '}
                  <a 
                    href={`https://sepolia.basescan.org/tx/${result.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#007cff', textDecoration: 'underline' }}
                  >
                    {result.txHash?.slice(0, 10)}...{result.txHash?.slice(-8)}
                  </a>
                </div>
              )}
              
              {result.tokenId && (
                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>🎫 SBT Token ID:</strong> {result.tokenId}
                </div>
              )}
              
              <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <strong>🔗 View on BaseScan:</strong>{' '}
                <a 
                  href={`https://sepolia.basescan.org/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#007cff' }}
                >
                  Your Account
                </a>
              </div>
              
              {result.txHash && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  fontSize: '0.9rem', 
                  color: '#2b8a3e',
                  fontWeight: 'bold'
                }}>
                  🎉 Your SBT has been minted! You can now mint a Premium Companion NFT below.
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ color: '#c92a2a', fontWeight: 'bold', marginBottom: '0.5rem' }}>❌ Claim Failed</div>
              
              <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <strong>Error:</strong> {result.error}
              </div>
              
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#666',
                backgroundColor: '#f8f9fa',
                padding: '0.5rem',
                borderRadius: '4px'
              }}>
                <strong>Common reasons for claim failure:</strong>
                <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.2rem' }}>
                  <li>Invalid or already used claim code</li>
                  <li>Backend signature validation failed</li>
                  <li>Already minted SBT for this event</li>
                  <li>Network connectivity issues</li>
                  <li>Wallet rejection or insufficient gas</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleClaim}
          disabled={loading || !connected || !isCorrectNetwork || !isFormValid()}
          style={{
            backgroundColor: '#007cff',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: (loading || !connected || !isCorrectNetwork || !isFormValid()) ? 'not-allowed' : 'pointer',
            opacity: (loading || !connected || !isCorrectNetwork || !isFormValid()) ? 0.5 : 1,
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          {loading ? 'Processing Claim...' : '🎫 Claim SBT with Backend Signature'}
        </button>
      </div>

      {/* Help Text */}
      <div style={{ 
        fontSize: '0.85rem', 
        color: '#666',
        lineHeight: 1.4
      }}>
        <strong>New Claim Flow:</strong>
        <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
          <li>Enter your claim code</li>
          <li>Backend validates the code and generates a signature</li>
          <li>SBT is minted with the backend signature (no owner required)</li>
          <li>Your SBT remains in your wallet (not burned on upgrade)</li>
        </ol>
      </div>
    </div>
  )
}