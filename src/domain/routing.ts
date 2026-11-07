import { findConnection, type Connection } from '../data/reference'

export interface RouteHop {
  from: string
  to: string
  connection?: Connection
}

/** CONNECTION: a transfer path is valid only when every hop is a listed edge in asset_connections */
export function validatePath(path: string[]) {
  const hops: RouteHop[] = path.slice(1).map((to, i) => ({ from: path[i], to, connection: findConnection(path[i], to) }))
  return { valid: hops.every((hop) => hop.connection), hops }
}
