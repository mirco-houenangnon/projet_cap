import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CourseResources from '../CourseResources'
import coursService from '@/services/cours.service'

vi.mock('@/services/cours.service')

const mockResources = [
  {
    id: 1,
    course_element_id: 1,
    title: 'Cours 1',
    description: 'Description',
    resource_type: 'cours',
    file: { id: 1, url: 'http://example.com/file', download_url: 'http://example.com/download' }
  }
]

describe.skip('CourseResources Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders resources list', async () => {
    vi.mocked(coursService.getCourseResources).mockResolvedValue({ data: mockResources })

    render(
      <BrowserRouter>
        <CourseResources />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Cours 1')).toBeInTheDocument()
    })
  })

  it('displays loading state', () => {
    vi.mocked(coursService.getCourseResources).mockImplementation(() => new Promise(() => {}))

    render(
      <BrowserRouter>
        <CourseResources />
      </BrowserRouter>
    )

    expect(screen.getByText(/chargement/i)).toBeInTheDocument()
  })
})
