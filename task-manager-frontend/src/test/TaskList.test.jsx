import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// All mocks at top level — required by Vitest
vi.mock('../hooks/useTasks', () => ({
  useTasks: vi.fn(),
  useUpdateTask: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useDeleteTask: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useCreateTask: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}))

vi.mock('../store/useTaskStore', () => ({
  default: vi.fn(),
}))

import { useTasks } from '../hooks/useTasks'
import useTaskStore from '../store/useTaskStore'
import TaskList from '../components/tasks/TaskList/TaskList'

const defaultStore = {
  isCreating: false,
  editingTaskId: null,
  startEditing: vi.fn(),
  stopCreating: vi.fn(),
  stopEditing: vi.fn(),
  filters: { status: null, title: '', sortBy: 'createdAt', priority: null },
}

const renderWithQuery = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  useTaskStore.mockReturnValue(defaultStore)
})

describe('TaskList', () => {
  it('should show error message when request fails', () => {
    useTasks.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    renderWithQuery(<TaskList />)
    expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument()
  })

  it('should show empty state when there are no tasks and no active filters', () => {
    useTasks.mockReturnValue({ data: [], isLoading: false, isError: false })
    renderWithQuery(<TaskList />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('should show filtered empty state when a filter is active', () => {
    useTaskStore.mockReturnValue({
      ...defaultStore,
      filters: { status: 'PENDING', title: '', sortBy: 'createdAt', priority: null },
    })
    useTasks.mockReturnValue({ data: [], isLoading: false, isError: false })
    renderWithQuery(<TaskList />)
    expect(screen.getByText(/no tasks match your filters/i)).toBeInTheDocument()
  })

  it('should render task titles when tasks exist', () => {
    useTasks.mockReturnValue({
      data: [
        {
          id: 1,
          title: 'Write tests',
          description: 'Cover critical components',
          priority: 'HIGH',
          status: 'PENDING',
          createdAt: '2026-03-18T10:00:00',
          dueDate: null,
        },
      ],
      isLoading: false,
      isError: false,
    })
    renderWithQuery(<TaskList />)
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })

  it('should show task count in the header', () => {
    useTasks.mockReturnValue({
      data: [
        { id: 1, title: 'Task 1', description: 'Desc', priority: 'LOW',  status: 'PENDING',   createdAt: '2026-03-18T10:00:00', dueDate: null },
        { id: 2, title: 'Task 2', description: 'Desc', priority: 'HIGH', status: 'COMPLETED', createdAt: '2026-03-18T10:00:00', dueDate: null },
      ],
      isLoading: false,
      isError: false,
    })
    renderWithQuery(<TaskList />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should show loading skeletons while fetching', () => {
    useTasks.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    renderWithQuery(<TaskList />)
    // While loading no tasks or empty state should be visible
    expect(screen.queryByText(/no tasks/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/failed/i)).not.toBeInTheDocument()
  })
})