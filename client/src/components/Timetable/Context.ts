import { createContext } from 'react'

import { ContextProps } from './interfaces'

const TableContext = createContext<ContextProps>(undefined!)

export default TableContext
