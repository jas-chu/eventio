import React, { createContext, useState, ReactNode, useContext } from 'react'

interface ViewContextType {
  isDefaultView: boolean
  showCompactView: () => void
  showDefaultView: () => void
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)

export const ViewContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDefaultView, setIsDefaultView] = useState<boolean>(true)

  const showCompactView = async () => {
    setIsDefaultView(false)
  }

  const showDefaultView = async () => {
    setIsDefaultView(true)
  }

  return (
    <ViewContext.Provider
      value={{ isDefaultView, showCompactView, showDefaultView }}
    >
      {children}
    </ViewContext.Provider>
  )
}

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error('useView must be used within an ViewContextProvider')
  }
  return context
}
