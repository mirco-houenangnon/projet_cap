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
  CFormTextarea,
  CAlert,
  CBadge,
  CFormInput,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle, cilFile, cilSearch } from '@coreui/icons'
import { LoadingSpinner } from '@/components'
import useValidation from '@/hooks/finance/useValidation'

const Validation = () => {
  const {
    pendingPayments,
    loading,
    error,
    validatePayment,
    rejectPayment,
    downloadReceipt,
    searchPayments,
    pagination,
  } = useValidation()

  const [showValidateModal, setShowValidateModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [observation, setObservation] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [receiptUrl, setReceiptUrl] = useState('')

  const handleValidate = (payment: any) => {
    setSelectedPayment(payment)
    setShowValidateModal(true)
  }

  const handleReject = (payment: any) => {
    setSelectedPayment(payment)
    setShowRejectModal(true)
  }

  const handleViewReceipt = async (payment: any) => {
    try {
      const url = await downloadReceipt(payment.id)
      setReceiptUrl(url)
      setShowReceiptModal(true)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
    }
  }

  const confirmValidation = async () => {
    if (selectedPayment) {
      try {
        await validatePayment(selectedPayment.id, { observation })
        setShowValidateModal(false)
        setObservation('')
        setSelectedPayment(null)
      } catch (error) {
        console.error('Erreur lors de la validation:', error)
      }
    }
  }

  const confirmRejection = async () => {
    if (selectedPayment && rejectionReason.trim()) {
      try {
        await rejectPayment(selectedPayment.id, { motif: rejectionReason })
        setShowRejectModal(false)
        setRejectionReason('')
        setSelectedPayment(null)
      } catch (error) {
        console.error('Erreur lors du rejet:', error)
      }
    }
  }

  const handleSearch = () => {
    searchPayments(searchTerm)
  }

  const handlePageChange = (page: number) => {
    searchPayments(searchTerm, page)
  }

  if (loading) {
    return <LoadingSpinner fullPage message="Chargement des paiements en attente..." />
  }

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Validation des Quittances</h5>
          <div className="d-flex gap-2">
            <CFormInput
              placeholder="Rechercher par matricule, nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '300px' }}
            />
            <CButton color="primary" onClick={handleSearch}>
              <CIcon icon={cilSearch} />
            </CButton>
          </div>
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
                <CTableHeaderCell>Matricule</CTableHeaderCell>
                <CTableHeaderCell>Nom et Prénoms</CTableHeaderCell>
                <CTableHeaderCell>Montant</CTableHeaderCell>
                <CTableHeaderCell>Date de paiement</CTableHeaderCell>
                <CTableHeaderCell>Quittance</CTableHeaderCell>
                <CTableHeaderCell>Observations</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {pendingPayments?.data?.length > 0 ? pendingPayments.data.map((payment: any) => (
                <CTableRow key={payment.id}>
                  <CTableDataCell>{payment.student_id_number}</CTableDataCell>
                  <CTableDataCell>
                    {payment.student 
                      ? `${payment.student.first_name} ${payment.student.last_name}`
                      : payment.studentPendingStudent
                      ? `${payment.studentPendingStudent.first_name} ${payment.studentPendingStudent.last_name}`
                      : 'N/A'
                    }
                  </CTableDataCell>
                  <CTableDataCell>{payment.amount?.toLocaleString()} FCFA</CTableDataCell>
                  <CTableDataCell>
                    {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewReceipt(payment)}
                    >
                      <CIcon icon={cilFile} />
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell>
                    <span className="text-muted small">
                      {payment.observation || 'Aucune observation'}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-1">
                      <CButton
                        color="success"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleValidate(payment)}
                        title="Valider"
                      >
                        <CIcon icon={cilCheckCircle} />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(payment)}
                        title="Rejeter"
                      >
                        <CIcon icon={cilXCircle} />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )) : (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="text-center text-muted py-4">
                    Aucun paiement en attente de validation
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {pagination && pagination.last_page > 1 && (
            <CPagination className="justify-content-center mt-3">
              <CPaginationItem
                disabled={pagination.current_page === 1}
                onClick={() => handlePageChange(pagination.current_page - 1)}
              >
                Précédent
              </CPaginationItem>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <CPaginationItem
                  key={page}
                  active={page === pagination.current_page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => handlePageChange(pagination.current_page + 1)}
              >
                Suivant
              </CPaginationItem>
            </CPagination>
          )}
        </CCardBody>
      </CCard>

      {/* Modal de validation */}
      <CModal visible={showValidateModal} onClose={() => setShowValidateModal(false)}>
        <CModalHeader>
          <CModalTitle>Valider le paiement</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Êtes-vous sûr de vouloir valider ce paiement de{' '}
            <strong>{selectedPayment?.amount?.toLocaleString()} FCFA</strong> ?
          </p>
          <CFormTextarea
            label="Observations (optionnel)"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            rows={3}
            placeholder="Ajouter des observations..."
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowValidateModal(false)}>
            Annuler
          </CButton>
          <CButton color="success" onClick={confirmValidation}>
            Valider
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de rejet */}
      <CModal visible={showRejectModal} onClose={() => setShowRejectModal(false)}>
        <CModalHeader>
          <CModalTitle>Rejeter le paiement</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Pourquoi rejetez-vous ce paiement de{' '}
            <strong>{selectedPayment?.amount?.toLocaleString()} FCFA</strong> ?
          </p>
          <CFormTextarea
            label="Motif de rejet *"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            placeholder="Expliquez le motif du rejet..."
            required
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowRejectModal(false)}>
            Annuler
          </CButton>
          <CButton 
            color="danger" 
            onClick={confirmRejection}
            disabled={!rejectionReason.trim()}
          >
            Rejeter
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de visualisation de quittance */}
      <CModal visible={showReceiptModal} onClose={() => setShowReceiptModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Quittance de paiement</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {receiptUrl && (
            <iframe
              src={receiptUrl}
              width="100%"
              height="600px"
              title="Quittance de paiement"
            />
          )}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Validation