import React, { useState, useEffect } from 'react'
import { companyService } from './CompanyService'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalRepositories: 0,
    totalAnalyses: 0,
    issuesFound: 0
  })
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const companiesData = await companyService.getCompanies()
      setCompanies(companiesData)
      
      // Calculate stats
      setStats({
        totalCompanies: companiesData.length,
        totalRepositories: companiesData.reduce((sum, company) => sum + (company.repositories || 0), 0),
        totalAnalyses: companiesData.reduce((sum, company) => sum + (company.analyses || 0), 0),
        issuesFound: companiesData.reduce((sum, company) => sum + (company.issues || 0), 0)
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCompany = async () => {
    try {
      const newCompany = {
        name: `Company ${companies.length + 1}`,
        githubOrgId: `org-${Date.now()}`,
        status: 'ACTIVE'
      }
      
      const createdCompany = await companyService.createCompany(newCompany)
      setCompanies([...companies, createdCompany])
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalCompanies: prev.totalCompanies + 1
      }))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteCompany = async (companyId) => {
    try {
      await companyService.deleteCompany(companyId)
      const updatedCompanies = companies.filter(c => c.id !== companyId)
      setCompanies(updatedCompanies)
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalCompanies: prev.totalCompanies - 1
      }))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="loading" data-testid="loading">
        <div>Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error" data-testid="error">
        <h3>Error loading dashboard</h3>
        <p>{error}</p>
        <button className="btn" onClick={loadDashboardData}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dashboard Overview</h2>
        <button 
          className="btn" 
          onClick={handleAddCompany}
          data-testid="add-company-button"
        >
          Add Company
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number" data-testid="total-companies">
            {stats.totalCompanies}
          </div>
          <div>Total Companies</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-testid="total-repositories">
            {stats.totalRepositories}
          </div>
          <div>Active Repositories</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-testid="total-analyses">
            {stats.totalAnalyses}
          </div>
          <div>Total Analyses</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-testid="issues-found">
            {stats.issuesFound}
          </div>
          <div>Issues Found</div>
        </div>
      </div>

      {/* Companies List */}
      <div className="card">
        <h3>Companies</h3>
        {companies.length === 0 ? (
          <p data-testid="no-companies">No companies registered yet</p>
        ) : (
          <div data-testid="companies-list">
            {companies.map((company) => (
              <div 
                key={company.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '15px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}
                data-testid={`company-${company.id}`}
              >
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{company.name}</h4>
                  <p style={{ margin: 0, color: '#666' }}>{company.githubOrgId}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span 
                    style={{
                      background: company.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
                      color: company.status === 'ACTIVE' ? '#155724' : '#721c24',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {company.status}
                  </span>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteCompany(company.id)}
                    data-testid={`delete-company-${company.id}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard