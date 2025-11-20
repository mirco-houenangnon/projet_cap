import React from 'react'

const Dashboard = React.lazy(() => import('./Dashboard'))
const Professors = React.lazy(() => import('./Professors'))
const AdminUsers = React.lazy(() => import('./AdminUsers'))

export { Dashboard, Professors, AdminUsers }
