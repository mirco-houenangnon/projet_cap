import HttpService from './http.service.ts'

class NotesService {
  private baseUrl = 'notes'

  // Professeur - Obtenir les classes regroupées par cycle
  getMyClasses = async (params?: {
    academic_year_id?: number
    department_id?: number
    cohort?: string
  }) => {
    return await HttpService.get(`${this.baseUrl}/professor/my-classes`, params)
  }

  // Professeur - Obtenir les programmes d'une classe
  getProgramsByClass = async (classGroupId: number) => {
    return await HttpService.get(`${this.baseUrl}/professor/programs-by-class/${classGroupId}`)
  }

  // Professeur - Obtenir la fiche de notation
  getGradeSheet = async (programId: number, cohort?: string) => {
    return await HttpService.post(`${this.baseUrl}/professor/grade-sheet`, {
      program_id: programId,
      cohort
    })
  }

  // Professeur - Créer une évaluation
  createEvaluation = async (programId: number, notes: Record<number, number>, isRetake = false) => {
    return await HttpService.post(`${this.baseUrl}/professor/create-evaluation`, {
      program_id: programId,
      notes,
      is_retake: isRetake
    })
  }

  // Professeur - Mettre à jour une note
  updateGrade = async (data: {
    student_pending_student_id: number
    program_id: number
    position: number
    value: number
  }) => {
    return await HttpService.put(`${this.baseUrl}/professor/update-grade`, data)
  }

  // Professeur - Définir la pondération
  setWeighting = async (programId: number, weighting: number[]) => {
    return await HttpService.put(`${this.baseUrl}/professor/set-weighting`, {
      program_id: programId,
      weighting
    })
  }

  // Professeur - Dupliquer une note
  duplicateGrade = async (programId: number, position: number, value: number) => {
    return await HttpService.put(`${this.baseUrl}/professor/duplicate-grade`, {
      program_id: programId,
      position,
      value
    })
  }

  // Professeur - Exporter la fiche récapitulative
  exportGradeSheet = async (programId: number, includeRetake = false) => {
    return await HttpService.post(`${this.baseUrl}/professor/export-grade-sheet`, {
      program_id: programId,
      include_retake: includeRetake
    })
  }

  // Admin - Dashboard
  getDashboard = async (academicYearId?: number) => {
    return await HttpService.get(`${this.baseUrl}/admin/dashboard`, { academic_year_id: academicYearId })
  }

  // Admin - Obtenir les notes par filière et niveau
  getGradesByDepartmentLevel = async (params: {
    academic_year_id?: number
    department_id?: number
    level?: string
    program_id?: number
    cohort?: string
  }) => {
    return await HttpService.get(`${this.baseUrl}/admin/grades-by-department-level`, params)
  }

  // Admin - Détails d'un programme
  getProgramDetails = async (programId: number) => {
    return await HttpService.get(`${this.baseUrl}/admin/program-details/${programId}`)
  }

  // Admin - Exporter par filière
  exportGradesByDepartment = async (params: {
    academic_year_id: number
    department_id: number
    level?: string
    format?: 'pdf' | 'excel'
  }) => {
    return await HttpService.post(`${this.baseUrl}/admin/export-grades-by-department`, params)
  }

  // Décisions - Exporter PV fin d'année
  exportPVFinAnnee = async (params: {
    academic_year_id: number
    department_id: number
    level?: string
    cohort?: string
    validation_average: number
  }) => {
    return await HttpService.post(`${this.baseUrl}/decisions/export-pv-fin-annee`, params, { responseType: 'blob' })
  }

  // Décisions - Exporter PV délibération
  exportPVDeliberation = async (params: {
    academic_year_id: number
    department_id: number
    level?: string
    cohort?: string
    semester: number
  }) => {
    return await HttpService.post(`${this.baseUrl}/decisions/export-pv-deliberation`, params, { responseType: 'blob' })
  }

  // Décisions - Exporter récap notes
  exportRecapNotes = async (params: {
    academic_year_id: number
    department_id: number
    level?: string
    cohort?: string
  }) => {
    return await HttpService.post(`${this.baseUrl}/decisions/export-recap-notes`, params, { responseType: 'blob' })
  }

  // Décisions - Sauvegarder décisions semestrielles
  saveSemesterDecisions = async (params: {
    academic_year_id: number
    semester: number
    decisions: Array<{
      student_id: number
      decision: string
    }>
  }) => {
    return await HttpService.post(`${this.baseUrl}/decisions/save-semester-decisions`, params)
  }

  // Décisions - Sauvegarder décisions annuelles
  saveYearDecisions = async (params: {
    academic_year_id: number
    decisions: Array<{
      student_id: number
      decision: string
    }>
  }) => {
    return await HttpService.post(`${this.baseUrl}/decisions/save-year-decisions`, params)
  }

  // Filtres - Récupérer les filières (depuis module Inscription)
  getDepartments = async () => {
    return await HttpService.get('inscription/filieres')
  }

  // Filtres - Récupérer les cohortes (depuis module Inscription)
  getCohorts = async () => {
    return await HttpService.get('inscription/cohortes')
  }
}

export default new NotesService()