import { Search, Plus, Menu } from 'lucide-react'
import { useEffect, useRef } from 'react'
import useTaskStore from '../../../store/useTaskStore'
import styles from './Header.module.css'

const Header = () => {
  const {
    filters, setFilter, startCreating,
    isCreating, editingTaskId,
    toggleSidebar
  } = useTaskStore()

  const isLocked = isCreating || editingTaskId !== null
  const searchRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (!isLocked) searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLocked])

  return (
    <header className={styles.header}>
      {/* Hamburger — only visible on mobile */}
      <button className={styles.menuBtn} onClick={toggleSidebar} title="Toggle menu">
        <Menu size={16} />
      </button>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search size={14} color="var(--text-placeholder)" className={styles.searchIcon} />
        <input
          ref={searchRef}
          type="text"
          placeholder={isLocked ? 'Finish editing to search...' : 'Search tasks... (Ctrl+K)'}
          value={filters.title}
          onChange={(e) => !isLocked && setFilter('title', e.target.value)}
          className={`${styles.searchInput} ${isLocked ? styles.searchLocked : ''}`}
          disabled={isLocked}
        />
      </div>

      <div className={styles.rightGroup}>
        <button
          className={styles.newBtn}
          onClick={startCreating}
          disabled={isLocked}
        >
          <Plus size={14} />
          <span className={styles.newBtnText}>New task</span>
        </button>
      </div>
    </header>
  )
}

export default Header