import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminUserService from '../adminUser.service'
import HttpService from '../http.service'

vi.mock('../http.service')

describe('AdminUserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProfessors', () => {
    it('returns professors list', async () => {
      const mockProfessors = [{ id: 1, matricule: 'PROF001', nom: 'Doe' }]
      vi.mocked(HttpService.get).mockResolvedValue({ data: mockProfessors })

      const result = await AdminUserService.getProfessors()

      expect(result).toEqual(mockProfessors)
      expect(HttpService.get).toHaveBeenCalled()
    })
  })

  describe('createProfessor', () => {
    it('creates a professor', async () => {
      const mockData = { nom: 'Doe', prenoms: 'John', email: 'john@example.com' }
      vi.mocked(HttpService.post).mockResolvedValue({ success: true })

      await AdminUserService.createProfessor(mockData)

      expect(HttpService.post).toHaveBeenCalledWith(expect.any(String), mockData)
    })
  })

  describe('getStatistics', () => {
    it('returns statistics', async () => {
      const mockStats = { total_admin_users: 10, total_professors: 20 }
      vi.mocked(HttpService.get).mockResolvedValue({ data: mockStats })

      const result = await AdminUserService.getStatistics()

      expect(result).toEqual(mockStats)
    })
  })
})
