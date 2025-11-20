import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilPeople, cilCheckCircle } from '@coreui/icons'
import RhService from '@/services/rh.service'
import type { RhStats } from '@/types/rh.types'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<RhStats>({
    total_professors: 0,
    total_admin_users: 0,
    active_professors: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await RhService.getStatistics()
      setStats(data || {
        total_professors: 0,
        total_admin_users: 0,
        active_professors: 0,
      })
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Tableau de bord RH</strong>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm={6} lg={4}>
                  <CWidgetStatsA
                    className="mb-4"
                    color="primary"
                    value={loading ? '...' : (stats.total_professors || 0).toString()}
                    title="Total Professeurs"
                    chart={<CIcon icon={cilUser} size="xl" />}
                  />
                </CCol>
                <CCol sm={6} lg={4}>
                  <CWidgetStatsA
                    className="mb-4"
                    color="info"
                    value={loading ? '...' : (stats.total_admin_users || 0).toString()}
                    title="Utilisateurs Admin"
                    chart={<CIcon icon={cilPeople} size="xl" />}
                  />
                </CCol>
                <CCol sm={6} lg={4}>
                  <CWidgetStatsA
                    className="mb-4"
                    color="success"
                    value={loading ? '...' : (stats.active_professors || 0).toString()}
                    title="Professeurs Actifs"
                    chart={<CIcon icon={cilCheckCircle} size="xl" />}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
