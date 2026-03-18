import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TaskList from '../components/tasks/TaskList/TaskList'

// All mocks must be at the top level
vi.mock('../hooks/useTasks', () => ({
  useTasks: vi.fn(),
  useUpdateTask: vi.fn(() => ({ mutate: vi.fn() })),
  useDeleteTask: vi.fn(() => ({ mutate: vi.fn() })),
}))

vi.mock('../store/useTaskStore', () => ({
  default: vi.fn(() => ({
    isCreating: false,
    editingTaskId: null,
    startEditing: vi.fn(),
    filters: { status: null, title: '', sortBy: 'createdAt', priority: null },
  }))
}))

import { useTasks } from '../hooks/useTasks'

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
})

const mockStore = async (overrides = {}) => {
  const { default: useTaskStore } = vi.mocked(
    await import('../store/useTaskStore')
  )
  useTaskStore.mockReturnValue({
    isCreating: false,
    editingTaskId: null,
    startEditing: vi.fn(),
    filters: { status: null, title: '', sortBy: 'createdAt', priority: null },
    ...overrides,
  })
}

describe('TaskList', () => {
  it('should show skeleton loaders while loading', () => {
    useTasks.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    const { container } = renderWithQuery(<TaskList />)
    // CSS Modules hashes class names — check by role or count children
    const children = container.firstChild.children
    expect(children.length).toBeGreaterThan(0)
  })

  it('should show error message when request fails', () => {
    useTasks.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    renderWithQuery(<TaskList />)
    expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument()
  })

  it('should show empty state when there are no tasks and no filters', () => {
    useTasks.mockReturnValue({ data: [], isLoading: false, isError: false })
    renderWithQuery(<TaskList />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('should show filtered empty state when filters are active', async () => {
    const { default: useTaskStore } = vi.mocked(
      { default: vi.fn() }
    )
    // Override store for this test via the mock
    const store = await import('../store/useTaskStore')
    store.default.mockReturnValue({
      isCreating: false,
      editingTaskId: null,
      startEditing: vi.fn(),
      filters: { status: 'PENDING', title: '', sortBy: 'createdAt', priority: null },
    })

    useTasks.mockReturnValue({ data: [], isLoading: false, isError: false })
    renderWithQuery(<TaskList />)
    expect(screen.getByText(/no tasks match your filters/i)).toBeInTheDocument()
  })

  it('should show task titles when tasks exist', () => {
    useTasks.mockReturnValue({
      data: [
        { id: 1, title: 'Write tests', description: 'Cover critical components', priority: 'HIGH', status: 'PENDING', createdAt: '2026-03-18T10:00:00', dueDate: null }
      ],
      isLoading: false,
      isError: false,
    })
    renderWithQuery(<TaskList />)
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })

  it('should show task count in header', () => {
    useTasks.mockReturnValue({
      data: [
        { id: 1, title: 'Task 1', description: 'Desc', priority: 'LOW', status: 'PENDING', createdAt: '2026-03-18T10:00:00', dueDate: null },
        { id: 2, title: 'Task 2', description: 'Desc', priority: 'HIGH', status: 'COMPLETED', createdAt: '2026-03-18T10:00:00', dueDate: null },
      ],
      isLoading: false,
      isError: false,
    })
    renderWithQuery(<TaskList />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})