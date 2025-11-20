import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilBook,
  cilBookmark,
  cilFolder,
  cilCalendar,
  cilLink,
  cilInfo,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const coursNavigation = [
  {
    component: CNavTitle,
    name: 'Cours',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/cours/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Unités d\'Enseignement',
    to: '/cours/teaching-units',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Éléments de Cours (ECUE)',
    to: '/cours/course-elements',
    icon: <CIcon icon={cilBookmark} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Ressources Pédagogiques',
    to: '/cours/course-resources',
    icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Associations Matière-Professeur',
    to: '/cours/course-element-professors',
    icon: <CIcon icon={cilLink} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Programmes de Cours',
    to: '/cours/programs',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manuel d\'Utilisation',
    to: '/cours/user-guide',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
]

export default coursNavigation