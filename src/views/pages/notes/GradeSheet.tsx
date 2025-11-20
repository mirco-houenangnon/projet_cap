import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CButtonGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CProgress,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilPlus, 
  cilSave, 
  cilArrowLeft, 
  cilCopy, 
  cilSettings,
  cilCloudDownload,
  cilCheckCircle,
  cilWarning
} from '@coreui/icons'
import { LoadingSpinner } from '@/components'
import useProfessorGrades from '@/hooks/notes/useProfessorGrades'

const GradeSheet = () => {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()
  const {
    gradeSheet,
    loading,
    error,
    loadGradeSheet,
    createEvaluation,
    updateGrade,
    duplicateGrade,
    setWeighting,
    exportGradeSheet,
    areAllGradesCompleted,
    getCompletionPercentage,
    setError
  } = useProfessorGrades()

  const [showWeightingModal, setShowWeightingModal] = useState(false)
  const [weightingValues, setWeightingValues] = useState<number[]>([])
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [duplicateValue, setDuplicateValue] = useState<number>(-1)
  const [duplicateColumn, setDuplicateColumn] = useState<number>(0)

  useEffect(() => {
    if (programId) {
      loadGradeSheet(parseInt(programId))
    }
  }, [programId])

  useEffect(() => {
    if (gradeSheet?.program.weighting) {
      setWeightingValues([...gradeSheet.program.weighting])
    }
  }, [gradeSheet?.program.weighting])

  const handleGradeChange = async (
    studentId: number,
    position: number,
    value: string
  ) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < -1 || numValue > 20) return

    await updateGrade(studentId, parseInt(programId!), position, numValue)
  }

  const handleCreateEvaluation = async (isRetake = false) => {
    const result = await createEvaluation(parseInt(programId!), isRetake)
    if (result.success) {
      setError(null)
    }
  }

  const handleSaveWeighting = async () => {
    const sum = weightingValues.reduce((a, b) => a + b, 0)
    if (sum !== 100) {
      setError('La somme des pondérations doit être égale à 100%')
      return
    }

    const result = await setWeighting(parseInt(programId!), weightingValues)
    if (result.success) {
      setShowWeightingModal(false)
      setError(null)
    }
  }

  const handleDuplicateGrade = async () => {
    if (duplicateValue < -1 || duplicateValue > 20) {
      setError('La note doit être entre -1 et 20')
      return
    }

    const result = await duplicateGrade(parseInt(programId!), duplicateColumn, duplicateValue)
    if (result.success) {
      setShowDuplicateModal(false)
      setError(null)
    }
  }

  const handleExport = async (includeRetake = false) => {
    const result = await exportGradeSheet(parseInt(programId!), includeRetake)
    if (result.success) {
      // Traiter l'export (téléchargement, etc.)
      console.log('Export data:', result.data)
    }
  }

  const getGradeColor = (grade: number): string => {
    if (grade === -1) return 'warning'
    if (grade >= 10) return 'success'
    if (grade >= 8) return 'info'
    return 'danger'
  }

  const calculateAverage = (grades: number[], weighting: number[]): number => {
    if (grades.length !== weighting.length || grades.includes(-1)) return -1
    
    const sum = grades.reduce((acc, grade, index) => acc + (grade * weighting[index] / 100), 0)
    return Math.round(sum * 100) / 100
  }

  if (loading && !gradeSheet) {
    return <LoadingSpinner fullPage message="Chargement de la fiche de notation..." />
  }

  if (!gradeSheet) {
    return (
      <CCard>
        <CCardBody className="text-center">
          <h4>Fiche de notation non trouvée</h4>
          <CButton color="primary" onClick={() => navigate('/notes/professor')}>
            Retour au dashboard
          </CButton>
        </CCardBody>
      </CCard>
    )
  }

  const completionPercentage = getCompletionPercentage()
  const hasIncompleteGrades = gradeSheet.students.some(student => 
    !areAllGradesCompleted(student, gradeSheet.program.column_count)
  )

  return (
    <>
      {/* En-tête */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1">{gradeSheet.program.name}</h4>
            <p className="text-muted mb-0">
              Classe: {gradeSheet.program.class_group.name} - 
              Niveau: {gradeSheet.program.class_group.level}
            </p>
          </div>
          <CButton
            color="secondary"
            variant="outline"
            onClick={() => navigate('/notes/professor')}
          >
            <CIcon icon={cilArrowLeft} className="me-1" />
            Retour
          </CButton>
        </CCardHeader>
        <CCardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <strong>Progression: </strong>
              <CBadge color={completionPercentage === 100 ? 'success' : 'warning'}>
                {completionPercentage}% complété
              </CBadge>
            </div>
            <CProgress value={completionPercentage} className="w-50" />
          </div>

          {hasIncompleteGrades && (
            <CAlert color="warning">
              <CIcon icon={cilWarning} className="me-2" />
              Certaines notes ne sont pas encore renseignées (valeur -1)
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      {/* Actions */}
      <CCard className="mb-4">
        <CCardBody>
          <CButtonGroup className="me-3">
            <CButton
              color="success"
              onClick={() => handleCreateEvaluation(false)}
            >
              <CIcon icon={cilPlus} className="me-1" />
              Nouvelle évaluation
            </CButton>
            
            {gradeSheet.program.column_count > 0 && (
              <CButton
                color="info"
                onClick={() => handleCreateEvaluation(true)}
              >
                <CIcon icon={cilPlus} className="me-1" />
                Rattrapage
              </CButton>
            )}
          </CButtonGroup>

          {gradeSheet.program.column_count > 1 && (
            <CButton
              color="primary"
              variant="outline"
              className="me-2"
              onClick={() => setShowWeightingModal(true)}
            >
              <CIcon icon={cilSettings} className="me-1" />
              Pondération
            </CButton>
          )}

          {gradeSheet.program.column_count > 0 && (
            <>
              <CButton
                color="secondary"
                variant="outline"
                className="me-2"
                onClick={() => setShowDuplicateModal(true)}
              >
                <CIcon icon={cilCopy} className="me-1" />
                Dupliquer note
              </CButton>

              <CDropdown>
                <CDropdownToggle color="primary" variant="outline">
                  <CIcon icon={cilCloudDownload} className="me-1" />
                  Exporter
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => handleExport(false)}>
                    Sans rattrapage
                  </CDropdownItem>
                  <CDropdownItem onClick={() => handleExport(true)}>
                    Avec rattrapage
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </>
          )}
        </CCardBody>
      </CCard>

      {error && (
        <CAlert color="danger" className="mb-4">
          {error}
        </CAlert>
      )}

      {/* Tableau des notes */}
      <CCard>
        <CCardHeader>
          <strong>Fiche de notation</strong>
          <span className="ms-2 text-muted">
            ({gradeSheet.total_students} étudiants)
          </span>
        </CCardHeader>
        <CCardBody>
          <div className="table-responsive">
            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Nom et Prénoms</CTableHeaderCell>
                  {Array.from({ length: gradeSheet.program.column_count }, (_, i) => (
                    <CTableHeaderCell key={i} className="text-center">
                      Eval {i + 1}
                      {gradeSheet.program.weighting[i] && (
                        <div className="small text-muted">
                          ({gradeSheet.program.weighting[i]}%)
                        </div>
                      )}
                    </CTableHeaderCell>
                  ))}
                  {gradeSheet.program.column_count > 0 && (
                    <CTableHeaderCell className="text-center">Moyenne</CTableHeaderCell>
                  )}
                  {gradeSheet.program.retake_column_count > 0 && (
                    <>
                      <CTableHeaderCell className="text-center">Rattrapage</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Moy. Finale</CTableHeaderCell>
                    </>
                  )}
                  <CTableHeaderCell className="text-center">Statut</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {gradeSheet.students.map((student) => {
                  const average = calculateAverage(student.grades, gradeSheet.program.weighting)
                  const isValidated = average >= 10 || (student.retake_average && student.retake_average >= 10)
                  
                  return (
                    <CTableRow key={student.student_pending_student_id}>
                      <CTableDataCell>
                        <strong>{student.last_name}</strong><br />
                        <small className="text-muted">{student.first_names}</small>
                      </CTableDataCell>
                      
                      {student.grades.map((grade, index) => (
                        <CTableDataCell key={index} className="text-center">
                          <CFormInput
                            type="number"
                            min="-1"
                            max="20"
                            step="0.25"
                            value={grade === -1 ? '' : grade}
                            onChange={(e) => handleGradeChange(
                              student.student_pending_student_id,
                              index,
                              e.target.value
                            )}
                            className="text-center"
                            style={{ width: '80px' }}
                          />
                        </CTableDataCell>
                      ))}
                      
                      {gradeSheet.program.column_count > 0 && (
                        <CTableDataCell className="text-center">
                          <CBadge color={getGradeColor(average)}>
                            {average === -1 ? '-' : average.toFixed(2)}
                          </CBadge>
                        </CTableDataCell>
                      )}
                      
                      {gradeSheet.program.retake_column_count > 0 && (
                        <>
                          <CTableDataCell className="text-center">
                            {average < 10 ? (
                              student.retake_grades?.[0] !== undefined ? 
                                student.retake_grades[0] : '-'
                            ) : (
                              <CBadge color="success">V</CBadge>
                            )}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CBadge color={getGradeColor(student.retake_average || average)}>
                              {(student.retake_average || average).toFixed(2)}
                            </CBadge>
                          </CTableDataCell>
                        </>
                      )}
                      
                      <CTableDataCell className="text-center">
                        {isValidated ? (
                          <CBadge color="success">
                            <CIcon icon={cilCheckCircle} className="me-1" />
                            Validé
                          </CBadge>
                        ) : (
                          <CBadge color="danger">
                            Non validé
                          </CBadge>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Modal Pondération */}
      <CModal visible={showWeightingModal} onClose={() => setShowWeightingModal(false)}>
        <CModalHeader>
          <CModalTitle>Définir la pondération</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Définissez la pondération pour chaque évaluation (total = 100%)</p>
          {weightingValues.map((weight, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">Évaluation {index + 1} (%)</label>
              <CFormInput
                type="number"
                min="0"
                max="100"
                value={weight}
                onChange={(e) => {
                  const newWeights = [...weightingValues]
                  newWeights[index] = parseInt(e.target.value) || 0
                  setWeightingValues(newWeights)
                }}
              />
            </div>
          ))}
          <div className="mt-3">
            <strong>Total: {weightingValues.reduce((a, b) => a + b, 0)}%</strong>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowWeightingModal(false)}>
            Annuler
          </CButton>
          <CButton color="primary" onClick={handleSaveWeighting}>
            <CIcon icon={cilSave} className="me-1" />
            Enregistrer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Duplication */}
      <CModal visible={showDuplicateModal} onClose={() => setShowDuplicateModal(false)}>
        <CModalHeader>
          <CModalTitle>Dupliquer une note</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Colonne</label>
            <select
              className="form-select"
              value={duplicateColumn}
              onChange={(e) => setDuplicateColumn(parseInt(e.target.value))}
            >
              {Array.from({ length: gradeSheet.program.column_count }, (_, i) => (
                <option key={i} value={i}>Évaluation {i + 1}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Note à dupliquer</label>
            <CFormInput
              type="number"
              min="-1"
              max="20"
              step="0.25"
              value={duplicateValue}
              onChange={(e) => setDuplicateValue(parseFloat(e.target.value) || -1)}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDuplicateModal(false)}>
            Annuler
          </CButton>
          <CButton color="primary" onClick={handleDuplicateGrade}>
            <CIcon icon={cilCopy} className="me-1" />
            Dupliquer
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default GradeSheet