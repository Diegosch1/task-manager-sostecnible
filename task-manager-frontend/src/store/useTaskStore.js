import { create } from 'zustand'

const useTaskStore = create((set) => ({
  // Filters
  filters: {
    status: null,
    title: '',
    sortBy: 'createdAt',
    priority: null,
  },

  // Inline editing
  editingTaskId: null,      // id of task being edited, null if none
  isCreating: false,         // whether the new task row is open

  // Actions
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  clearFilters: () =>
    set({
      filters: { status: null, title: '', sortBy: 'createdAt', priority: null },
    }),

  startCreating: () =>
    set({ isCreating: true, editingTaskId: null }),

  stopCreating: () =>
    set({ isCreating: false }),

  startEditing: (id) =>
    set({ editingTaskId: id, isCreating: false }),

  stopEditing: () =>
    set({ editingTaskId: null }),

  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
}))

export default useTaskStore