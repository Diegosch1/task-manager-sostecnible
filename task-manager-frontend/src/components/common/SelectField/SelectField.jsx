import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './SelectField.module.css'

const SelectField = ({ value, onChange, options, tabIndex }) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  const selected = options.find((o) => o.value === value)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation inside dropdown
  const handleTriggerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((prev) => !prev)
    }
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setOpen(false)
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        tabIndex={tabIndex}
        type="button"
      >
        {selected?.icon && selected.icon}
        {selected?.label}
        <ChevronDown size={11} className={`${styles.chevron} ${open ? styles.open : ''}`} />
      </button>

      {open && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
              type="button"
            >
              {option.icon && option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectField