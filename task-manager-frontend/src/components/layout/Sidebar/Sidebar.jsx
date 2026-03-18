import { CheckSquare, Circle, AlertCircle, Minus, AlignLeft } from 'lucide-react'
import useTaskStore from '../../../store/useTaskStore'
import styles from './Sidebar.module.css'

const Sidebar = () => {
  const {
    filters, setFilter, clearFilters,
    isCreating, editingTaskId,
    sidebarOpen, closeSidebar
  } = useTaskStore()

  const isLocked = isCreating || editingTaskId !== null

  const isActive = (key, value) => filters[key] === value

  const FilterBtn = ({ filterKey, value, label, icon, disabled }) => (
    <button
      className={`${styles['filter-btn']} ${isActive(filterKey, value) ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
      onClick={() => {
        if (disabled) return
        setFilter(filterKey, isActive(filterKey, value) ? null : value)
        closeSidebar() // close drawer on mobile after selecting filter
      }}
      disabled={disabled}
    >
      {icon}
      {label}
    </button>
  )

  const hasActiveFilters = filters.status !== null || filters.priority !== null

  return (
    <>
      {/* Overlay — closes sidebar on mobile when clicking outside */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <CheckSquare size={16} color="var(--accent)" />
          Task Manager
        </div>

        <div>
          <p className={styles['section-title']}>Status</p>
          <FilterBtn filterKey="status" value="PENDING"   label="Pending"   icon={<Circle size={13} />}      disabled={isLocked} />
          <FilterBtn filterKey="status" value="COMPLETED" label="Completed" icon={<CheckSquare size={13} />} disabled={isLocked} />
        </div>

        <div>
          <p className={styles['section-title']}>Priority</p>
          <FilterBtn filterKey="priority" value="HIGH"   label="High"   icon={<AlertCircle size={13} color="var(--priority-high)" />}  disabled={isLocked} />
          <FilterBtn filterKey="priority" value="MEDIUM" label="Medium" icon={<Minus size={13} color="var(--priority-medium)" />}       disabled={isLocked} />
          <FilterBtn filterKey="priority" value="LOW"    label="Low"    icon={<AlignLeft size={13} color="var(--priority-low)" />}      disabled={isLocked} />
        </div>

        <div>
          <p className={styles['section-title']}>Sort by</p>
          <FilterBtn filterKey="sortBy" value="createdAt" label="Date created" icon={<Circle size={13} />}      disabled={isLocked} />
          <FilterBtn filterKey="sortBy" value="priority"  label="Priority"     icon={<AlertCircle size={13} />} disabled={isLocked} />
        </div>

        {isLocked && (
          <p className={styles['locked-hint']}>
            Finish editing to use filters
          </p>
        )}

        {hasActiveFilters && (
          <button
            className={styles['clear-btn']}
            onClick={() => { clearFilters(); closeSidebar() }}
            disabled={isLocked}
          >
            Clear filters
          </button>
        )}
      </aside>
    </>
  )
}

export default Sidebar