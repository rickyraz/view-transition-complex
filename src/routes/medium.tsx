import { createFileRoute } from '@tanstack/react-router'
import { MediumRoute } from '../App'

export const Route = createFileRoute('/medium')({
  component: MediumRoute,
})
