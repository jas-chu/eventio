import React, { createContext, useState, ReactNode, useContext } from 'react'

interface CreateEventModalContextType {
  isVisible: boolean
  onCloseModal: () => void
  onOpenModal: () => void
}

const CreateEventModalContext = createContext<
  CreateEventModalContextType | undefined
>(undefined)

export const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setisVisible] = useState<boolean>(false)

  const onCloseModal = async () => {
    setisVisible(false)
  }

  const onOpenModal = async () => {
    setisVisible(true)
  }

  return (
    <CreateEventModalContext.Provider
      value={{ isVisible, onCloseModal, onOpenModal }}
    >
      {children}
    </CreateEventModalContext.Provider>
  )
}

export const useCreateEventModal = (): CreateEventModalContextType => {
  const context = useContext(CreateEventModalContext)
  if (!context) {
    throw new Error(
      'useCreateEventModal must be used within an ModalContextProvider'
    )
  }
  return context
}
