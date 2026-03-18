import { createFileRoute } from '@tanstack/react-router'
import { EdgeRoute } from '../App'

export const Route = createFileRoute('/edge')({
  component: EdgeRoute,
})
