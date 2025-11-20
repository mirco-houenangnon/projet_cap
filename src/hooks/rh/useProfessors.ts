import { useState, useEffect } from 'react'
import RhService from '@/services/rh.service'
import type { Professor } from '@/types/cours.types'

export const useProfessors = (filters = {}) => {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [grades, setGrades] = useState<any[]>([])
  const [banks, setBanks] = useState<string[]>([])

  const loadProfessors = async (customFilters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await RhService.getProfessors({ ...filters, ...customFilters })
      setProfessors(response.data || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des professeurs')
    } finally {
      setLoading(false)
    }
  }

  const loadGrades = async () => {
    try {
      const response = await RhService.getGrades()
      setGrades(response.data || [])
    } catch (err: any) {
      console.error('Erreur lors du chargement des grades', err)
    }
  }

  const loadBanks = async () => {
    try {
      const banksData = await RhService.getBanks()
      setBanks(banksData)
    } catch (err: any) {
      console.error('Erreur lors du chargement des banques', err)
    }
  }

  const createProfessor = async (data: any) => {
    const professor = await RhService.createProfessor(data)
    await loadProfessors()
    return professor
  }

  const updateProfessor = async (id: number, data: any) => {
    const professor = await RhService.updateProfessor(id, data)
    await loadProfessors()
    return professor
  }

  const deleteProfessor = async (id: number) => {
    await RhService.deleteProfessor(id)
    await loadProfessors()
  }

  useEffect(() => {
    loadProfessors()
    loadGrades()
    loadBanks()
  }, [JSON.stringify(filters)])

  return {
    professors,
    loading,
    error,
    grades,
    banks,
    createProfessor,
    updateProfessor,
    deleteProfessor,
    refreshProfessors: loadProfessors,
    setError,
  }
}
