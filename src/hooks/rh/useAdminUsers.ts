import { useState, useEffect } from 'react'
import RhService from '@/services/rh.service'
import type { AdminUser } from '@/types/rh.types'

export const useAdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAdminUsers = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await RhService.getAdminUsers(filters)
      setAdminUsers(response.data || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const createAdminUser = async (data: any) => {
    const user = await RhService.createAdminUser(data)
    await loadAdminUsers()
    return user
  }

  const updateAdminUser = async (id: number, data: any) => {
    const user = await RhService.updateAdminUser(id, data)
    await loadAdminUsers()
    return user
  }

  const deleteAdminUser = async (id: number) => {
    await RhService.deleteAdminUser(id)
    await loadAdminUsers()
  }

  const loadRoles = async () => {
    try {
      const rolesData = await RhService.getRoles()
      setRoles(rolesData)
    } catch (err: any) {
      console.error('Erreur lors du chargement des rôles:', err)
    }
  }

  useEffect(() => {
    loadAdminUsers()
    loadRoles()
  }, [])

  return {
    adminUsers,
    roles,
    loading,
    error,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    refreshAdminUsers: loadAdminUsers,
    setError,
  }
}
