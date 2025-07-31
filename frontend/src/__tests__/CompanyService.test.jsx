import { companyService } from '../CompanyService'

describe('CompanyService', () => {
  beforeEach(() => {
    // Reset service state before each test
    companyService.reset()
  })

  afterEach(() => {
    // Clean up after each test
    companyService.reset()
  })

  describe('getCompanies', () => {
    it('should return empty array when no companies exist', async () => {
      const companies = await companyService.getCompanies()
      expect(companies).toEqual([])
    })

    it('should return all companies', async () => {
      // Seed some data
      companyService.seedData()
      
      const companies = await companyService.getCompanies()
      expect(companies).toHaveLength(2)
      expect(companies[0].name).toBe('TechCorp Inc')
      expect(companies[1].name).toBe('StartupXYZ')
    })
  })

  describe('createCompany', () => {
    it('should create a new company successfully', async () => {
      const companyData = {
        name: 'Test Company',
        githubOrgId: 'test-org',
        status: 'ACTIVE'
      }

      const createdCompany = await companyService.createCompany(companyData)

      expect(createdCompany).toMatchObject({
        id: expect.any(Number),
        name: 'Test Company',
        githubOrgId: 'test-org',
        status: 'ACTIVE',
        repositories: expect.any(Number),
        analyses: expect.any(Number),
        issues: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('should assign default status if not provided', async () => {
      const companyData = {
        name: 'Test Company',
        githubOrgId: 'test-org'
      }

      const createdCompany = await companyService.createCompany(companyData)
      expect(createdCompany.status).toBe('PENDING')
    })

    it('should throw error when name is missing', async () => {
      const companyData = {
        githubOrgId: 'test-org'
      }

      await expect(companyService.createCompany(companyData))
        .rejects.toThrow('Name and GitHub organization ID are required')
    })

    it('should throw error when githubOrgId is missing', async () => {
      const companyData = {
        name: 'Test Company'
      }

      await expect(companyService.createCompany(companyData))
        .rejects.toThrow('Name and GitHub organization ID are required')
    })

    it('should throw error when githubOrgId already exists', async () => {
      const companyData = {
        name: 'Test Company',
        githubOrgId: 'existing-org'
      }

      // Create first company
      await companyService.createCompany(companyData)

      // Try to create another with same githubOrgId
      const duplicateData = {
        name: 'Another Company',
        githubOrgId: 'existing-org'
      }

      await expect(companyService.createCompany(duplicateData))
        .rejects.toThrow('Company with this GitHub organization already exists')
    })
  })

  describe('getCompanyById', () => {
    it('should return company when it exists', async () => {
      const companyData = {
        name: 'Test Company',
        githubOrgId: 'test-org'
      }

      const createdCompany = await companyService.createCompany(companyData)
      const foundCompany = await companyService.getCompanyById(createdCompany.id)

      expect(foundCompany).toEqual(createdCompany)
    })

    it('should throw error when company does not exist', async () => {
      await expect(companyService.getCompanyById(999))
        .rejects.toThrow('Company with id 999 not found')
    })
  })

  describe('updateCompany', () => {
    it('should update company successfully', async () => {
      const companyData = {
        name: 'Test Company',
        githubOrgId: 'test-org'
      }

      const createdCompany = await companyService.createCompany(companyData)
      
      const updateData = {
        name: 'Updated Company Name',
        status: 'LEARNING'
      }

      const updatedCompany = await companyService.updateCompany(createdCompany.id, updateData)

      expect(updatedCompany.name).toBe('Updated Company Name')
      expect(updatedCompany.status).toBe('LEARNING')
      expect(updatedCompany.githubOrgId).toBe('test-org') // Should remain unchanged
      expect(updatedCompany.updatedAt).not.toBe(createdCompany.updatedAt)
    })

    it('should throw error when company does not exist', async () => {
      const updateData = { name: 'Updated Name' }

      await expect(companyService.updateCompany(999, updateData))
        .rejects.toThrow('Company with id 999 not found')
    })
  })

  describe('deleteCompany', () => {
    it('should delete company successfully', async () => {
      const companyData = {
        name: 'Test Company',
        githubOrgId: 'test-org'
      }

      const createdCompany = await companyService.createCompany(companyData)
      
      const result = await companyService.deleteCompany(createdCompany.id)
      expect(result).toBe(true)

      // Verify company is deleted
      await expect(companyService.getCompanyById(createdCompany.id))
        .rejects.toThrow('Company with id')
    })

    it('should throw error when company does not exist', async () => {
      await expect(companyService.deleteCompany(999))
        .rejects.toThrow('Company with id 999 not found')
    })
  })

  describe('getCompanyByGithubOrg', () => {
    it('should return company when githubOrgId exists', async () => {
      const companyData = {
        name: 'Test Company',
        githubOrgId: 'test-org'
      }

      const createdCompany = await companyService.createCompany(companyData)
      const foundCompany = await companyService.getCompanyByGithubOrg('test-org')

      expect(foundCompany).toEqual(createdCompany)
    })

    it('should throw error when githubOrgId does not exist', async () => {
      await expect(companyService.getCompanyByGithubOrg('non-existent-org'))
        .rejects.toThrow('Company with GitHub org non-existent-org not found')
    })
  })

  describe('seedData', () => {
    it('should populate service with initial data', () => {
      companyService.seedData()
      
      expect(companyService.companies).toHaveLength(2)
      expect(companyService.companies[0].name).toBe('TechCorp Inc')
      expect(companyService.companies[1].name).toBe('StartupXYZ')
      expect(companyService.nextId).toBe(3)
    })
  })

  describe('reset', () => {
    it('should clear all data and reset state', async () => {
      // Add some data
      await companyService.createCompany({
        name: 'Test Company',
        githubOrgId: 'test-org'
      })

      expect(companyService.companies).toHaveLength(1)

      // Reset
      companyService.reset()

      expect(companyService.companies).toHaveLength(0)
      expect(companyService.nextId).toBe(1)
    })
  })

  describe('delay functionality', () => {
    it('should simulate API delay', async () => {
      const start = Date.now()
      await companyService.delay(100)
      const end = Date.now()

      expect(end - start).toBeGreaterThanOrEqual(90) // Allow some variance
    })
  })
})