import { CheckSquare } from 'lucide-react'
import { useTasks } from '../../../hooks/useTasks'
import useTaskStore from '../../../store/useTaskStore'
import TaskCard from '../TaskCard/TaskCard'
import TaskRow from '../TaskRow/TaskRow'
import styles from './TaskList.module.css'

const TaskList = () => {
  const { data: tasks, isLoading, isError } = useTasks()
  const { isCreating, editingTaskId, filters } = useTaskStore()  

  const hasActiveFilters = filters.status !== null || filters.priority !== null || filters.title !== ''

  if (isLoading) {
    return (
      <div className={styles.container}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className={styles.error}>
        Failed to load tasks. Make sure the backend is running on port 8080.
      </p>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Tasks</span>
        <span className={styles.count}>{tasks?.length ?? 0}</span>
      </div>

      {/* New task row appears at the top */}
      {isCreating && <TaskRow />}

      {tasks?.length === 0 && !isCreating ? (
        <div className={styles.empty}>
          <CheckSquare size={28} color="var(--border-focus)" />
          {hasActiveFilters ? (
            <>
              <p className={styles.emptyTitle}>No tasks match your filters</p>
              <p className={styles.emptySubtitle}>Try adjusting or clearing your filters</p>
            </>
          ) : (
            <>
              <p className={styles.emptyTitle}>No tasks yet</p>
              <p className={styles.emptySubtitle}>Click "New task" or press Ctrl+K to start</p>
            </>
          )}
        </div>
      ) : (
        tasks.map((task) =>
          editingTaskId === task.id ? (
            <TaskRow key={task.id} task={task} />
          ) : (
            <TaskCard key={task.id} task={task} />
          )
        )
      )}
    </div>
  )
}

export default TaskList