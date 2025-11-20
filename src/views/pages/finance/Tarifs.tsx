import { useState } from 'react'
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CAlert,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons'
import { LoadingSpinner } from '@/components'
import useTarifs from '@/hooks/finance/useTarifs'

const Tarifs = () => {
  const {
    tarifs,
    loading,
    error,
    createTarif,
    updateTarif,
    deleteTarif,
  } = useTarifs()

  const [showModal, setShowModal] = useState(false)
  const [editingTarif, setEditingTarif] = useState<any>(null)
  const [formData, setFormData] = useState({
    type: 'inscription',
    libelle: '',
    amount: '',
    cycle_id: '',
    department_id: '',
    academic_year_id: '',
    is_active: true,
    penalty_amount: '',
    penalty_type: 'fixed',
    penalty_active: false,
    exoneration_type: 'percentage',
    exoneration_value: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingTarif) {
        await updateTarif(editingTarif.id, formData)
      } else {
        await createTarif(formData)
      }
      
      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'inscription',
      libelle: '',
      amount: '',
      cycle_id: '',
      department_id: '',
      academic_year_id: '',
      is_active: true,
      penalty_amount: '',
      penalty_type: 'fixed',
      penalty_active: false,
      exoneration_type: 'percentage',
      exoneration_value: '',
    })
    setEditingTarif(null)
  }

  const handleEdit = (tarif: any) => {
    setEditingTarif(tarif)
    setFormData({
      type: tarif.type || 'inscription',
      libelle: tarif.libelle || '',
      amount: tarif.amount?.toString() || '',
      cycle_id: tarif.cycle_id?.toString() || '',
      department_id: tarif.department_id?.toString() || '',
      academic_year_id: tarif.academic_year_id?.toString() || '',
      is_active: tarif.is_active ?? true,
      penalty_amount: tarif.penalty_amount?.toString() || '',
      penalty_type: tarif.penalty_type || 'fixed',
      penalty_active: tarif.penalty_active ?? false,
      exoneration_type: tarif.exoneration_type || 'percentage',
      exoneration_value: tarif.exoneration_value?.toString() || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) {
      try {
        await deleteTarif(id)
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  if (loading) {
    return <LoadingSpinner fullPage message="Chargement des tarifs..." />
  }

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Gestion des Tarifs</h5>
          <CButton
            color="primary"
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
          >
            <CIcon icon={cilPlus} className="me-2" />
            Nouveau Tarif
          </CButton>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" className="mb-3">
              {error}
            </CAlert>
          )}

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Libellé</CTableHeaderCell>
                <CTableHeaderCell>Montant</CTableHeaderCell>
                <CTableHeaderCell>Statut</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {tarifs?.amounts?.length > 0 ? tarifs.amounts.map((tarif: any) => (
                <CTableRow key={tarif.id}>
                  <CTableDataCell>
                    <CBadge color="info">{tarif.type}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{tarif.libelle}</CTableDataCell>
                  <CTableDataCell>{tarif.amount?.toLocaleString()} FCFA</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={tarif.is_active ? 'success' : 'secondary'}>
                      {tarif.is_active ? 'Actif' : 'Inactif'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="warning"
                      variant="ghost"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(tarif)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tarif.id)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              )) : (
                <CTableRow>
                  <CTableDataCell colSpan={5} className="text-center text-muted py-4">
                    Aucun tarif défini
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>
            {editingTarif ? 'Modifier le tarif' : 'Nouveau tarif'}
          </CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <div className="row">
              <div className="col-md-6 mb-3">
                <CFormSelect
                  label="Type de tarif"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="inscription">Frais d'inscription</option>
                  <option value="formation">Frais de formation</option>
                  <option value="sponsorise">Montant sponsorisé</option>
                  <option value="penalty">Pénalité de retard</option>
                </CFormSelect>
              </div>
              <div className="col-md-6 mb-3">
                <CFormInput
                  label="Libellé"
                  value={formData.libelle}
                  onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormInput
                  type="number"
                  label="Montant (FCFA)"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <CFormCheck
                  id="is_active"
                  label="Tarif actif"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              </div>
              
              {formData.type === 'penalty' && (
                <>
                  <div className="col-md-6 mb-3">
                    <CFormInput
                      type="number"
                      label="Montant de pénalité"
                      value={formData.penalty_amount}
                      onChange={(e) => setFormData({ ...formData, penalty_amount: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <CFormSelect
                      label="Type de pénalité"
                      value={formData.penalty_type}
                      onChange={(e) => setFormData({ ...formData, penalty_type: e.target.value })}
                    >
                      <option value="fixed">Montant fixe</option>
                      <option value="percentage">Pourcentage</option>
                    </CFormSelect>
                  </div>
                  <div className="col-md-12 mb-3">
                    <CFormCheck
                      id="penalty_active"
                      label="Activer les pénalités de retard"
                      checked={formData.penalty_active}
                      onChange={(e) => setFormData({ ...formData, penalty_active: e.target.checked })}
                    />
                  </div>
                </>
              )}
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </CButton>
            <CButton color="primary" type="submit">
              {editingTarif ? 'Modifier' : 'Créer'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Tarifs