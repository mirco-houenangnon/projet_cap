import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilMoney,
  cilHistory,
  cilCheckCircle,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const financeNavigation = [
  {
    component: CNavTitle,
    name: 'Finance',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/finance/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tarifs',
    to: '/finance/tarifs',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Historique',
    to: '/finance/historique',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Validation',
    to: '/finance/validation',
    icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
  },
]

export default financeNavigation