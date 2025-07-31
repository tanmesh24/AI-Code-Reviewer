import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Dashboard from '../Dashboard'
import { companyService } from '../CompanyService'

// Mock the company service
jest.mock('../CompanyService', () => ({
  companyService: {
    getCompanies: jest.fn(),
    createCompany: jest.fn(),
    deleteCompany: jest.fn(),
  }
}))

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
}

const mockCompanies = [
  {
    id: 1,
    name: 'TechCorp Inc',
    githubOrgId: 'techcorp',
    status: 'ACTIVE',
    repositories: 15,
    analyses: 45,
    issues: 12
  },
  {
    id: 2,
    name: 'StartupXYZ',
    githubOrgId: 'startupxyz',
    status: 'LEARNING',
    repositories: 8,
    analyses: 23,
    issues: 7
  }
]

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    // Make getCompanies return a pending promise
    companyService.getCompanies.mockReturnValue(new Promise(() => {}))
    
    render(<Dashboard user={mockUser} />)
    
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument()
  })

  it('displays dashboard data after loading', async () => {
    companyService.getCompanies.mockResolvedValue(mockCompanies)
    
    render(<Dashboard user={mockUser} />)
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
    })

    // Check stats are calculated correctly
    expect(screen.getByTestId('total-companies')).toHaveTextContent('2')
    expect(screen.getByTestId('total-repositories')).toHaveTextContent('23') // 15 + 8
    expect(screen.getByTestId('total-analyses')).toHaveTextContent('68') // 45 + 23
    expect(screen.getByTestId('issues-found')).toHaveTextContent('19') // 12 + 7

    // Check companies are listed
    expect(screen.getByText('TechCorp Inc')).toBeInTheDocument()
    expect(screen.getByText('StartupXYZ')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to load companies'
    companyService.getCompanies.mockRejectedValue(new Error(errorMessage))
    
    render(<Dashboard user={mockUser} />)
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })

    expect(screen.getByText('Error loading dashboard')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('allows adding a new company', async () => {
    const newCompany = {
      id: 3,
      name: 'Company 3',
      githubOrgId: 'org-123',
      status: 'ACTIVE'
    }

    companyService.getCompanies.mockResolvedValue(mockCompanies)
    companyService.createCompany.mockResolvedValue(newCompany)
    
    render(<Dashboard user={mockUser} />)
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
    })

    const addButton = screen.getByTestId('add-company-button')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(companyService.createCompany).toHaveBeenCalledWith({
        name: 'Company 3',
        githubOrgId: expect.stringMatching(/org-\d+/),
        status: 'ACTIVE'
      })
    })
  })

  it('allows deleting a company', async () => {
    companyService.getCompanies.mockResolvedValue(mockCompanies)
    companyService.deleteCompany.mockResolvedValue(true)
    
    render(<Dashboard user={mockUser} />)
    
    await waitFor(() => {
      expect(screen.getByText('TechCorp Inc')).toBeInTheDocument()
    })

    const deleteButton = screen.getByTestId('delete-company-1')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(companyService.deleteCompany).toHaveBeenCalledWith(1)
    })
  })

  it('displays empty state when no companies exist', async () => {
    companyService.getCompanies.mockResolvedValue([])
    
    render(<Dashboard user={mockUser} />)
    
    await waitFor(() => {
      expect(screen.getByTestId('no-companies')).toBeInTheDocument()
    })

    expect(screen.getByText('No companies registered yet')).toBeInTheDocument()
    
    // All stats should be 0
    expect(screen.getByTestId('total-companies')).toHaveTextContent('0')
    expect(screen.getByTestId('total-repositories')).toHaveTextContent('0')
    expect(screen.getByTestId('total-analyses')).toHaveTextContent('0')
    expect(screen.getByTestId('issues-found')).toHaveTextContent('0')
  })

  it('displays company status badges correctly', async () => {
    companyService.getCompanies.mockResolvedValue(mockCompanies)
    
    render(<Dashboard user={mockUser} />)
    
    await waitFor(() => {
      expect(screen.getByText('ACTIVE')).toBeInTheDocument()
      expect(screen.getByText('LEARNING')).toBeInTheDocument()
    })
  })

  it('can retry loading data after error', async () => {
    // First call fails
    companyService.getCompanies
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockCompanies)
    
    render(<Dashboard user={mockUser} />)
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
    })

    expect(companyService.getCompanies).toHaveBeenCalledTimes(2)
  })

  it('handles add company errors', async () => {
    companyService.getCompanies.mockResolvedValue(mockCompanies)
    companyService.createCompany.mockRejectedValue(new Error('Failed to create company'))
    
    render(<Dashboard user={mockUser} />)
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
    })

    const addButton = screen.getByTestId('add-company-button')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })

    expect(screen.getByText('Failed to create company')).toBeInTheDocument()
  })
})