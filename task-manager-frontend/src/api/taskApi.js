import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const taskApi = {
  getAll: (params) =>
    api.get('/tasks', { params }).then((res) => res.data),

  getById: (id) =>
    api.get(`/tasks/${id}`).then((res) => res.data),

  create: (task) =>
    api.post('/tasks', task).then((res) => res.data),

  update: (id, task) =>
    api.put(`/tasks/${id}`, task).then((res) => res.data),

  delete: (id) =>
    api.delete(`/tasks/${id}`).then((res) => res.data),
}