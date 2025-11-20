import RhService from './rh.service'

// Re-export RH service methods for admin users
const AdminUserService = {
  getAdminUsers: RhService.getAdminUsers,
  getAdminUser: RhService.getAdminUser,
  createAdminUser: RhService.createAdminUser,
  updateAdminUser: RhService.updateAdminUser,
  deleteAdminUser: RhService.deleteAdminUser,
  getRoles: RhService.getRoles,
  getProfessors: RhService.getProfessors,
  createProfessor: RhService.createProfessor,
  getStatistics: RhService.getStatistics,
}

export default AdminUserService