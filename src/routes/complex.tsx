import { createFileRoute } from '@tanstack/react-router'
import { ComplexRoute } from '../App'

export const Route = createFileRoute('/complex')({
  component: ComplexRoute,
})
