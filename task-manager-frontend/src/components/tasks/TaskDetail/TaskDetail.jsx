import { useEffect } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { useTask } from '../../../hooks/useTasks'
import useTaskStore from '../../../store/useTaskStore'
import Badge from '../common/Badge'
import Button from '../../common/Button/Button'
import styles from './TaskDetail.module.css'

const TaskDetail = ({ taskId, onClose }) => {
  const { data: task, isLoading } = useTask(taskId)
  const { openModal, setSelectedTaskId } = useTaskStore()

  // Escape closes detail
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleEdit = () => {
    setSelectedTaskId(taskId)
    openModal('edit')
  }

  if (isLoading || !task) return null

  const isCompleted = task.status === 'COMPLETED'

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={`${styles.title} ${isCompleted ? styles.completed : ''}`}>
            {task.title}
          </h2>
          <button className={styles['close-btn']} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}

          <div className={styles['meta-grid']}>
            <div className={styles['meta-item']}>
              <span className={styles['meta-label']}>Priority</span>
              <Badge value={task.priority} />
            </div>
            <div className={styles['meta-item']}>
              <span className={styles['meta-label']}>Status</span>
              <Badge value={task.status} />
            </div>
            <div className={styles['meta-item']}>
              <span className={styles['meta-label']}>Created</span>
              <span className={styles['meta-value']}>
                {format(new Date(task.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            {task.dueDate && (
              <div className={styles['meta-item']}>
                <span className={styles['meta-label']}>Due date</span>
                <span className={styles['meta-value']}>
                  {format(new Date(task.dueDate), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={handleEdit}>Edit task</Button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail