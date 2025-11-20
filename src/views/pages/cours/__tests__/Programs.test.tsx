import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Programs from '../Programs'
import coursService from '@/services/cours.service'

vi.mock('@/services/cours.service')

const mockPrograms = [
  {
    id: 1,
    course_element_id: 1,
    academic_year_id: 1,
    weighting: { CC: 30, TP: 20, EXAMEN: 50 },
    course_element: { code: 'INF101', name: 'Informatique' }
  }
]

describe.skip('Programs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders programs list', async () => {
    vi.mocked(coursService.getPrograms).mockResolvedValue({ data: mockPrograms })

    render(
      <BrowserRouter>
        <Programs />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('INF101')).toBeInTheDocument()
    })
  })

  it('displays loading state', () => {
    vi.mocked(coursService.getPrograms).mockImplementation(() => new Promise(() => {}))

    render(
      <BrowserRouter>
        <Programs />
      </BrowserRouter>
    )

    expect(screen.getByText(/chargement/i)).toBeInTheDocument()
  })
})
