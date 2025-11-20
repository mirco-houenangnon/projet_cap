import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CourseElementProfessors from '../CourseElementProfessors'
import coursService from '@/services/cours.service'

vi.mock('@/services/cours.service')

const mockAssociations = [
  {
    id: 1,
    course_element_id: 1,
    professor_id: 1,
    principal_professor_id: 1,
    course_element: { code: 'INF101', name: 'Informatique' },
    professor: { nom: 'Doe', prenoms: 'John' },
    principal_professor: { nom: 'Doe', prenoms: 'John' }
  }
]

describe.skip('CourseElementProfessors Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders associations list', async () => {
    vi.mocked(coursService.getCourseElementProfessorAssignments).mockResolvedValue({ data: mockAssociations })

    render(
      <BrowserRouter>
        <CourseElementProfessors />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('INF101')).toBeInTheDocument()
    })
  })

  it('displays loading state', () => {
    vi.mocked(coursService.getCourseElementProfessorAssignments).mockImplementation(() => new Promise(() => {}))

    render(
      <BrowserRouter>
        <CourseElementProfessors />
      </BrowserRouter>
    )

    expect(screen.getByText(/chargement/i)).toBeInTheDocument()
  })
})
