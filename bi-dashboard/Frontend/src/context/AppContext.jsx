import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // fail silently
  }
}

export function AppProvider({ children }) {
  const [currentPrompt, setCurrentPromptState] = useState(
    () => loadFromStorage('queryiq_current_prompt', '')
  )
  const [dashboardData, setDashboardDataState] = useState(
    () => loadFromStorage('queryiq_dashboard_data', null)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [queryHistory, setQueryHistory] = useState(
    () => loadFromStorage('queryiq_history', [])
  )

  useEffect(() => {
    saveToStorage('queryiq_current_prompt', currentPrompt)
  }, [currentPrompt])

  useEffect(() => {
    saveToStorage('queryiq_dashboard_data', dashboardData)
  }, [dashboardData])

  useEffect(() => {
    saveToStorage('queryiq_history', queryHistory)
  }, [queryHistory])

  const setCurrentPrompt = (prompt) => setCurrentPromptState(prompt)

  const setDashboardData = (data) => setDashboardDataState(data)

  const addToHistory = (prompt, dashboardData) => {
    setQueryHistory(prev => {
      const newEntry = {
        prompt,
        timestamp: new Date().toLocaleString(),
        dashboardData
      }
      const updated = [newEntry, ...prev]
      return updated.slice(0, 20)
    })
  }

  const clearHistory = () => {
    setQueryHistory([])
    localStorage.removeItem('queryiq_history')
  }

  const clearAll = () => {
    setCurrentPromptState('')
    setDashboardDataState(null)
    setQueryHistory([])
    setError(null)
    localStorage.removeItem('queryiq_current_prompt')
    localStorage.removeItem('queryiq_dashboard_data')
    localStorage.removeItem('queryiq_history')
  }

  const value = {
    currentPrompt,
    dashboardData,
    isLoading,
    error,
    queryHistory,
    setCurrentPrompt,
    setDashboardData,
    setIsLoading,
    setError,
    addToHistory,
    clearHistory,
    clearAll,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export default AppProvider
