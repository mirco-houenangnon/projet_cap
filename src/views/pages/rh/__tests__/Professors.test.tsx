import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Professors from '../Professors'
import adminUserService from '@/services/adminUser.service'

vi.mock('@/services/adminUser.service')

const mockProfessors = [
  {
    id: 1,
    matricule: 'PROF001',
    nom: 'Doe',
    prenoms: 'John',
    sexe: 'M',
    email: 'john.doe@example.com',
    telephone: '1234567890',
    statut: 'Actif',
    created_at: '2024-01-01T00:00:00.000Z'
  }
]

describe.skip('Professors Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders professors list', async () => {
    vi.mocked(adminUserService.getProfessors).mockResolvedValue({ data: mockProfessors })

    render(
      <BrowserRouter>
        <Professors />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('PROF001')).toBeInTheDocument()
    })
  })

  it('displays loading state', () => {
    vi.mocked(adminUserService.getProfessors).mockImplementation(() => new Promise(() => {}))

    render(
      <BrowserRouter>
        <Professors />
      </BrowserRouter>
    )

    expect(screen.getByText(/chargement/i)).toBeInTheDocument()
  })
})
