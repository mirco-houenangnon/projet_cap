import { useState, useEffect, useMemo } from 'react'
import Select from 'react-select'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilChart, 
  cilPeople, 
  cilBook, 
  cilCheckCircle,
  cilCloudDownload,
  cilFilter
} from '@coreui/icons'
import { LoadingSpinner } from '@/components'
import { StatsCard } from '@/components/dashboard'
import useAdminGrades from '@/hooks/notes/useAdminGrades'
import useAnneeAcademiquesData from '@/hooks/inscription/useAnneeAcademiqueData'

const AdminDashboard = () => {
  const {
    dashboardStats,
    gradesByFilters,
    loading,
    error,
    loadDashboard,
    loadGradesByFilters,
    exportByDepartment
  } = useAdminGrades()

  const { academicYears } = useAnneeAcademiquesData()

  // États pour les filtres
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null)

  // Options pour les sélecteurs
  const yearOptions = useMemo(() => {
    return academicYears.map((year: any) => ({
      value: year.id,
      label: year.libelle
    }))
  }, [academicYears])

  // Simuler les options de filières et niveaux (à remplacer par de vraies données)
  const departmentOptions = [
    { value: 1, label: 'Informatique' },
    { value: 2, label: 'Génie Civil' },
    { value: 3, label: 'Électronique' }
  ]

  const levelOptions = [
    { value: 'L1', label: 'Licence 1' },
    { value: 'L2', label: 'Licence 2' },
    { value: 'L3', label: 'Licence 3' },
    { value: 'M1', label: 'Master 1' },
    { value: 'M2', label: 'Master 2' }
  ]

  const programOptions = [
    { value: null, label: 'Tous les programmes' },
    { value: 1, label: 'Programmation Web' },
    { value: 2, label: 'Base de données' },
    { value: 3, label: 'Réseaux' }
  ]

  // Charger le dashboard au montage
  useEffect(() => {
    // Sélectionner l'année académique courante par défaut
    const currentYear = academicYears.find((year: any) => year.is_current)
    if (currentYear) {
      setSelectedAcademicYear(currentYear.id)
    }
  }, [academicYears])

  useEffect(() => {
    if (selectedAcademicYear) {
      loadDashboard(selectedAcademicYear)
    }
  }, [selectedAcademicYear])

  // Charger les données filtrées
  useEffect(() => {
    loadGradesByFilters({
      academic_year_id: selectedAcademicYear || undefined,
      department_id: selectedDepartment || undefined,
      level: selectedLevel || undefined,
      program_id: selectedProgram || undefined
    })
  }, [selectedAcademicYear, selectedDepartment, selectedLevel, selectedProgram])

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!selectedAcademicYear || !selectedDepartment) {
      alert('Veuillez sélectionner une année académique et une filière')
      return
    }

    const result = await exportByDepartment({
      academic_year_id: selectedAcademicYear,
      department_id: selectedDepartment,
      level: selectedLevel || undefined,
      format
    })

    if (result.success) {
      console.log('Export réussi:', result.data)
    }
  }

  if (loading && !dashboardStats) {
    return <LoadingSpinner fullPage message="Chargement du dashboard..." />
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h2>Dashboard des Notes</h2>
          <p className="text-muted">
            Vue d'ensemble des évaluations et des résultats par filière
          </p>
        </CCol>
      </CRow>

      {/* Statistiques */}
      {dashboardStats && (
        <CRow className="mb-4">
          <StatsCard
            value={dashboardStats.total_evaluations}
            label="Total Évaluations"
            icon={cilBook}
            color="primary"
          />
          <StatsCard
            value={dashboardStats.completed_evaluations}
            label="Évaluations Complètes"
            icon={cilCheckCircle}
            color="success"
          />
          <StatsCard
            value={dashboardStats.pending_evaluations}
            label="En Attente"
            icon={cilChart}
            color="warning"
          />
          <StatsCard
            value={`${dashboardStats.average_success_rate}%`}
            label="Taux de Réussite Moyen"
            icon={cilPeople}
            color="info"
          />
        </CRow>
      )}

      {/* Filtres */}
      <CCard className="mb-4">
        <CCardHeader>
          <CIcon icon={cilFilter} className="me-2" />
          <strong>Filtres</strong>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={3}>
              <label className="form-label">Année Académique</label>
              <Select
                options={yearOptions}
                value={yearOptions.find(opt => opt.value === selectedAcademicYear)}
                onChange={(option: any) => setSelectedAcademicYear(option?.value || null)}
                placeholder="Sélectionner..."
                isSearchable
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Filière</label>
              <Select
                options={departmentOptions}
                value={departmentOptions.find(opt => opt.value === selectedDepartment)}
                onChange={(option: any) => setSelectedDepartment(option?.value || null)}
                placeholder="Sélectionner..."
                isSearchable
                isClearable
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Niveau</label>
              <Select
                options={levelOptions}
                value={levelOptions.find(opt => opt.value === selectedLevel)}
                onChange={(option: any) => setSelectedLevel(option?.value || null)}
                placeholder="Sélectionner..."
                isSearchable
                isClearable
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Programme</label>
              <Select
                options={programOptions}
                value={programOptions.find(opt => opt.value === selectedProgram)}
                onChange={(option: any) => setSelectedProgram(option?.value || null)}
                placeholder="Sélectionner..."
                isSearchable
              />
            </CCol>
          </CRow>
          
          <CRow className="mt-3">
            <CCol>
              <CDropdown>
                <CDropdownToggle color="primary">
                  <CIcon icon={cilCloudDownload} className="me-1" />
                  Exporter
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => handleExport('pdf')}>
                    Export PDF
                  </CDropdownItem>
                  <CDropdownItem onClick={() => handleExport('excel')}>
                    Export Excel
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {error && (
        <CAlert color="danger" className="mb-4">
          {error}
        </CAlert>
      )}

      {/* Tableau des résultats */}
      <CCard>
        <CCardHeader>
          <strong>Résultats par Programme</strong>
          {selectedProgram === null && (
            <span className="ms-2 text-muted">(Vue d'ensemble)</span>
          )}
        </CCardHeader>
        <CCardBody>
          {selectedProgram === null ? (
            // Vue d'ensemble - tous les programmes
            <div className="table-responsive">
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Matricule</CTableHeaderCell>
                    <CTableHeaderCell>Nom et Prénoms</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Prog. 1</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Prog. 2</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Prog. 3</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Moyenne Générale</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* Données simulées */}
                  <CTableRow>
                    <CTableDataCell>2024001</CTableDataCell>
                    <CTableDataCell>
                      <strong>DUPONT Jean</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">14.5</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="info">12.0</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">16.2</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">14.2</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>2024002</CTableDataCell>
                    <CTableDataCell>
                      <strong>MARTIN Marie</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="info">11.5</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="danger">8.0</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">13.2</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="info">10.9</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          ) : (
            // Vue détaillée d'un programme spécifique
            <div className="table-responsive">
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Matricule</CTableHeaderCell>
                    <CTableHeaderCell>Nom et Prénoms</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Eval 1 (30%)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Eval 2 (40%)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Eval 3 (30%)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Moyenne</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Rattrapage</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Moy. Finale</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Professeur</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* Données simulées */}
                  <CTableRow>
                    <CTableDataCell>2024001</CTableDataCell>
                    <CTableDataCell>
                      <strong>DUPONT Jean</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">15.0</CTableDataCell>
                    <CTableDataCell className="text-center">14.0</CTableDataCell>
                    <CTableDataCell className="text-center">14.5</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">14.3</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">V</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">14.3</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <small>Prof. BERNARD</small>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>2024002</CTableDataCell>
                    <CTableDataCell>
                      <strong>MARTIN Marie</strong>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">8.0</CTableDataCell>
                    <CTableDataCell className="text-center">9.0</CTableDataCell>
                    <CTableDataCell className="text-center">7.5</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="danger">8.2</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">12.0</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color="success">12.0</CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <small>Prof. BERNARD</small>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default AdminDashboard