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
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CButtonGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { 
  cilCloudDownload,
  cilFilter,
  cilClipboard,
  cilCalendar
} from '@coreui/icons'
import { LoadingSpinner } from '@/components'
import useAdminGrades from '@/hooks/notes/useAdminGrades'
import useAnneeAcademiquesData from '@/hooks/inscription/useAnneeAcademiqueData'
import notesService from '@/services/notes.service'

const AdminConsultation = () => {
  const {
    gradesByFilters,
    loading,
    error,
    loadGradesByFilters,
    exportByDepartment
  } = useAdminGrades()

  const { academicYears } = useAnneeAcademiquesData()

  // États pour les filtres
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null)

  // Données des filtres
  const [departments, setDepartments] = useState<any[]>([])
  const [cohorts, setCohorts] = useState<string[]>([])

  // États pour les modales
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [showSemesterModal, setShowSemesterModal] = useState(false)
  const [validationAverage, setValidationAverage] = useState<number>(10)
  const [selectedSemester, setSelectedSemester] = useState<number>(1)

  // Options pour les sélecteurs
  const yearOptions = useMemo(() => {
    return academicYears.map((year: any) => ({
      value: year.id,
      label: year.libelle
    }))
  }, [academicYears])

  const departmentOptions = useMemo(() => {
    return departments.map((dept: any) => ({
      value: dept.id,
      label: dept.title || dept.name
    }))
  }, [departments])

  const levelOptions = useMemo(() => {
    // Extraire les niveaux uniques depuis les départements
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



  const cohortOptions = useMemo(() => {
    return cohorts.map((cohort: string) => ({
      value: cohort,
      label: cohort
    }))
  }, [cohorts])

  // Charger les données des filtres
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

  // Charger l'année académique courante par défaut
  useEffect(() => {
    const currentYear = academicYears.find((year: any) => year.is_current)
    if (currentYear) {
      setSelectedAcademicYear(currentYear.id)
    }
  }, [academicYears])



  // Définir la moyenne de validation par défaut selon le niveau
  useEffect(() => {
    if (selectedLevel) {
      const isLicenceOrMaster = selectedLevel.startsWith('L') || selectedLevel.startsWith('M')
      setValidationAverage(isLicenceOrMaster ? 12 : 10)
    }
  }, [selectedLevel])

  // Charger les données filtrées
  useEffect(() => {
    loadGradesByFilters({
      academic_year_id: selectedAcademicYear || undefined,
      department_id: selectedDepartment || undefined,
      level: selectedLevel || undefined,
      cohort: selectedCohort || undefined
    })
  }, [selectedAcademicYear, selectedDepartment, selectedLevel, selectedCohort])

  const handleExportPVFinAnnee = () => {
    setShowValidationModal(true)
  }

  const handleExportPVDeliberation = () => {
    setShowSemesterModal(true)
  }

  const handleExportRecapNotes = async () => {
    if (!selectedAcademicYear || !selectedDepartment) {
      alert('Veuillez sélectionner une année académique et une filière')
      return
    }

    try {
      const response = await notesService.exportRecapNotes({
        academic_year_id: selectedAcademicYear,
        department_id: selectedDepartment,
        level: selectedLevel || undefined,
        cohort: selectedCohort || undefined
      })
      
      // Télécharger le fichier PDF
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Recap_Notes_${selectedAcademicYear}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      alert('Erreur lors de l\'export du récap')
    }
  }

  const confirmExportPVFinAnnee = async () => {
    if (!selectedAcademicYear || !selectedDepartment) {
      alert('Veuillez sélectionner une année académique et une filière')
      return
    }

    try {
      const response = await notesService.exportPVFinAnnee({
        academic_year_id: selectedAcademicYear,
        department_id: selectedDepartment,
        level: selectedLevel || undefined,
        cohort: selectedCohort || undefined,
        validation_average: validationAverage
      })
      
      // Télécharger le fichier PDF
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `PV_Fin_Annee_${selectedAcademicYear}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      setShowValidationModal(false)
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      alert('Erreur lors de l\'export du PV')
    }
  }

  const confirmExportPVDeliberation = async () => {
    if (!selectedAcademicYear || !selectedDepartment) {
      alert('Veuillez sélectionner une année académique et une filière')
      return
    }

    try {
      const response = await notesService.exportPVDeliberation({
        academic_year_id: selectedAcademicYear,
        department_id: selectedDepartment,
        level: selectedLevel || undefined,
        cohort: selectedCohort || undefined,
        semester: selectedSemester
      })
      
      // Télécharger le fichier PDF
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `PV_Deliberation_S${selectedSemester}_${selectedAcademicYear}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      setShowSemesterModal(false)
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      alert('Erreur lors de l\'export du PV')
    }
  }

  if (loading && !gradesByFilters.length) {
    return <LoadingSpinner fullPage message="Chargement des données..." />
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h2>Consultation des Notes</h2>
          <p className="text-muted">
            Consultez et exportez les notes par filière et niveau
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
            <CCol md={2}>
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
          </CRow>
        </CCardBody>
      </CCard>

      {/* Actions d'export */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Actions d'Export</strong>
        </CCardHeader>
        <CCardBody>
          <CButtonGroup className="me-3">
            <CButton
              color="primary"
              onClick={handleExportPVFinAnnee}
              disabled={!selectedAcademicYear || !selectedDepartment}
            >
              <CIcon icon={cilClipboard} className="me-1" />
              PV Fin d'Année
            </CButton>
            
            <CButton
              color="info"
              onClick={handleExportPVDeliberation}
              disabled={!selectedAcademicYear || !selectedDepartment}
            >
              <CIcon icon={cilCalendar} className="me-1" />
              PV Délibération Semestrielle
            </CButton>
            
            <CButton
              color="success"
              onClick={handleExportRecapNotes}
              disabled={!selectedAcademicYear || !selectedDepartment}
            >
              <CIcon icon={cilCloudDownload} className="me-1" />
              Récap Notes Session Normale
            </CButton>
          </CButtonGroup>
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
          <strong>Aperçu des Notes</strong>
        </CCardHeader>
        <CCardBody>
          <div className="text-center text-muted py-5">
            <p>Sélectionnez les filtres ci-dessus pour consulter les notes.</p>
            <p>Utilisez les boutons d'export pour générer les PV et récapitulatifs.</p>
          </div>
        </CCardBody>
      </CCard>

      {/* Modal Moyenne de Validation */}
      <CModal visible={showValidationModal} onClose={() => setShowValidationModal(false)}>
        <CModalHeader>
          <CModalTitle>Définir la Moyenne de Validation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Définissez la moyenne de validation pour le PV de fin d'année :</p>
          <div className="mb-3">
            <label className="form-label">Moyenne de validation</label>
            <CFormInput
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={validationAverage}
              onChange={(e) => setValidationAverage(parseFloat(e.target.value) || 10)}
            />
            <small className="text-muted">
              Par défaut : 12 pour Licence/Master, 10 pour les autres niveaux
            </small>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowValidationModal(false)}>
            Annuler
          </CButton>
          <CButton color="primary" onClick={confirmExportPVFinAnnee}>
            <CIcon icon={cilCloudDownload} className="me-1" />
            Générer PV
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Choix Semestre */}
      <CModal visible={showSemesterModal} onClose={() => setShowSemesterModal(false)}>
        <CModalHeader>
          <CModalTitle>Choisir le Semestre</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Sélectionnez le semestre pour le PV de délibération :</p>
          <div className="mb-3">
            <label className="form-label">Semestre</label>
            <select
              className="form-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
            >
              <option value={1}>Semestre 1</option>
              <option value={2}>Semestre 2</option>
            </select>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowSemesterModal(false)}>
            Annuler
          </CButton>
          <CButton color="primary" onClick={confirmExportPVDeliberation}>
            <CIcon icon={cilCloudDownload} className="me-1" />
            Générer PV
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AdminConsultation