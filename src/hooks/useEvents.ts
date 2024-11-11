import { useState, useCallback } from 'react'
import { getEvents, joinEvent, leaveEvent, createEvent } from '../services/api'
import { Event, CreateEventData, EventsContextType } from '../types'
import { useAuth } from '../context/AuthContext'

const processOwnerData = (event: Event, currentUserId: string): Event => {
  if (currentUserId === event.owner.id) {
    return {
      ...event,
      status: 'EDIT',
    }
  }
  const isAttendee = event.attendees.some(
    (attendee) => attendee.id === currentUserId
  )
  const status = isAttendee ? 'LEAVE' : 'JOIN'
  return {
    ...event,
    status,
  }
}

export const useEvents = (): EventsContextType => {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { userId } = useAuth()

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedEvents = await getEvents()
      const processedEvents = fetchedEvents.map((event: Event) =>
        processOwnerData(event, userId)
      )
      setEvents(processedEvents)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('An unknown error occurred')
      )
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const createNewEvent = useCallback(async (eventData: CreateEventData) => {
    setIsLoading(true)
    setError(null)
    try {
      const newEvent = await createEvent(eventData)
      setEvents((prevEvents) => [
        ...prevEvents,
        processOwnerData(newEvent, userId),
      ])
      return newEvent
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('An unknown error occurred')
      )
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const joinEventById = useCallback(async (eventId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedEvent = await joinEvent(eventId)
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...updatedEvent, status: 'LEAVE' } : event
        )
      )
      return updatedEvent
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('An unknown error occurred')
      )
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const leaveEventById = useCallback(async (eventId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedEvent = await leaveEvent(eventId)
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...updatedEvent, status: 'JOIN' } : event
        )
      )
      return updatedEvent
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('An unknown error occurred')
      )
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createNewEvent,
    joinEventById,
    leaveEventById,
  }
}
