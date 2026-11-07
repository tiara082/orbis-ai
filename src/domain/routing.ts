import { findConnection, type Connection } from '../data/reference'
import type { CatalogData } from '../data/catalog/types'

export interface RouteHop {
  from: string
  to: string
  connection?: Connection
}

/** CONNECTION: a transfer path is valid only when every hop is a listed edge in asset_connections */
export function validatePath(path: string[], catalog?: CatalogData) {
  const connection = (source: string, destination: string) => catalog
    ? catalog.connections.find((item) => item.source === source && item.destination === destination)
    : findConnection(source, destination)
  const hops: RouteHop[] = path.slice(1).map((to, i) => ({ from: path[i], to, connection: connection(path[i], to) }))
  return { valid: hops.every((hop) => hop.connection), hops }
}
