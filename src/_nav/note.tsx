import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilBook,
  cilPeople,
  cilClipboard,
} from '@coreui/icons'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'

const getNoteNavigation = (role: string | null) => {
  const navigation = [
    {
      component: CNavTitle,
      name: 'Notes',
    },
  ]

  // Section Professeur - visible uniquement pour les professeurs
  if (role === 'professeur') {
    navigation.push({
      component: CNavGroup,
      name: 'Professeur',
      to: '/notes/professor',
      icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Mes Classes',
          to: '/notes/professor/dashboard',
        },
      ],
    })
  }

  // Section Administration - visible uniquement pour chef-division
  if (role === 'chef-division') {
    navigation.push(
      {
        component: CNavGroup,
        name: 'Administration',
        to: '/notes/admin',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Dashboard',
            to: '/notes/admin/dashboard',
          },
          {
            component: CNavItem,
            name: 'Consultation Notes',
            to: '/notes/admin/consultation',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Décisions',
        to: '/notes/decisions',
        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Par Semestre',
            to: '/notes/decisions/semester',
          },
          {
            component: CNavItem,
            name: 'Par Année',
            to: '/notes/decisions/year',
          },
        ],
      }
    )
  }

  return navigation
}

export default getNoteNavigation