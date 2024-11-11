import React, { createContext, useContext, ReactNode } from 'react'
import { EventsContextType } from '../types'
import { useEvents } from '../hooks/useEvents'

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const eventsHook = useEvents()

  return (
    <EventsContext.Provider value={eventsHook}>
      {children}
    </EventsContext.Provider>
  )
}

export const useEventsContext = (): EventsContextType => {
  const context = useContext(EventsContext)

  if (context === undefined) {
    throw new Error('useEventsContext must be used within an EventsProvider')
  }

  return context
}
