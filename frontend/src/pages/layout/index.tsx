import { TabNavigator } from '@/components/tab-navigator/tab-navigator'
import { layoutSlice, StoreType } from '@/store'
import { cn } from '@/utils/utils'
import { Dispatch } from '@reduxjs/toolkit'
import { Avatar, Button, Card, Dropdown, Layout, Menu, MenuProps, message, Typography } from 'antd'
import { Footer } from 'antd/es/layout/layout'
import _, { now } from 'lodash'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import {
  AiOutlineDashboard,
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineOrderedList,
  AiOutlineSetting,
  AiOutlineUser,
} from 'react-icons/ai'
import { GrHost, GrUserAdmin } from 'react-icons/gr'
import { LuShieldAlert } from 'react-icons/lu'
import { MdOutlineDns } from 'react-icons/md'
import { RiAppsLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout
const heightHeader = 64
const heightFooter = 40

const App: React.FC = () => {
  const navigate = useNavigate()

  const dispatch: Dispatch<any> = useDispatch()
  const [height, setHeight] = useState(0) // 浏览器高度

  const { setWindow, setHeader, setFooter, setOpenKeys, setCollapsed } = layoutSlice.actions
  const { collapsed, openKeys } = useSelector((state: StoreType) => state.layout)

  const resizeUpdate = () => {
    // 通过事件对象获取浏览器窗口的高度
    const height = window.innerHeight
    setHeight(height)
    const width = window.innerWidth
    // setWidth(width)
    console.log({ height, width })
    if (width < 768) {
      // 如果宽度太小了,直接折自动折叠菜单
      dispatch(setCollapsed(true))
    }
    dispatch(setWindow({ height, width })) // 将布局的高度和宽度写入 redux 中
  }
  const updateWindow = _.debounce(resizeUpdate, 50)

  useLayoutEffect(() => {
    const h = window.innerHeight
    setHeight(h)
    // let w = window.innerWidth
    // setWidth(w)
    window.addEventListener('resize', updateWindow) // 调整窗口大小事件
    window.addEventListener('focus', updateWindow) // 聚焦窗口事件
    // window.addEventListener('visibilitychange', updateWindow)
    return () => {
      window.removeEventListener('resize', updateWindow)
      window.removeEventListener('focus', updateWindow)
      // window.removeEventListener('visibilitych;ange', updateWindow)
    }
  }, [])

  useEffect(() => {
    dispatch(setHeader({ height: heightHeader }))
    dispatch(setFooter({ height: heightFooter }))
  }, [])

  return (
    <Layout className="h-full">
      {/* 左边 */}
      <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={50} width={180} theme="light">
        <div className="flex w-full items-center justify-center">
          <img src="/logo.svg" alt="" className="mx-1 my-3 w-12" />
          <p className={cn('text-2xl font-bold leading-normal text-[rgb(0,110,249)]', { hidden: collapsed })}>Neubla</p>
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['home']}
          openKeys={openKeys}
          onOpenChange={(keys) => dispatch(setOpenKeys(keys))}
          items={menuItems}
          onClick={(item) => navigate(item.key)}
          className="h-full overflow-x-hidden overflow-y-scroll"
        />
      </Sider>

      {/* 右侧 */}
      <Layout>
        <Header
          className="flex bg-white p-0"
          style={{
            height: heightHeader,
          }}
        >
          <div className="flex w-full">
            <div className="basis-5/6">
              <Button
                type="text"
                icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
                onClick={() => dispatch(setCollapsed(!collapsed))}
                className="h-auto w-[30px]"
              />
              <TabNavigator />
            </div>
            <div className="flex basis-1/6">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'userinfo',
                      label: '个人信息',
                      icon: <AiOutlineUser />,
                      onClick: () => message.info('个人信息'),
                    },
                    {
                      key: 'logout',
                      label: '退出登录',
                      icon: <AiOutlineLogout />,
                      onClick: () => message.info('退出登录'),
                    },
                  ],
                  triggerSubMenuAction: 'click',
                }}
              >
                <div className="ml-auto mr-2">
                  {/* <Avatar src="https://api.dicebear.com/7.x/micah/svg?seed=admin" /> */}
                  {/* <Avatar src="https://ui-avatars.com/api/?name=Tom+Smith&background=random" /> */}
                  <Avatar src="https://ui-avatars.com/api/?name=Lucy&color=fff&background=0D8ABC" />
                  {/* <Avatar src="https://robohash.org/tom.png?set=set" /> */}
                  {/* <Avatar src="https://robohash.org/lucy.png?set=set2" /> */}
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content className="flex">
          {/* 需要在这里设置 body height 为 100% 否则 not found 页面会因为父容器没有高度无法居中 */}
          <Card className="m-1 w-full flex-1" styles={{ body: { padding: '15px 15px', height: '100%' } }}>
            <Outlet />
          </Card>
        </Content>
        <Footer className="flex items-center justify-center bg-white font-bold" style={{ height: heightFooter }}>
          <div>{heightFooter > 0 && `Nebula©${new Date().getFullYear()}`}</div>
          <Typography.Link className="ml-2" onClick={() => window.open('')}>
            联系管理员
          </Typography.Link>
        </Footer>
      </Layout>
    </Layout>
  )
}
const menuItems: MenuProps['items'] = [
  {
    key: 'home',
    // icon: <TiThLargeOutline />,
    icon: <RiAppsLine />,
    label: '入口导航',
    // children: [
    //   {
    //     key: 'qiliao',
    //     label: '起聊',
    //     icon: <RiApps2Line />,
    //   },
    //   {
    //     key: 'wangwang',
    //     label: '旺旺',
    //     icon: <RiAppsLine />,
    //   },
    // ],
  },
  {
    key: 'dashboard',
    icon: <AiOutlineDashboard />,
    label: '仪表盘',
  },
  {
    key: 'cmdb',
    icon: <AiOutlineOrderedList />,
    label: '资产管理',
    children: [
      {
        key: 'cmdb/machine',
        label: '主机管理',
        icon: <GrHost />,
      },
      {
        key: 'cmdb/dns',
        label: '域名解析',
        icon: <MdOutlineDns />,
      },
    ],
  },
  {
    key: 'system',
    icon: <AiOutlineSetting />,
    label: '系统管理',
    children: [
      {
        key: 'role',
        icon: <GrUserAdmin />,
        label: '角色管理',
      },
      {
        key: 'permission',
        icon: <LuShieldAlert />,
        label: '权限管理',
      },
    ],
  },
]

export default App
