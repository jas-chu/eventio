import React, { useState } from 'react'
import {
  Button,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import Modal from 'react-native-modal'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { useCreateEventModal } from '../context/CreateEventModalContext'
import { useEventsContext } from '../context/EventsContext'

export default function CreateEventModal() {
  const { isVisible, onCloseModal } = useCreateEventModal()
  const { createNewEvent, isLoading, error } = useEventsContext()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [capacity, setCapacity] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || date
    setShowDatePicker(Platform.OS === 'ios')
    setDate(currentDate)
  }

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date
  ) => {
    const currentTime = selectedTime || time
    setShowTimePicker(Platform.OS === 'ios')
    setTime(currentTime)
  }

  const handleCreate = async () => {
    const mergedDateTime = new Date(date)
    mergedDateTime.setHours(time.getHours())
    mergedDateTime.setMinutes(time.getMinutes())

    try {
      await createNewEvent({
        title,
        description,
        startsAt: mergedDateTime.toISOString(),
        capacity: parseInt(capacity, 10),
      })
      resetForm()
      onCloseModal()
    } catch (err) {
      console.error('Failed to create event:', err)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDate(new Date())
    setTime(new Date())
    setCapacity('')
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCloseModal}
      onSwipeComplete={onCloseModal}
      swipeDirection={['down']}
      style={styles.modal}
      propagateSwipe
      avoidKeyboard
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Create new event</Text>
              <TouchableOpacity
                onPress={onCloseModal}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#A1A1A1"
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#A1A1A1"
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <Pressable onPress={() => setShowDatePicker(true)}>
                <TextInput
                  pointerEvents="none"
                  style={styles.input}
                  placeholder="Date"
                  placeholderTextColor="#A1A1A1"
                  value={format(date, 'MMM d, yyyy')}
                  editable={false}
                />
              </Pressable>

              <Pressable onPress={() => setShowTimePicker(true)}>
                <TextInput
                  pointerEvents="none"
                  style={styles.input}
                  placeholder="Time"
                  placeholderTextColor="#A1A1A1"
                  value={format(time, 'h:mm a')}
                  editable={false}
                />
              </Pressable>

              <TextInput
                style={styles.input}
                placeholder="Capacity"
                placeholderTextColor="#A1A1A1"
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="number-pad"
              />

              {error && <Text style={styles.errorText}>{error.message}</Text>}

              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>CREATE</Text>
                )}
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
            {showDatePicker && Platform.OS === 'ios' && (
              <Button title="Done" onPress={() => setShowDatePicker(false)} />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
            )}
            {showTimePicker && Platform.OS === 'ios' && (
              <Button title="Done" onPress={() => setShowTimePicker(false)} />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    padding: 4,
    position: 'absolute',
    right: 0,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 24,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: '#40C057',
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    gap: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  innerContainer: {
    padding: 16,
  },
  input: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    color: '#000000',
    fontSize: 16,
    paddingVertical: 12,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  title: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
})
