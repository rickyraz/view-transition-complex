/* eslint-disable react-refresh/only-export-components */

import { Navigate, createFileRoute } from '@tanstack/react-router'

function HomeRedirect() {
  return <Navigate to="/simple" viewTransition replace />
}

export const Route = createFileRoute('/')({
  component: HomeRedirect,
})
