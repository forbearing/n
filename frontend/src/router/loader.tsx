import { MenuProps } from 'antd'

export interface LayoutDataType {
  menuItems: MenuProps['items']
  breadCrumbMap: Map<string, string[]>
}

export default async function AuthLoader(menuItems: MenuProps['items'], breadCrumbMap: Map<string, string[]>) {
  return {
    menuItems,
    breadCrumbMap,
  }
}
