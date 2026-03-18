import { createFileRoute } from '@tanstack/react-router'
import { ConcurrentStoresRoute } from '../App'

export const Route = createFileRoute('/concurrent-stores')({
  component: ConcurrentStoresRoute,
})
