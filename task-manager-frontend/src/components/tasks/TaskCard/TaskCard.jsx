import { useState } from 'react'
import { Pencil, Trash2, Check } from 'lucide-react'
import { format } from 'date-fns'
import Badge from '../../common/Badge/Badge'
import useTaskStore from '../../../store/useTaskStore'
import { useUpdateTask, useDeleteTask } from '../../../hooks/useTasks'
import styles from './TaskCard.module.css'

const TaskCard = ({ task }) => {
  const { startEditing } = useTaskStore()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [confirmDelete, setConfirmDelete] = useState(false)

  const isCompleted = task.status === 'COMPLETED'

  const handleToggle = (e) => {
    e.stopPropagation()
    updateTask.mutate({
      id: task.id,
      task: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        status: isCompleted ? 'PENDING' : 'COMPLETED',
      },
    })
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    startEditing(task.id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    deleteTask.mutate(task.id)
  }

  return (
    <div className={`${styles.card} ${isCompleted ? styles.completed : ''}`}>
      <button
        className={`${styles.checkbox} ${isCompleted ? styles.checked : ''}`}
        onClick={handleToggle}
        title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
      >
        {isCompleted && <Check size={10} color="#fff" strokeWidth={3} />}
      </button>

      <div className={styles.content}>
        <p className={`${styles.title} ${isCompleted ? styles.completed : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
        <div className={styles.meta}>
          <Badge value={task.priority} />
          <Badge value={task.status} />
          {task.dueDate && (
            <span className={styles.dueDate}>
              {format(new Date(task.dueDate), 'MMM d, yyyy, hh:mm a')}
            </span>
          )}
          {task.createdAt && (
            <span className={styles.createdAt}>
              Created {format(new Date(task.createdAt), 'MMM d, yyyy, hh:mm a')}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleEdit} title="Edit">
          <Pencil size={14} />
        </button>

        {confirmDelete ? (
          <div className={styles.confirmDelete}>
            <span className={styles.confirmText}>Delete?</span>
            <button
              className={`${styles.actionBtn} ${styles.danger}`}
              onClick={handleDelete}
              title="Confirm delete"
            >
              Yes
            </button>
            <button
              className={styles.actionBtn}
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false) }}
              title="Cancel"
            >
              No
            </button>
          </div>
        ) : (
          <button
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export default TaskCard