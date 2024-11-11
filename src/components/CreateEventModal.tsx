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
import { COLORS } from '../utils/colors'
import { STRINGS } from '../utils/strings'

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
              <Text style={styles.title}>{STRINGS.CREATE_NEW_EVENT}</Text>
              <TouchableOpacity
                onPress={onCloseModal}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>
                  {STRINGS.CLOSE_BUTTON}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder={STRINGS.TITLE_PLACEHOLDER}
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                style={styles.input}
                placeholder={STRINGS.DESCRIPTION_PLACEHOLDER}
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <Pressable onPress={() => setShowDatePicker(true)}>
                <TextInput
                  pointerEvents="none"
                  style={styles.input}
                  placeholder={STRINGS.DATE_PLACEHOLDER}
                  placeholderTextColor={COLORS.TEXT_TERTIARY}
                  value={format(date, 'MMM d, yyyy')}
                  editable={false}
                />
              </Pressable>

              <Pressable onPress={() => setShowTimePicker(true)}>
                <TextInput
                  pointerEvents="none"
                  style={styles.input}
                  placeholder={STRINGS.TIME_PLACEHOLDER}
                  placeholderTextColor={COLORS.TEXT_TERTIARY}
                  value={format(time, 'h:mm a')}
                  editable={false}
                />
              </Pressable>

              <TextInput
                style={styles.input}
                placeholder={STRINGS.CAPACITY_PLACEHOLDER}
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="number-pad"
              />

              {error && <Text>{error.message || STRINGS.ERROR.DEFAULT}</Text>}

              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.WHITE} />
                ) : (
                  <Text style={styles.createButtonText}>
                    {STRINGS.CREATE_BUTTON_TEXT}
                  </Text>
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
              <Button
                title={STRINGS.DONE_BUTTON_TEXT}
                onPress={() => setShowDatePicker(false)}
              />
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
              <Button
                title={STRINGS.DONE_BUTTON_TEXT}
                onPress={() => setShowTimePicker(false)}
              />
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
    color: COLORS.PRIMARY_BLACK,
    fontSize: 24,
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: COLORS.GREEN,
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
  },
  createButtonText: {
    color: COLORS.WHITE,
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
    borderBottomColor: COLORS.TEXT_TERTIARY,
    borderBottomWidth: 1,
    color: COLORS.PRIMARY_BLACK,
    fontSize: 16,
    paddingVertical: 12,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  title: {
    color: COLORS.PRIMARY_BLACK,
    fontSize: 18,
    fontWeight: '600',
  },
})
