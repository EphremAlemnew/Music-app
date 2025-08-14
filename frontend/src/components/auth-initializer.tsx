'use client'

import { useEffect } from 'react'
import { initializeUserState } from '@/store'

export function AuthInitializer() {
  useEffect(() => {
    initializeUserState()
  }, [])

  return null
}