const styles = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
  },
  danger: {
    background: 'var(--danger-light)',
    color: 'var(--danger)',
    border: 'none',
  },
}

const Button = ({ children, variant = 'secondary', onClick, disabled, type = 'button', style = {} }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        fontSize: '13px',
        fontWeight: 500,
        transition: 'opacity 0.15s, background 0.15s',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...styles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.opacity = '0.85'
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.opacity = '1'
      }}
    >
      {children}
    </button>
  )
}

export default Button