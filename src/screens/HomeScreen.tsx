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
import { COLORS } from '../utils/colors'
import { Ionicons } from '@expo/vector-icons'

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
            <View style={styles.participantIcon}>
              <Ionicons
                name={'person'}
                size={24}
                color={COLORS.TEXT_SECONDARY}
              />
            </View>
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
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '500',
  },
  attendees: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  attendeesContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    flex: 1,
  },
  description: {
    color: COLORS.PRIMARY_BLACK,
    fontSize: 16,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: COLORS.DISABLED,
  },
  editButtonText: {
    color: COLORS.PRIMARY_BLACK,
  },
  eventCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: COLORS.PRIMARY_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  eventDate: {
    color: COLORS.TEXT_TERTIARY,
    fontSize: 12,
    marginBottom: 4,
  },
  eventFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventTitle: {
    color: COLORS.PRIMARY_BLACK,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  filterButtonActive: {
    backgroundColor: COLORS.BLACK,
  },
  filterButtonText: {
    color: COLORS.TEXT_TERTIARY,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.WHITE,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  joinButton: {
    backgroundColor: COLORS.GREEN,
  },
  leaveButton: {
    backgroundColor: COLORS.RED,
  },
  ownerName: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 8,
  },
  participantIcon: {
    marginRight: 4,
  },
  safeArea: {
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
})
