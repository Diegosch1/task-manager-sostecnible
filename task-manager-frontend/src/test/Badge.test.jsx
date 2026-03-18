import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '../components/common/Badge/Badge'

describe('Badge', () => {
  it('should render HIGH priority badge with correct label', () => {
    render(<Badge value="HIGH" />)
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('should render MEDIUM priority badge with correct label', () => {
    render(<Badge value="MEDIUM" />)
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('should render LOW priority badge with correct label', () => {
    render(<Badge value="LOW" />)
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('should render PENDING status badge', () => {
    render(<Badge value="PENDING" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('should render COMPLETED status badge', () => {
    render(<Badge value="COMPLETED" />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('should render unknown value as-is', () => {
    render(<Badge value="UNKNOWN" />)
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
  })
})