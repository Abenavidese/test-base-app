'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export interface MiniAppUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  address?: string
}

export interface MiniAppContextType {
  isInMiniApp: boolean
  user: MiniAppUser | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  ready: () => void
}

const MiniAppContext = createContext<MiniAppContextType | null>(null)

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [isInMiniApp, setIsInMiniApp] = useState<boolean>(false)
  const [user, setUser] = useState<MiniAppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ready = async () => {
    try {
      await sdk.actions.ready()
    } catch (error) {
      console.error('Error calling sdk.actions.ready():', error)
    }
  }

  useEffect(() => {
    const initMiniApp = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if we're in a Mini App
        const miniAppStatus = await sdk.isInMiniApp()
        setIsInMiniApp(miniAppStatus)

        if (miniAppStatus) {
          // Call ready to hide loading screen
          await sdk.actions.ready()

          // Get context and extract user info
          const context = await sdk.context
          
          // For Base miniapps, the user is automatically "connected"
          // We extract the user info from the context
          setUser({
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfpUrl: context.user.pfpUrl,
            // Note: Base Account address will be available through wallet APIs
            address: undefined // Will be set through Base Account connection
          })
        } else {
          // Not in miniapp - show fallback message
          setUser(null)
        }
      } catch (error) {
        console.error('Error initializing MiniApp:', error)
        setError('Failed to initialize MiniApp')
        setIsInMiniApp(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initMiniApp()
  }, [])

  const contextValue: MiniAppContextType = {
    isInMiniApp,
    user,
    isConnected: isInMiniApp && user !== null,
    isLoading,
    error,
    ready
  }

  return (
    <MiniAppContext.Provider value={contextValue}>
      {children}
    </MiniAppContext.Provider>
  )
}

export function useMiniApp() {
  const context = useContext(MiniAppContext)
  if (!context) {
    throw new Error('useMiniApp must be used within a MiniAppProvider')
  }
  return context
}