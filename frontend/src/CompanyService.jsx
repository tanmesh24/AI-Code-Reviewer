// Mock API service for demonstration
class CompanyService {
  constructor() {
    this.companies = []
    this.nextId = 1
  }

  async getCompanies() {
    // Simulate API delay
    await this.delay(300)
    
    return [...this.companies]
  }

  async getCompanyById(id) {
    await this.delay(200)
    
    const company = this.companies.find(c => c.id === id)
    if (!company) {
      throw new Error(`Company with id ${id} not found`)
    }
    return { ...company }
  }

  async createCompany(companyData) {
    await this.delay(400)
    
    // Validate required fields
    if (!companyData.name || !companyData.githubOrgId) {
      throw new Error('Name and GitHub organization ID are required')
    }

    // Check if company with same githubOrgId already exists
    const existing = this.companies.find(c => c.githubOrgId === companyData.githubOrgId)
    if (existing) {
      throw new Error('Company with this GitHub organization already exists')
    }

    const newCompany = {
      id: this.nextId++,
      name: companyData.name,
      githubOrgId: companyData.githubOrgId,
      status: companyData.status || 'PENDING',
      repositories: Math.floor(Math.random() * 10) + 1,
      analyses: Math.floor(Math.random() * 50) + 10,
      issues: Math.floor(Math.random() * 20) + 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.companies.push(newCompany)
    return { ...newCompany }
  }

  async updateCompany(id, updateData) {
    await this.delay(300)
    
    const companyIndex = this.companies.findIndex(c => c.id === id)
    if (companyIndex === -1) {
      throw new Error(`Company with id ${id} not found`)
    }

    const updatedCompany = {
      ...this.companies[companyIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    this.companies[companyIndex] = updatedCompany
    return { ...updatedCompany }
  }

  async deleteCompany(id) {
    await this.delay(250)
    
    const companyIndex = this.companies.findIndex(c => c.id === id)
    if (companyIndex === -1) {
      throw new Error(`Company with id ${id} not found`)
    }

    this.companies.splice(companyIndex, 1)
    return true
  }

  async getCompanyByGithubOrg(githubOrgId) {
    await this.delay(200)
    
    const company = this.companies.find(c => c.githubOrgId === githubOrgId)
    if (!company) {
      throw new Error(`Company with GitHub org ${githubOrgId} not found`)
    }
    return { ...company }
  }

  // Helper method to simulate API delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Method to seed initial data for testing
  seedData() {
    this.companies = [
      {
        id: 1,
        name: 'TechCorp Inc',
        githubOrgId: 'techcorp',
        status: 'ACTIVE',
        repositories: 15,
        analyses: 45,
        issues: 12,
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2023-01-20T15:30:00Z'
      },
      {
        id: 2,
        name: 'StartupXYZ',
        githubOrgId: 'startupxyz',
        status: 'LEARNING',
        repositories: 8,
        analyses: 23,
        issues: 7,
        createdAt: '2023-02-01T09:15:00Z',
        updatedAt: '2023-02-10T11:45:00Z'
      }
    ]
    this.nextId = 3
  }

  // Reset service state (useful for testing)
  reset() {
    this.companies = []
    this.nextId = 1
  }
}

// Export singleton instance
export const companyService = new CompanyService()

// Seed some initial data for demo
companyService.seedData()