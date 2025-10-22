'use client'

import { useState, useEffect } from 'react'
import { useMiniApp } from '../hooks/useMiniApp'
import { 
  getUpgradeFee, 
  mintCompanion,
  canMintCompanion,
  getSBTBalance,
  formatEther,
  CompanionResult
} from '../lib/contracts'

export default function UpgradeButton() {
  const { user, isConnected, isInMiniApp } = useMiniApp()
  const [account, setAccount] = useState<string | null>(null)
  const connected = isConnected && !!account

  // Get Base Account address
  useEffect(() => {
    if (isInMiniApp && isConnected && user) {
      // For testing, use the backend issuer address
      // TODO: Replace with actual Base Account integration
      console.log('Using test address for Base Account')
      setAccount('0x6388681e6A22F8Fc30e3150733795255D4250db1') // Backend issuer address for testing
    }
  }, [isInMiniApp, isConnected, user])
  
  const [formData, setFormData] = useState({
    sbtTokenId: '',
    organizerAddress: ''
  })
  
  const [upgradeFee, setUpgradeFee] = useState<bigint>(0n)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<CompanionResult | null>(null)
  const [validationResult, setValidationResult] = useState<{canMint: boolean, reason: string} | null>(null)
  const [sbtBalance, setSbtBalance] = useState<number>(0)

  // Load upgrade fee and SBT balance on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const fee = await getUpgradeFee()
        setUpgradeFee(fee)
        
        if (account) {
          const balance = await getSBTBalance(account)
          setSbtBalance(balance)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    
    loadData()
  }, [account])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setResult(null) // Clear previous results
  }

  // Validate form
  const isFormValid = () => {
    return (
      formData.sbtTokenId.trim().length > 0 &&
      !isNaN(Number(formData.sbtTokenId)) &&
      formData.organizerAddress.trim().length === 42 &&
      formData.organizerAddress.startsWith('0x')
    )
  }

  // Check companion mint eligibility
  const checkEligibility = async () => {
    if (!connected || !account) {
      setValidationResult({ canMint: false, reason: 'Wallet not connected' })
      return
    }

    if (!formData.sbtTokenId.trim() || isNaN(Number(formData.sbtTokenId))) {
      setValidationResult({ canMint: false, reason: 'Please enter a valid SBT Token ID' })
      return
    }

    setChecking(true)
    setValidationResult(null)

    try {
      const sbtId = parseInt(formData.sbtTokenId.trim())
      const validation = await canMintCompanion(sbtId, account)
      setValidationResult(validation)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error checking eligibility'
      setValidationResult({ 
        canMint: false, 
        reason: errorMessage
      })
    } finally {
      setChecking(false)
    }
  }

  // Handle companion mint submission
  const handleMintCompanion = async () => {
    if (!connected) {
      setResult({ success: false, error: 'Please connect your MiniApp' })
      return
    }

    if (!isFormValid()) {
      setResult({ success: false, error: 'Please fill all fields correctly' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      
      const sbtId = parseInt(formData.sbtTokenId.trim())
      
      console.log('Minting Companion:', {
        sbtId,
        organizer: formData.organizerAddress.trim(),
        fee: formatEther(upgradeFee)
      })

      const result = await mintCompanion(
        sbtId,
        formData.organizerAddress.trim(),
        account!,
        upgradeFee
      )
      
      setResult(result)

      // Update SBT balance after successful mint
      if (result.success) {
        const newBalance = await getSBTBalance(account!)
        setSbtBalance(newBalance)
      }

    } catch (error: unknown) {
      console.error('Companion mint error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to mint companion NFT'
      setResult({ 
        success: false, 
        error: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: '#f0fff0'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>🎨 Mint Premium Companion NFT</h2>

      {/* SBT Balance and Fee Display */}
      <div style={{ 
        marginBottom: '1rem', 
        padding: '0.75rem', 
        backgroundColor: '#fff3cd',
        borderRadius: '6px',
        border: '1px solid #ffeaa7'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Your SBT Balance:</strong> {sbtBalance} SBTs
        </div>
        <div>
          <strong>Companion Fee:</strong> {formatEther(upgradeFee)} ETH
          <br />
          <small style={{ color: '#666' }}>
            Fee split: 37.5% to treasury, 62.5% to event organizer
          </small>
        </div>
      </div>

      {/* Form Fields */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          SBT Token ID:
        </label>
        <input
          type="number"
          name="sbtTokenId"
          value={formData.sbtTokenId}
          onChange={handleInputChange}
          placeholder="e.g., 1, 2, 3..."
          min="1"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        <small style={{ color: '#666' }}>
          The ID of your SBT token to create a companion for (SBT will be retained)
        </small>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Organizer Address:
        </label>
        <input
          type="text"
          name="organizerAddress"
          value={formData.organizerAddress}
          onChange={handleInputChange}
          placeholder="0x..."
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        <small style={{ color: '#666' }}>
          Event organizer&apos;s address (receives 62.5% of the mint fee)
        </small>
      </div>

      {/* Eligibility Check Section */}
      {formData.sbtTokenId.trim() && (
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={checkEligibility}
            disabled={checking || !connected}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: (checking || !connected) ? 'not-allowed' : 'pointer',
              opacity: (checking || !connected) ? 0.5 : 1,
              fontSize: '0.9rem'
            }}
          >
            {checking ? 'Checking...' : '🔍 Check Companion Eligibility'}
          </button>

          {validationResult && (
            <div style={{ 
              marginTop: '0.5rem',
              padding: '0.75rem',
              backgroundColor: validationResult.canMint ? '#e6ffe6' : '#ffe0e0',
              borderRadius: '6px',
              border: `1px solid ${validationResult.canMint ? '#51cf66' : '#ff6b6b'}`,
              fontSize: '0.9rem'
            }}>
              <strong>
                {validationResult.canMint ? '✅ Eligible for Companion Mint' : '❌ Not Eligible'}:
              </strong>{' '}
              {validationResult.reason}
            </div>
          )}
        </div>
      )}

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
              <div style={{ color: '#2b8a3e', fontWeight: 'bold', marginBottom: '0.5rem' }}>✅ Companion Minted Successfully!</div>
              
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
              
              {result.premiumTokenId && (
                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>🎨 Premium Companion ID:</strong> {result.premiumTokenId}
                </div>
              )}
              
              {result.fee && (
                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>💰 Fee Paid:</strong> {result.fee} ETH
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
              
              <div style={{ 
                marginTop: '0.75rem', 
                fontSize: '0.9rem', 
                color: '#2b8a3e',
                fontWeight: 'bold'
              }}>
                🎉 Your SBT remains in your wallet AND you now own a tradable Premium Companion NFT!
              </div>
            </div>
          ) : (
            <div>
              <div style={{ color: '#c92a2a', fontWeight: 'bold', marginBottom: '0.5rem' }}>❌ Companion Mint Failed</div>
              
              {result.txHash ? (
                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>📄 Failed Transaction:</strong>{' '}
                  <a 
                    href={`https://sepolia.basescan.org/tx/${result.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#007cff', textDecoration: 'underline' }}
                  >
                    {result.txHash?.slice(0, 10)}...{result.txHash?.slice(-8)}
                  </a>
                </div>
              ) : null}
              
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
                <strong>Common reasons for companion mint failure:</strong>
                <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.2rem' }}>
                  <li>You don&apos;t own this SBT token ID</li>
                  <li>SBT was already used for companion minting</li>
                  <li>Insufficient ETH sent for mint fee</li>
                  <li>Contract is paused by owner</li>
                  <li>Invalid organizer address</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleMintCompanion}
          disabled={loading || !connected || !isFormValid()}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: (loading || !connected || !isFormValid()) ? 'not-allowed' : 'pointer',
            opacity: (loading || !connected || !isFormValid()) ? 0.5 : 1,
            fontWeight: 'bold',
            fontSize: '1rem',
            width: '100%'
          }}
        >
          {loading ? 'Minting Companion...' : `🎨 Mint Premium Companion (${formatEther(upgradeFee)} ETH)`}
        </button>
      </div>

      {/* Help Text */}
      <div style={{ 
        fontSize: '0.85rem', 
        color: '#666',
        lineHeight: 1.4
      }}>
        <strong>New Companion Flow:</strong>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
          <li>Your original SBT remains in your wallet (NOT burned)</li>
          <li>You&apos;ll receive a new tradable Premium Companion NFT (ERC-721)</li>
          <li>The mint fee is split between treasury and organizer</li>
          <li>Each SBT can only be used once for companion minting</li>
          <li>You&apos;ll own both the SBT proof AND the tradable premium NFT</li>
        </ul>
      </div>
    </div>
  )
}