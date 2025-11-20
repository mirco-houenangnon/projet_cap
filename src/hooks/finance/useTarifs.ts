import { useState, useEffect } from 'react'
import financeService from '@/services/finance.service'

const useTarifs = () => {
  const [tarifs, setTarifs] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTarifs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await financeService.getTarifs()
      setTarifs(response.data)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des tarifs')
      console.error('Erreur tarifs:', err)
    } finally {
      setLoading(false)
    }
  }

  const createTarif = async (data: any) => {
    try {
      await financeService.createTarif(data)
      await fetchTarifs() // Recharger la liste
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du tarif')
      throw err
    }
  }

  const updateTarif = async (id: number, data: any) => {
    try {
      await financeService.updateTarif(id, data)
      await fetchTarifs() // Recharger la liste
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du tarif')
      throw err
    }
  }

  const deleteTarif = async (id: number) => {
    try {
      await financeService.deleteTarif(id)
      await fetchTarifs() // Recharger la liste
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du tarif')
      throw err
    }
  }

  useEffect(() => {
    fetchTarifs()
  }, [])

  return {
    tarifs,
    loading,
    error,
    createTarif,
    updateTarif,
    deleteTarif,
    refetch: fetchTarifs,
  }
}

export default useTarifs