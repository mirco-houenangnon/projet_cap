import { useState, useEffect, useMemo } from 'react'
import Select from 'react-select'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CBadge,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBook, cilPeople, cilSchool, cilPlus } from '@coreui/icons'
import { LoadingSpinner } from '@/components'
import useProfessorGrades from '@/hooks/notes/useProfessorGrades'
import useAnneeAcademiquesData from '@/hooks/inscription/useAnneeAcademiqueData'

const ProfessorDashboard = () => {
  const {
    classes,
    programs,
    loading,
    error,
    loadMyClasses,
    loadProgramsByClass
  } = useProfessorGrades()

  const { academicYears } = useAnneeAcademiquesData()
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null)

  // Options pour les années académiques
  const yearOptions = useMemo(() => {
    return academicYears.map((year: any) => ({
      value: year.id,
      label: year.libelle
    }))
  }, [academicYears])

  // Options pour les cohortes
  const cohortOptions = [
    { value: '1', label: 'Cohorte 1' },
    { value: '2', label: 'Cohorte 2' },
    { value: '3', label: 'Cohorte 3' }
  ]

  // Charger les classes au montage et lors des changements de filtres
  useEffect(() => {
    loadMyClasses({
      academic_year_id: selectedAcademicYear || undefined,
      department_id: selectedDepartment || undefined,
      cohort: selectedCohort || undefined
    })
  }, [selectedAcademicYear, selectedDepartment, selectedCohort])

  const handleCreateEvaluation = (programId: number) => {
    // Rediriger vers la page de création d'évaluation
    window.location.href = `/notes/professor/evaluation/${programId}`
  }

  const handleViewGrades = (programId: number) => {
    // Rediriger vers la page de notation
    window.location.href = `/notes/professor/grade-sheet/${programId}`
  }

  if (loading && !classes.length) {
    return <LoadingSpinner fullPage message="Chargement de vos classes..." />
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h2>Mes Classes et Évaluations</h2>
          <p className="text-muted">
            Gérez les notes de vos classes organisées par cycle et filière
          </p>
        </CCol>
      </CRow>

      {/* Filtres */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Filtres</strong>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={4}>
              <label className="form-label">Année Académique</label>
              <Select
                options={yearOptions}
                value={yearOptions.find(opt => opt.value === selectedAcademicYear)}
                onChange={(option: any) => setSelectedAcademicYear(option?.value || null)}
                placeholder="Toutes les années..."
                isClearable
                isSearchable
              />
            </CCol>
            <CCol md={4}>
              <label className="form-label">Cohorte</label>
              <Select
                options={cohortOptions}
                value={cohortOptions.find(opt => opt.value === selectedCohort)}
                onChange={(option: any) => setSelectedCohort(option?.value || null)}
                placeholder="Toutes les cohortes..."
                isClearable
                isSearchable
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {error && (
        <CAlert color="danger" className="mb-4">
          {error}
        </CAlert>
      )}

      {/* Classes par cycle */}
      {classes.length > 0 ? (
        <CAccordion>
          {classes.map((cycle: any, cycleIndex: number) => (
            <CAccordionItem key={cycleIndex} itemKey={cycleIndex}>
              <CAccordionHeader>
                <CIcon icon={cilSchool} className="me-2" />
                <strong>{cycle.cycle_name}</strong>
                <CBadge color="info" className="ms-2">
                  {cycle.departments.reduce((total: number, dept: any) => 
                    total + dept.classes.length, 0
                  )} classes
                </CBadge>
              </CAccordionHeader>
              <CAccordionBody>
                {cycle.departments.map((department: any, deptIndex: number) => (
                  <div key={deptIndex} className="mb-4">
                    <h5 className="text-primary mb-3">
                      <CIcon icon={cilBook} className="me-2" />
                      {department.department_name}
                    </h5>
                    
                    <CRow>
                      {department.classes.map((classGroup: any) => (
                        <CCol md={6} lg={4} key={classGroup.id} className="mb-3">
                          <CCard className="h-100">
                            <CCardHeader className="d-flex justify-content-between align-items-center">
                              <strong>{classGroup.name}</strong>
                              <CBadge color="secondary">
                                {classGroup.level}
                              </CBadge>
                            </CCardHeader>
                            <CCardBody>
                              <div className="d-flex align-items-center mb-3">
                                <CIcon icon={cilPeople} className="me-2" />
                                <span>{classGroup.programs_count} programme(s)</span>
                              </div>
                              
                              <CButton
                                color="primary"
                                size="sm"
                                className="w-100"
                                onClick={() => loadProgramsByClass(classGroup.id)}
                              >
                                Voir les programmes
                              </CButton>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      ))}
                    </CRow>
                  </div>
                ))}
              </CAccordionBody>
            </CAccordionItem>
          ))}
        </CAccordion>
      ) : (
        <CCard>
          <CCardBody className="text-center py-5">
            <CIcon icon={cilBook} size="xxl" className="text-muted mb-3" />
            <h4 className="text-muted">Aucune classe trouvée</h4>
            <p className="text-muted">
              Vous n'avez pas de classes assignées pour les critères sélectionnés.
            </p>
          </CCardBody>
        </CCard>
      )}

      {/* Modal ou section pour afficher les programmes */}
      {programs.length > 0 && (
        <CCard className="mt-4">
          <CCardHeader>
            <strong>Programmes de la classe sélectionnée</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {programs.map((program: any) => (
                <CCol md={6} lg={4} key={program.id} className="mb-3">
                  <CCard>
                    <CCardHeader>
                      <strong>{program.course_name}</strong>
                    </CCardHeader>
                    <CCardBody>
                      <p className="text-muted mb-2">
                        <small>Professeur: {program.professor_name}</small>
                      </p>
                      
                      <div className="mb-3">
                        <CBadge color={program.column_count > 0 ? 'success' : 'warning'}>
                          {program.column_count} évaluation(s)
                        </CBadge>
                        {program.has_retake && (
                          <CBadge color="info" className="ms-2">
                            Rattrapage
                          </CBadge>
                        )}
                      </div>

                      <div className="d-grid gap-2">
                        <CButton
                          color="success"
                          size="sm"
                          onClick={() => handleCreateEvaluation(program.id)}
                        >
                          <CIcon icon={cilPlus} className="me-1" />
                          Créer évaluation
                        </CButton>
                        
                        {program.column_count > 0 && (
                          <CButton
                            color="primary"
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewGrades(program.id)}
                          >
                            Voir les notes
                          </CButton>
                        )}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default ProfessorDashboard