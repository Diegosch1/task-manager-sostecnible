const variants = {
  HIGH:      { color: 'var(--priority-high)',      bg: 'var(--priority-high-bg)',      label: 'High' },
  MEDIUM:    { color: 'var(--priority-medium)',    bg: 'var(--priority-medium-bg)',    label: 'Medium' },
  LOW:       { color: 'var(--priority-low)',       bg: 'var(--priority-low-bg)',       label: 'Low' },
  PENDING:   { color: 'var(--status-pending)',     bg: 'var(--status-pending-bg)',     label: 'Pending' },
  COMPLETED: { color: 'var(--status-completed)',   bg: 'var(--status-completed-bg)',   label: 'Completed' },
}

const Badge = ({ value }) => {
  const variant = variants[value] ?? { color: 'var(--text-secondary)', bg: 'var(--bg-hover)', label: value }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '99px',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.02em',
      color: variant.color,
      background: variant.bg,
      whiteSpace: 'nowrap',
    }}>
      {variant.label}
    </span>
  )
}

export default Badge