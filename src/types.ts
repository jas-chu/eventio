interface Attendee {
  id: string
}

export interface Event {
  id: string
  title: string
  description: string
  startsAt: string
  capacity: number
  owner: {
    id: string
    firstName: string
    lastName: string
  }
  attendees: Attendee[]
  status?: 'EDIT' | 'JOIN' | 'LEAVE'
}

export interface CreateEventData {
  title: string
  description: string
  startsAt: string
  capacity: number
}

export interface EventsContextType {
  events: Event[]
  isLoading: boolean
  error: Error | null
  fetchEvents: () => Promise<void>
  createNewEvent: (eventData: CreateEventData) => Promise<Event>
  joinEventById: (eventId: string) => Promise<Event>
  leaveEventById: (eventId: string) => Promise<Event>
}
