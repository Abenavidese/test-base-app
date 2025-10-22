'use client'

import { useState, useEffect } from 'react'
import { useMiniApp } from './useMiniApp'

export interface BaseAccountCapabilities {
  atomicBatch: boolean
  paymasterService: boolean
  auxiliaryFunds: boolean
  isBaseAccount: boolean
  isLoading: boolean
}

export function useBaseAccountCapabilities(): BaseAccountCapabilities {
  const { isInMiniApp, user } = useMiniApp()
  const [capabilities, setCapabilities] = useState<BaseAccountCapabilities>({
    atomicBatch: false,
    paymasterService: false,
    auxiliaryFunds: false,
    isBaseAccount: false,
    isLoading: true
  })

  useEffect(() => {
    const detectCapabilities = async () => {
      if (!isInMiniApp || !user) {
        setCapabilities({
          atomicBatch: false,
          paymasterService: false,
          auxiliaryFunds: false,
          isBaseAccount: false,
          isLoading: false
        })
        return
      }

      try {
        // Check if we have access to wallet capabilities API
        if (typeof window !== 'undefined' && window.ethereum) {
          const capabilities = await window.ethereum.request({
            method: 'wallet_getCapabilities',
            params: [user.address]
          })

          const baseSepoliaCapabilities = capabilities['0x14a34'] // Base Sepolia chain ID in hex

          if (baseSepoliaCapabilities) {
            setCapabilities({
              atomicBatch: baseSepoliaCapabilities.atomicBatch?.supported || false,
              paymasterService: baseSepoliaCapabilities.paymasterService?.supported || false,
              auxiliaryFunds: baseSepoliaCapabilities.auxiliaryFunds?.supported || false,
              isBaseAccount: true,
              isLoading: false
            })
          } else {
            // Fallback: assume Base Account capabilities in MiniApp context
            setCapabilities({
              atomicBatch: true,
              paymasterService: true,
              auxiliaryFunds: true,
              isBaseAccount: true,
              isLoading: false
            })
          }
        } else {
          // In MiniApp context, assume Base Account with full capabilities
          setCapabilities({
            atomicBatch: true,
            paymasterService: true,
            auxiliaryFunds: true,
            isBaseAccount: true,
            isLoading: false
          })
        }
      } catch (error) {
        console.error('Error detecting Base Account capabilities:', error)
        // Fallback to basic capabilities
        setCapabilities({
          atomicBatch: false,
          paymasterService: false,
          auxiliaryFunds: false,
          isBaseAccount: isInMiniApp,
          isLoading: false
        })
      }
    }

    detectCapabilities()
  }, [isInMiniApp, user])

  return capabilities
}
