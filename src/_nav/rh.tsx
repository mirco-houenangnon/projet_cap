import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,
  cilPeople,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const rhNavigation = [
  {
    component: CNavTitle,
    name: 'Ressources Humaines',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/rh/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Professeurs',
    to: '/rh/professors',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Utilisateurs Admin',
    to: '/rh/admin-users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
]

export default rhNavigation