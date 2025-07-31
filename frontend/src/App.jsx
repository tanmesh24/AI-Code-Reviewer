import React, { useState } from 'react'
import Dashboard from './Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = () => {
    // Simulate login
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    })
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="card">
          <h1>AI Performance Code Reviewer</h1>
          <p>Connect your GitHub organization to get started with AI-powered performance code reviews</p>
          <button 
            className="btn" 
            onClick={handleLogin}
            data-testid="login-button"
          >
            Connect with GitHub
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        background: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1>AI Performance Reviewer</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Welcome, {user.name}</span>
          <button 
            className="btn btn-danger" 
            onClick={handleLogout}
            data-testid="logout-button"
          >
            Logout
          </button>
        </div>
      </header>
      
      <Dashboard user={user} />
    </div>
  )
}

export default App