import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'

describe('App Component', () => {
  it('renders login page when not logged in', () => {
    render(<App />)
    
    expect(screen.getByText('AI Performance Code Reviewer')).toBeInTheDocument()
    expect(screen.getByText(/Connect your GitHub organization/)).toBeInTheDocument()
    expect(screen.getByTestId('login-button')).toBeInTheDocument()
  })

  it('allows user to login', () => {
    render(<App />)
    
    const loginButton = screen.getByTestId('login-button')
    fireEvent.click(loginButton)
    
    // After login, should see dashboard
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
    expect(screen.getByTestId('logout-button')).toBeInTheDocument()
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
  })

  it('allows user to logout', () => {
    render(<App />)
    
    // Login first
    const loginButton = screen.getByTestId('login-button')
    fireEvent.click(loginButton)
    
    // Then logout
    const logoutButton = screen.getByTestId('logout-button')
    fireEvent.click(logoutButton)
    
    // Should be back to login page
    expect(screen.getByText(/Connect your GitHub organization/)).toBeInTheDocument()
    expect(screen.getByTestId('login-button')).toBeInTheDocument()
  })

  it('shows user name in header when logged in', () => {
    render(<App />)
    
    // Login
    fireEvent.click(screen.getByTestId('login-button'))
    
    // Check user name is displayed
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
  })

  it('displays the correct title', () => {
    render(<App />)
    
    expect(screen.getByText('AI Performance Code Reviewer')).toBeInTheDocument()
  })
})