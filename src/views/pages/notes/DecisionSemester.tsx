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
  CButtonGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilFilter } from '@coreui/icons'
import { LoadingSpinner } from '@/components'
import useAnneeAcademiquesData from '@/hooks/inscription/useAnneeAcademiqueData'
import notesService from '@/services/notes.service'

const DecisionSemester = () => {
  const { academicYears } = useAnneeAcademiquesData()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // États pour les filtres
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<number>(1)
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null)

  // États pour les décisions
  const [decisions, setDecisions] = useState<Record<number, string>>({})
  const [students, setStudents] = useState<any[]>([])

  // Options pour les sélecteurs
  const yearOptions = useMemo(() => {
    return academicYears.map((year: any) => ({
      value: year.id,
      label: year.libelle
    }))
  }, [academicYears])

  const [departments, setDepartments] = useState<any[]>([])
  const [cohorts, setCohorts] = useState<string[]>([])

  const departmentOptions = useMemo(() => {
    return departments.map((dept: any) => ({
      value: dept.id,
      label: dept.title || dept.name
    }))
  }, [departments])

  const levelOptions = useMemo(() => {
    const uniqueLevels = new Set<string>()
    departments.forEach((dept: any) => {
      const cycle = dept.cycle
      if (cycle === 'licence professionnelle') {
        uniqueLevels.add('L1')
        uniqueLevels.add('L2')
        uniqueLevels.add('L3')
      } else if (cycle === 'master') {
        uniqueLevels.add('M1')
        uniqueLevels.add('M2')
      } else if (cycle === 'ingenierie') {
        uniqueLevels.add('I1')
        uniqueLevels.add('I2')
        uniqueLevels.add('I3')
      }
    })
    return Array.from(uniqueLevels).sort().map(level => ({
      value: level,
      label: level
    }))
  }, [departments])

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [deptRes, cohortRes] = await Promise.all([
          notesService.getDepartments(),
          notesService.getCohorts()
        ])
        setDepartments(deptRes.data || [])
        setCohorts(cohortRes.data || [])
      } catch (error) {
        console.error('Erreur chargement filtres:', error)
      }
    }
    loadFilters()
  }, [])

  const decisionOptions = [
    'Admis',
    'Admis avec dette',
    'Redouble',
    'Exclu'
  ]

  const cohortOptions = useMemo(() => {
    return cohorts.map((cohort: string) => ({
      value: cohort,
      label: cohort
    }))
  }, [cohorts])

  // Charger l'année académique courante par défaut
  useEffect(() => {
    const currentYear = academicYears.find((year: any) => year.is_current)
    if (currentYear) {
      setSelectedAcademicYear(currentYear.id)
    }
  }, [academicYears])

  const handleDecisionChange = (studentId: number, decision: string) => {
    setDecisions(prev => ({
      ...prev,
      [studentId]: decision
    }))
  }

  const getDecisionColor = (decision: string): string => {
    switch (decision) {
      case 'Admis': return 'success'
      case 'Admis avec dette': return 'warning'
      case 'Redouble': return 'info'
      case 'Exclu': return 'danger'
      default: return 'secondary'
    }
  }

  const getAutomaticDecision = (moyenne: number, credits: number, totalCredits: number): string => {
    const creditPercentage = (credits / totalCredits) * 100
    
    if (moyenne >= 12 && creditPercentage >= 80) return 'Admis'
    if (moyenne >= 10 && creditPercentage >= 60) return 'Admis avec dette'
    if (moyenne >= 8) return 'Redouble'
    return 'Exclu'
  }

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedAcademicYear || !selectedDepartment || !selectedLevel) return
      
      setLoading(true)
      try {
        // TODO: Implémenter l'endpoint backend
        setStudents([])
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }
    loadStudents()
  }, [selectedAcademicYear, selectedDepartment, selectedLevel, selectedSemester, selectedCohort])

  const handleSaveDecisions = async () => {
    if (!selectedAcademicYear) return
    setLoading(true)
    try {
      const decisionsArray = Object.entries(decisions).map(([studentId, decision]) => ({
        student_id: parseInt(studentId),
        decision
      }))
      
      await notesService.saveSemesterDecisions({
        academic_year_id: selectedAcademicYear,
        semester: selectedSemester,
        decisions: decisionsArray
      })
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleAutoDecisions = () => {
    const autoDecisions: Record<number, string> = {}
    students.forEach(student => {
      autoDecisions[student.id] = getAutomaticDecision(
        student.moyenne,
        student.credits,
        student.totalCredits
      )
    })
    setDecisions(autoDecisions)
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h2>Décisions Semestrielles</h2>
          <p className="text-muted">
            Définissez les décisions de passage pour chaque étudiant par semestre
          </p>
        </CCol>
      </CRow>

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
            <CCol md={2}>
              <label className="form-label">Semestre</label>
              <select
                className="form-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              >
                <option value={1}>Semestre 1</option>
                <option value={2}>Semestre 2</option>
              </select>
            </CCol>
            <CCol md={2}>
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
            <CCol md={2}>
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
            <CCol md={2}>
              <label className="form-label">Cohorte</label>
              <Select
                options={cohortOptions}
                value={cohortOptions.find(opt => opt.value === selectedCohort)}
                onChange={(option: any) => setSelectedCohort(option?.value || null)}
                placeholder="Sélectionner..."
                isSearchable
                isClearable
              />
            </CCol>
            <CCol md={2} className="d-flex align-items-end">
              <CButton
                color="info"
                variant="outline"
                onClick={handleAutoDecisions}
                className="w-100"
              >
                Décisions Auto
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {error && (
        <CAlert color="danger" className="mb-4">
          {error}
        </CAlert>
      )}

      {/* Tableau des décisions */}
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Décisions Semestrielles - Semestre {selectedSemester}</strong>
          <CButton
            color="primary"
            onClick={handleSaveDecisions}
            disabled={loading || Object.keys(decisions).length === 0}
          >
            <CIcon icon={cilSave} className="me-1" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </CButton>
        </CCardHeader>
        <CCardBody>
          <div className="table-responsive">
            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Matricule</CTableHeaderCell>
                  <CTableHeaderCell>Nom et Prénoms</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Moyenne</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Crédits</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Décision Suggérée</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Décision Finale</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {students.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center text-muted py-4">
                      Sélectionnez les filtres pour afficher les étudiants
                    </CTableDataCell>
                  </CTableRow>
                ) : students.map((student) => {
                  const suggestedDecision = getAutomaticDecision(
                    student.moyenne,
                    student.credits,
                    student.totalCredits
                  )
                  const finalDecision = decisions[student.id] || ''

                  return (
                    <CTableRow key={student.id}>
                      <CTableDataCell>{student.matricule}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{student.nom}</strong><br />
                        <small className="text-muted">{student.prenoms}</small>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={student.moyenne >= 10 ? 'success' : 'danger'}>
                          {student.moyenne.toFixed(2)}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <span className={student.credits >= student.totalCredits * 0.8 ? 'text-success' : 'text-warning'}>
                          {student.credits}/{student.totalCredits}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={getDecisionColor(suggestedDecision)}>
                          {suggestedDecision}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <select
                          className="form-select form-select-sm"
                          value={finalDecision}
                          onChange={(e) => handleDecisionChange(student.id, e.target.value)}
                        >
                          <option value="">Choisir...</option>
                          {decisionOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default DecisionSemester