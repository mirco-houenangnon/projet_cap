import { useState, useEffect } from 'react'
import financeService from '@/services/finance.service'

const useFinanceDashboard = () => {
  const [stats, setStats] = useState<any>(null)
  const [pendingPayments, setPendingPayments] = useState<any[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = selectedYear ? { academic_year: selectedYear } : {}
      
      const [statsResponse, pendingResponse] = await Promise.all([
        financeService.getStatistics(params),
        financeService.get('finance/dashboard/pending-payments')
      ])

      setStats(statsResponse.data)
      setPendingPayments(pendingResponse.data)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des données')
      console.error('Erreur dashboard finance:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [selectedYear])

  return {
    stats,
    pendingPayments,
    selectedYear,
    setSelectedYear,
    loading,
    error,
    refetch: fetchDashboardData,
  }
}

export default useFinanceDashboard