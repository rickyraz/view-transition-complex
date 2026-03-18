import { createFileRoute } from '@tanstack/react-router'
import { SimpleRoute } from '../App'

export const Route = createFileRoute('/simple')({
  component: SimpleRoute,
})
