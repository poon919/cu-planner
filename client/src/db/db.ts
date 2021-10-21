// TODO: Remove this temporary fix.
// Related issue: https://github.com/jakearchibald/idb/issues/227
import idbReady from 'safari-14-idb-fix'
import { openDB, IDBPDatabase } from 'idb'

import { AppDBSchema } from './models'

let db: AppDB | null = null

const initDB = () => idbReady().then(() => openDB<AppDBSchema>('app-db', 1, {
  upgrade(_db) {
    _db.createObjectStore('preset', { keyPath: 'id', autoIncrement: true })
  },
}))

/**
 * Helper function for typed add/put transaction
 * as IDBPDatabase type does not support primary key with autoIncrement option.
 *
 * issue: TypeScript: special case for auto-incrementing primary keys?
 * https://github.com/jakearchibald/idb/issues/150
 */
export const autoIncPK = <PK extends keyof any, T extends object>(
  _: PK, // eslint-disable-line @typescript-eslint/no-unused-vars
  value: T,
) => value as (T & { [K in PK]: number })

export type AppDB = IDBPDatabase<AppDBSchema>

export const getAppDB = async () => {
  if (db === null) {
    db = await initDB()
  }
  return db
}
