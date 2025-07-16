import { create } from 'zustand'

export const usePollStore = create((set) => ({
  selectedPoll: null,
  setSelectedPoll: (poll) => set({ selectedPoll: poll }),
}))
