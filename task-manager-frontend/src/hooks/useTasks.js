import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '../api/taskApi'
import useTaskStore from '../store/useTaskStore'

// Query key factory — centraliza las keys para evitar typos
export const taskKeys = {
  all: ['tasks'],
  filtered: (filters) => ['tasks', filters],
  detail: (id) => ['tasks', id],
}

// Fetch all tasks with current filters
export const useTasks = () => {
  const filters = useTaskStore((state) => state.filters)

  // Build params — remove null/empty values before sending to API
  const params = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== null && v !== '')
  )

  return useQuery({
    queryKey: taskKeys.filtered(filters),
    queryFn: () => taskApi.getAll(params),
  })
}

// Fetch single task by id
export const useTask = (id) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskApi.getById(id),
    enabled: !!id, // Only fetch if id exists
  })
}

// Create task
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task) => taskApi.create(task),
    onSuccess: () => {
      // Invalidate and refetch the task list
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

// Update task
export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, task }) => taskApi.update(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

// Delete task
export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}