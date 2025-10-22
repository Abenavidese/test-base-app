'use client'

import { useMiniApp } from '../hooks/useMiniApp'

export default function MiniAppConnection() {
  const { isInMiniApp, user, isConnected, isLoading, error } = useMiniApp()

  if (isLoading) {
    return (
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        backgroundColor: '#f9f9f9',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          🔄 Loading MiniApp...
        </div>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>
          Connecting to Base Account
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        border: '2px solid #dc3545',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        backgroundColor: '#f8d7da',
        textAlign: 'center'
      }}>
        <div style={{ color: '#721c24', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          ❌ MiniApp Error
        </div>
        <div style={{ color: '#721c24', fontSize: '0.9rem' }}>
          {error}
        </div>
      </div>
    )
  }

  if (!isInMiniApp) {
    return (
      <div style={{
        border: '2px solid #ffc107',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        backgroundColor: '#fff3cd',
        textAlign: 'center'
      }}>
        <div style={{ color: '#856404', fontWeight: 'bold', marginBottom: '0.75rem' }}>
          📱 Base MiniApp Required
        </div>
        <div style={{ color: '#856404', fontSize: '0.9rem', lineHeight: 1.5 }}>
          This app is designed to run as a Mini App within the Base ecosystem. 
          Please open it through the Base app or a Farcaster client that supports Mini Apps.
        </div>
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          backgroundColor: '#ffeaa7', 
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#856404'
        }}>
          <strong>How to access:</strong>
          <br />
          1. Open the Base app
          <br />
          2. Navigate to Mini Apps
          <br />
          3. Search for &quot;Merch MVP&quot; or use the direct link
        </div>
      </div>
    )
  }

  if (!isConnected || !user) {
    return (
      <div style={{
        border: '2px solid #dc3545',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        backgroundColor: '#f8d7da',
        textAlign: 'center'
      }}>
        <div style={{ color: '#721c24', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          ❌ Connection Failed
        </div>
        <div style={{ color: '#721c24', fontSize: '0.9rem' }}>
          Unable to connect to your Base Account. Please refresh the app.
        </div>
      </div>
    )
  }

  return (
    <div style={{
      border: '2px solid #28a745',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem',
      backgroundColor: '#d4edda'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        {user.pfpUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={user.pfpUrl} 
            alt="Profile" 
            width={48} 
            height={48} 
            style={{ borderRadius: '50%', marginRight: '1rem' }}
          />
        )}
        <div>
          <div style={{ fontWeight: 'bold', color: '#155724', fontSize: '1.1rem' }}>
            ✅ Connected via Base Account
          </div>
          <div style={{ color: '#155724', fontSize: '0.9rem' }}>
            {user.displayName || user.username || `FID: ${user.fid}`}
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#c3e6cb', 
        padding: '0.75rem', 
        borderRadius: '6px',
        fontSize: '0.9rem',
        color: '#155724'
      }}>
        <div><strong>Farcaster ID:</strong> {user.fid}</div>
        {user.username && <div><strong>Username:</strong> @{user.username}</div>}
        <div><strong>Network:</strong> Base Sepolia</div>
        <div><strong>Status:</strong> Ready for SBT claiming 🎫</div>
      </div>

      <div style={{
        marginTop: '1rem',
        fontSize: '0.8rem',
        color: '#155724',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        🚀 No wallet connection needed - your Base Account is automatically connected!
      </div>
    </div>
  )
}