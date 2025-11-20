import { describe, it, expect, vi, beforeEach } from 'vitest'
import CoursService from '../cours.service'
import HttpService from '../http.service'

vi.mock('../http.service')

describe('CoursService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPrograms', () => {
    it('returns programs list', async () => {
      const mockPrograms = [{ id: 1, course_element_id: 1 }]
      vi.mocked(HttpService.get).mockResolvedValue({ data: mockPrograms })

      const result = await CoursService.getPrograms()

      expect(result).toEqual(mockPrograms)
      expect(HttpService.get).toHaveBeenCalled()
    })
  })

  describe('createProgram', () => {
    it('creates a program', async () => {
      const mockData = { 
        class_group_id: 1, 
        course_element_professor_id: 1, 
        academic_year_id: 1, 
        weighting: { CC: 30, TP: 20, EXAMEN: 50 } 
      }
      vi.mocked(HttpService.post).mockResolvedValue({ data: { id: 1 } })

      await CoursService.createProgram(mockData)

      expect(HttpService.post).toHaveBeenCalledWith(expect.any(String), mockData)
    })
  })

  describe('getCourseElementProfessors', () => {
    it('returns associations list', async () => {
      const mockAssociations = [{ id: 1, course_element_id: 1, professor_id: 1 }]
      vi.mocked(HttpService.get).mockResolvedValue({ data: mockAssociations })

      const result = await CoursService.getCourseElementProfessors(1)

      expect(result).toEqual(mockAssociations)
    })
  })
})
