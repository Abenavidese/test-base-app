import ClientOnly from '../components/ClientOnly'
import WalletConnection from '../components/WalletConnection'
import ConditionalSetup from '../components/ConditionalSetup'
import ClaimForm from '../components/ClaimForm'
import UpgradeButton from '../components/UpgradeButton'
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            🎫 Merch MVP
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            SBT and Premium NFT System for Event Attendance
          </p>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>
            Built on Base Sepolia • Powered by Ethereum Attestation Service
          </p>
        </div>

        <ClientOnly fallback={
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            backgroundColor: '#f9f9f9',
            textAlign: 'center',
            color: '#666'
          }}>
            Loading dApp...
          </div>
        }>
          {/* Step 1: Wallet Connection */}
          <div style={{ marginBottom: '2rem' }}>
            <WalletConnection />
          </div>

          {/* Step 1.5: Contract Setup (Solo si es necesario) */}
          <ConditionalSetup />

          {/* Step 2: Claim SBT */}
          <div style={{ marginBottom: '2rem' }}>
            <ClaimForm />
          </div>

          {/* Step 3: Upgrade to Premium */}
          <div style={{ marginBottom: '2rem' }}>
            <UpgradeButton />
          </div>

          {/* Demo Information */}
          <div style={{
            border: '1px solid #e6f3ff',
            borderRadius: '12px',
            padding: '1.5rem',
            backgroundColor: '#f8fcff'
          }}>
            <h3 style={{ marginTop: 0, color: '#1a5490' }}>🧪 Demo Information</h3>
            
            <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Test Claim Codes:</strong> DEMO123, TEST456, CLAIM789
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Sample Event Names:</strong> MyEvent2025, BaseBootcamp, ETHGlobal
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>How to test:</strong>
                <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
                  <li>Connect your wallet and switch to Base Sepolia</li>
                  <li>Use one of the test claim codes above</li>
                  <li>Enter any event name (generates unique eventId)</li>
                  <li>Backend validates the code and generates signature</li>
                  <li>Contract mints SBT using backend signature (any user can claim!)</li>
                  <li>Try minting a companion Premium NFT (keeps your SBT)</li>
                </ol>
              </div>

              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: '#fff3cd',
                borderRadius: '6px',
                border: '1px solid #ffeaa7'
              }}>
                <strong>⚠️ Note:</strong> Code validation is currently mock data. Backend generates real signatures 
                for contract minting. Premium NFTs are companions (your SBT is preserved).
              </div>
            </div>
          </div>
        </ClientOnly>
      </main>
    </div>
  );
}
