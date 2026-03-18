import { describe, it, expect, beforeEach } from 'vitest'
import { act } from 'react'
import useTaskStore from '../store/useTaskStore'

// Reset store state before each test
beforeEach(() => {
  act(() => {
    useTaskStore.setState({
      filters: { status: null, title: '', sortBy: 'createdAt', priority: null },
      isCreating: false,
      editingTaskId: null,
      sidebarOpen: false,
    })
  })
})

describe('useTaskStore — filters', () => {
  it('should set a filter value', () => {
    act(() => useTaskStore.getState().setFilter('status', 'PENDING'))
    expect(useTaskStore.getState().filters.status).toBe('PENDING')
  })

  it('should set priority filter', () => {
    act(() => useTaskStore.getState().setFilter('priority', 'HIGH'))
    expect(useTaskStore.getState().filters.priority).toBe('HIGH')
  })

  it('should clear all filters', () => {
    act(() => {
      useTaskStore.getState().setFilter('status', 'COMPLETED')
      useTaskStore.getState().setFilter('priority', 'HIGH')
    })
    act(() => useTaskStore.getState().clearFilters())

    const { filters } = useTaskStore.getState()
    expect(filters.status).toBeNull()
    expect(filters.priority).toBeNull()
    expect(filters.title).toBe('')
    expect(filters.sortBy).toBe('createdAt')
  })

  it('should update sortBy filter', () => {
    act(() => useTaskStore.getState().setFilter('sortBy', 'priority'))
    expect(useTaskStore.getState().filters.sortBy).toBe('priority')
  })
})

describe('useTaskStore — creating', () => {
  it('should set isCreating to true when startCreating is called', () => {
    act(() => useTaskStore.getState().startCreating())
    expect(useTaskStore.getState().isCreating).toBe(true)
  })

  it('should set isCreating to false when stopCreating is called', () => {
    act(() => {
      useTaskStore.getState().startCreating()
      useTaskStore.getState().stopCreating()
    })
    expect(useTaskStore.getState().isCreating).toBe(false)
  })

  it('should clear editingTaskId when startCreating is called', () => {
    act(() => {
      useTaskStore.getState().startEditing(5)
      useTaskStore.getState().startCreating()
    })
    expect(useTaskStore.getState().editingTaskId).toBeNull()
  })
})

describe('useTaskStore — editing', () => {
  it('should set editingTaskId when startEditing is called', () => {
    act(() => useTaskStore.getState().startEditing(42))
    expect(useTaskStore.getState().editingTaskId).toBe(42)
  })

  it('should clear editingTaskId when stopEditing is called', () => {
    act(() => {
      useTaskStore.getState().startEditing(42)
      useTaskStore.getState().stopEditing()
    })
    expect(useTaskStore.getState().editingTaskId).toBeNull()
  })

  it('should stop creating when startEditing is called', () => {
    act(() => {
      useTaskStore.getState().startCreating()
      useTaskStore.getState().startEditing(1)
    })
    expect(useTaskStore.getState().isCreating).toBe(false)
  })
})

describe('useTaskStore — sidebar', () => {
  it('should toggle sidebarOpen', () => {
    act(() => useTaskStore.getState().toggleSidebar())
    expect(useTaskStore.getState().sidebarOpen).toBe(true)

    act(() => useTaskStore.getState().toggleSidebar())
    expect(useTaskStore.getState().sidebarOpen).toBe(false)
  })

  it('should close sidebar', () => {
    act(() => {
      useTaskStore.getState().toggleSidebar()
      useTaskStore.getState().closeSidebar()
    })
    expect(useTaskStore.getState().sidebarOpen).toBe(false)
  })
})