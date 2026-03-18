import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Minus, AlignLeft } from 'lucide-react'
import { useCreateTask, useUpdateTask } from '../../../hooks/useTasks'
import useTaskStore from '../../../store/useTaskStore'
import SelectField from '../../common/SelectField/SelectField'
import styles from './TaskRow.module.css'


const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  status: 'PENDING',
  dueDate: '',
}

const TaskRow = ({ task = null, onDone }) => {
  const isEdit = task !== null
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const { stopCreating, stopEditing } = useTaskStore()

  const [form, setForm] = useState(() =>
    isEdit ? {
      title: task.title ?? '',
      description: task.description ?? '',
      priority: task.priority ?? 'MEDIUM',
      status: task.status ?? 'PENDING',
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : '',
    } : EMPTY_FORM
  )
  const [error, setError] = useState('')
  const isLoading = createTask.isPending || updateTask.isPending

  // Refs for all focusable elements — order matters, it defines Tab order
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const priorityRef = useRef(null)
  const statusRef = useRef(null)
  const dateRef = useRef(null)
  const cancelRef = useRef(null)
  const saveRef = useRef(null)

  // Ordered list of focusable refs for focus trap
  const getFocusable = () => [
    titleRef,
    descRef,
    priorityRef,
    ...(isEdit ? [statusRef] : []),
    dateRef,
    cancelRef,
    saveRef,
  ].map((r) => r.current).filter(Boolean)

  // Focus title on mount
  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 30)
  }, [])

  // Global keydown: Escape cancels
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError('')
  }

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    status: form.status,
    dueDate: form.dueDate
      ? new Date(form.dueDate).toISOString().slice(0, 19)
      : null,
  })

  const handleSave = () => {
    if (!form.title.trim()) {
      setError('Title is required')
      titleRef.current?.focus()
      return
    }
    if (!form.description.trim()) {
      setError('Description is required')
      descRef.current?.focus()
      return
    }

    const payload = buildPayload()

    if (isEdit) {
      updateTask.mutate({ id: task.id, task: payload }, {
        onSuccess: () => { stopEditing(); onDone?.() }
      })
    } else {
      createTask.mutate(payload, {
        onSuccess: () => {
          setForm(EMPTY_FORM)
          setError('')
          // Use requestAnimationFrame instead of setTimeout —
          // waits for the DOM to settle after React Query invalidation
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              titleRef.current?.focus()
            })
          })
        }
      })
    }
  }

  const handleCancel = () => {
    if (isEdit) { stopEditing(); onDone?.() }
    else stopCreating()
  }

  // Focus trap: intercept Tab to keep focus inside TaskRow
  const handleRowKeyDown = (e) => {
    if (e.key !== 'Tab') return

    const focusable = getFocusable()
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (e.shiftKey) {
      // Shift+Tab: if on first element, wrap to last
      if (active === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      // Tab: if on last element, wrap to first
      if (active === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }

  // Enter on title → move to description (more natural than saving immediately)
  // Enter on description → save
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      descRef.current?.focus()
    }
  }

  const handleDescKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    // Shift+Enter = newline (default textarea behavior, no need to handle)
  }

  // Auto-resize textarea
  const handleDescChange = (e) => {
    set('description', e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const PRIORITY_OPTIONS = [
    { value: 'HIGH', label: 'High', icon: <AlertCircle size={13} color="var(--priority-high)" /> },
    { value: 'MEDIUM', label: 'Medium', icon: <Minus size={13} color="var(--priority-medium)" /> },
    { value: 'LOW', label: 'Low', icon: <AlignLeft size={13} color="var(--priority-low)" /> },
  ]

  const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' },
  ]

  return (
    <div className={styles.row} onKeyDown={handleRowKeyDown}>
      {/* Main row */}
      <div className={styles.mainRow}>
        <input
          ref={titleRef}
          className={styles.titleInput}
          type="text"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          onKeyDown={handleTitleKeyDown}
          tabIndex={1}
        />

        <div className={styles.divider} />

        <SelectField
          value={form.priority}
          onChange={(val) => set('priority', val)}
          options={PRIORITY_OPTIONS}
          tabIndex={3}
        />

        <div className={styles.divider} />

        {isEdit && (
          <>
            <SelectField
              value={form.status}
              onChange={(val) => set('status', val)}
              options={STATUS_OPTIONS}
              tabIndex={4}
            />
            <div className={styles.divider} />
          </>
        )}

        <div className={styles.divider} />

        <input
          ref={dateRef}
          className={styles.dateInput}
          type="datetime-local"
          value={form.dueDate}
          onChange={(e) => set('dueDate', e.target.value)}
          title="Due date"
          tabIndex={isEdit ? 5 : 4}
        />
      </div>

      {/* Description */}
      <div className={styles.descRow}>
        <textarea
          ref={descRef}
          className={styles.descInput}
          placeholder="Add a description... (required)"
          value={form.description}
          onChange={handleDescChange}
          onKeyDown={handleDescKeyDown}
          rows={1}
          tabIndex={2}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.hint}>
          <span className={styles.kbd}><kbd>Enter</kbd> {isEdit ? 'save' : 'save & new'}</span>
          <span className={styles.kbd}><kbd>Shift</kbd>+<kbd>Enter</kbd> new line</span>
          <span className={styles.kbd}><kbd>Tab</kbd> next field</span>
          <span className={styles.kbd}><kbd>Esc</kbd> cancel</span>
        </div>
        <div className={styles.actions}>
          <button
            ref={cancelRef}
            className={styles.cancelBtn}
            onClick={handleCancel}
            tabIndex={isEdit ? 6 : 5}
          >
            Cancel
          </button>
          <button
            ref={saveRef}
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={isLoading}
            tabIndex={isEdit ? 7 : 6}
          >
            {isLoading ? 'Saving...' : isEdit ? 'Save' : 'Add task'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskRow