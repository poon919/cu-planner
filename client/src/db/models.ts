import { DBSchema } from 'idb'

import { Preset } from '../models'

export interface AppDBSchema extends DBSchema {
  preset: {
    key: number
    value: Preset
  }
}
