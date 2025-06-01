import { TableColumn } from '@/types/interfaces'
import { clsx, type ClassValue } from 'clsx'
import _ from 'lodash'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function columnByKey(columnsData: TableColumn[], key: string): TableColumn {
  const cloned = _.cloneDeep(columnsData)
  let column: TableColumn = {} as any
  for (const c of cloned) {
    if (c.key === key) {
      column = c
      break
    }
  }
  return column
}

export function combineSearch(fields: string[]): string {
  return _.uniq(fields)
    .filter((item) => item?.length > 0)
    .join(',')
}
