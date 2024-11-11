import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { format } from 'date-fns'
import { Event } from '../types'
import { useEventsContext } from '../context/EventsContext'
import { useView } from '../context/ViewContext'

type FilterType = 'ALL' | 'FUTURE' | 'PAST'

const { width } = Dimensions.get('window')

const FilterButtons: React.FC<{
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}> = ({ activeFilter, onFilterChange }) => (
  <View style={styles.filterContainer}>
    {(['ALL', 'FUTURE', 'PAST'] as FilterType[]).map((filter) => (
      <TouchableOpacity
        key={filter}
        style={[
          styles.filterButton,
          activeFilter === filter && styles.filterButtonActive,
          { width: width / 3 - 16 },
        ]}
        onPress={() => onFilterChange(filter)}
      >
        <Text
          style={[
            styles.filterButtonText,
            activeFilter === filter && styles.filterButtonTextActive,
          ]}
        >
          {filter}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const { joinEventById, leaveEventById } = useEventsContext()
  const { isDefaultView } = useView()

  const handleActionButton = () => {
    if (event.status == 'JOIN') {
      joinEventById(event.id)
    }
    if (event.status === 'LEAVE') {
      leaveEventById(event.id)
    }
  }

  const getStatusButtonStyle = (status?: string) => {
    switch (status) {
      case 'JOIN':
        return styles.joinButton
      case 'LEAVE':
        return styles.leaveButton
      default:
        return styles.editButton
    }
  }

  return (
    <View style={styles.eventCard}>
      <Text style={styles.eventDate}>
        {format(new Date(event.startsAt), 'MMMM d, yyyy – h:mm a')}
      </Text>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text
        style={styles.ownerName}
      >{`${event.owner.firstName} ${event.owner.lastName}`}</Text>
      {event.description && isDefaultView && (
        <Text style={styles.description}>{event.description}</Text>
      )}
      <View style={styles.eventFooter}>
        {isDefaultView && (
          <View style={styles.attendeesContainer}>
            <View style={styles.participantIcon} />
            <Text style={styles.attendees}>
              {event.attendees.length} of {event.capacity}
            </Text>
          </View>
        )}
        {new Date(event.startsAt) > new Date() && (
          <TouchableOpacity
            style={[styles.actionButton, getStatusButtonStyle(event.status)]}
            onPress={handleActionButton}
          >
            <Text
              style={[
                styles.actionButtonText,
                event.status === 'EDIT' && styles.editButtonText,
              ]}
            >
              {event.status}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export const HomeScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL')
  const { events, isLoading, error, fetchEvents } = useEventsContext()

  React.useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const filteredEvents = useMemo(() => {
    const now = new Date()
    switch (activeFilter) {
      case 'FUTURE':
        return events.filter((event) => new Date(event.startsAt) > now)
      case 'PAST':
        return events.filter((event) => new Date(event.startsAt) <= now)
      default:
        return events
    }
  }, [events, activeFilter])

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }
  if (error) {
    return <Text>Error: {error.message}</Text>
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <ScrollView style={styles.scrollView}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  attendees: {
    color: '#8A8A8A',
    fontSize: 12,
  },
  attendeesContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    backgroundColor: '#F9F9FB',
    flex: 1,
  },
  description: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#F1F3F5',
  },
  editButtonText: {
    color: '#000000',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  eventDate: {
    color: '#8A8A8A',
    fontSize: 12,
    marginBottom: 4,
  },
  eventFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  filterButtonActive: {
    backgroundColor: '#2C3333',
  },
  filterButtonText: {
    color: '#8A8A8A',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 16,
  },
  joinButton: {
    backgroundColor: '#40C057',
  },
  leaveButton: {
    backgroundColor: '#FA5252',
  },
  ownerName: {
    color: '#4A4A4A',
    fontSize: 14,
    marginBottom: 8,
  },
  participantIcon: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    height: 16,
    marginRight: 4,
    width: 16,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
})
