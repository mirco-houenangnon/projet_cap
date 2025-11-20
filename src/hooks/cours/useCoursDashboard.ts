import { useState, useEffect, useCallback } from 'react'
import CoursService from '@/services/cours.service'

interface DashboardStats {
  teachingUnitsCount: number
  courseElementsCount: number
  courseResourcesCount: number
  programsCount: number
  professorsCount: number
  classGroupsCount: number
}

export const useCoursDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    teachingUnitsCount: 0,
    courseElementsCount: 0,
    courseResourcesCount: 0,
    programsCount: 0,
    professorsCount: 0,
    classGroupsCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Récupérer les statistiques en parallèle
      const [
        teachingUnitsResponse,
        courseElementsResponse,
        courseResourcesResponse,
        programsResponse,
        professorsResponse,
        classGroupsResponse,
      ] = await Promise.all([
        CoursService.getTeachingUnits({ per_page: 1 }),
        CoursService.getCourseElements({ per_page: 1 }),
        CoursService.getCourseResources({ per_page: 1 }),
        CoursService.getPrograms({ per_page: 1 }),
        CoursService.getProfessors(),
        CoursService.getClassGroups(),
      ])

      console.log(
        teachingUnitsResponse,
        courseElementsResponse,
        courseResourcesResponse,
        programsResponse,
        professorsResponse,
        classGroupsResponse,
      )

      setStats({
        teachingUnitsCount: teachingUnitsResponse.meta?.total ?? 0,
        courseElementsCount: courseElementsResponse.meta?.total ?? 0,
        courseResourcesCount: courseResourcesResponse.meta?.total ?? 0,
        programsCount: programsResponse.meta?.total ?? 0,
        professorsCount: professorsResponse.length || 0,
        classGroupsCount: classGroupsResponse.length || 0,
      })
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des statistiques')
      console.error('Erreur fetchDashboardStats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  return {
    stats,
    loading,
    error,
    refresh: fetchDashboardStats,
    setError,
  }
}

export default useCoursDashboard
