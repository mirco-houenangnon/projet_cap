import { useState, useEffect, useCallback } from 'react'
import CoursService from '@/services/cours.service'
import type {
  CourseElement,
  TeachingUnit,
  CreateCourseElementRequest,
  UpdateCourseElementRequest,
  CourseElementFilters,
} from '@/types/cours.types'

export const useCourseElements = (initialFilters: CourseElementFilters = {}) => {
  const [courseElements, setCourseElements] = useState<CourseElement[]>([])
  const [teachingUnits, setTeachingUnits] = useState<TeachingUnit[]>([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CourseElementFilters>(initialFilters)

const fetchCourseElements = useCallback(async () => {
  try {
    setLoading(true)
    setError(null)
    
    // CORRECTION: response est de type ApiResponse<CourseElement[]>
    const response = await CoursService.getCourseElements(filters)
    console.log('Réponse API:', response)
    
    // CORRECTION: Les données sont dans response.data, la pagination dans response.meta
    setCourseElements(response.data || [])
    setPagination({
      current_page: response.meta?.current_page || 1,
      last_page: response.meta?.last_page || 1,
      per_page: response.meta?.per_page || 15,
      total: response.meta?.total || 0,
      from: response.meta?.from || 0,
      to: response.meta?.to || 0
    })
  } catch (err: any) {
    setError(err?.response?.data?.message || 'Erreur lors du chargement des éléments de cours')
    console.error('Erreur fetchCourseElements:', err)
  } finally {
    setLoading(false)
  }
}, [filters])

  const fetchTeachingUnits = useCallback(async () => {
    try {
      const response = await CoursService.getTeachingUnits({ per_page: 100 }) // Get all for select options
      setTeachingUnits(response.data || [])
    } catch (err: any) {
      console.error('Erreur fetchTeachingUnits:', err)
    }
  }, [])

  const createCourseElement = useCallback(async (data: CreateCourseElementRequest): Promise<CourseElement | null> => {
    try {
      const newElement = await CoursService.createCourseElement(data)
      await fetchCourseElements() // Refresh the list
      return newElement
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la création de l\'ECUE')
      console.error('Erreur createCourseElement:', err)
      throw err
    }
  }, [fetchCourseElements])

  const updateCourseElement = useCallback(async (id: number | string, data: UpdateCourseElementRequest): Promise<CourseElement | null> => {
    try {
      const updatedElement = await CoursService.updateCourseElement(id, data)
      await fetchCourseElements() // Refresh the list
      return updatedElement
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la mise à jour de l\'ECUE')
      console.error('Erreur updateCourseElement:', err)
      throw err
    }
  }, [fetchCourseElements])

  const deleteCourseElement = useCallback(async (id: number | string): Promise<void> => {
    try {
      await CoursService.deleteCourseElement(id)
      await fetchCourseElements() // Refresh the list
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la suppression de l\'ECUE')
      console.error('Erreur deleteCourseElement:', err)
      throw err
    }
  }, [fetchCourseElements])

  const updateFilters = useCallback((newFilters: CourseElementFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const goToPage = useCallback((_page: number) => {
    updateFilters({ per_page: filters.per_page || 15 })
  }, [filters.per_page, updateFilters])

  useEffect(() => {
    fetchCourseElements()
  }, [fetchCourseElements])

  useEffect(() => {
    fetchTeachingUnits()
  }, [fetchTeachingUnits])

  return {
    // Data
    courseElements,
    teachingUnits,
    pagination,
    loading,
    error,
    filters,
    
    // Actions
    createCourseElement,
    updateCourseElement,
    deleteCourseElement,
    fetchCourseElements,
    fetchTeachingUnits,
    updateFilters,
    resetFilters,
    goToPage,
    
    // Utils
    setError
  }
}

export default useCourseElements
