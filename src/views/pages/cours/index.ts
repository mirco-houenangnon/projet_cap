import React from 'react'

const Dashboard = React.lazy(() => import('./Dashboard'))
const TeachingUnits = React.lazy(() => import('./TeachingUnits'))
const CourseElements = React.lazy(() => import('./CourseElements'))
const CourseElementProfessors = React.lazy(() => import('./CourseElementProfessors'))
const CourseResources = React.lazy(() => import('./CourseResources'))
const Programs = React.lazy(() => import('./Programs'))

export { Dashboard, TeachingUnits, CourseElements, CourseElementProfessors, CourseResources, Programs }
