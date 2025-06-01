import { App } from '@/types/interfaces'
import { Button, Card, Col, Divider, Input, Row, Space, Tabs, TabsProps, Tag } from 'antd'
import { useRef, useState } from 'react'
import { AiOutlinePlus, AiOutlineSetting } from 'react-icons/ai'
import { AppCard, AppCol, AppForm } from './components'
import { ToolsHeader } from '@/components/tools-header'

const Home = () => {
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)

  const [currentApp, setCurrentApp] = useState<App | null>()

  const createApp = (app: App) => {
    console.log('create app: ', app)
  }
  const updateApp = (app: App) => {
    console.log('update app: ', app)
  }

  const tabItems: TabsProps['items'] = [
    { key: 'all', label: '全部应用' },
    { key: 'qiliao', label: '起聊' },
    { key: 'wangwang', label: '旺旺' },
    { key: 'plugins', label: '插件' },
    { key: 'dns', label: 'DNS' },
    { key: 'live', label: '直播' },
    { key: 'third', label: '三方' },
  ]
  const refreshRef = useRef<HTMLElement>(null)

  // <Tabs.TabPane tab="全部应用" key="all" />
  // <Tabs.TabPane tab="旺旺" key="wangwang" />
  // <Tabs.TabPane tab="起聊" key="qiliao" />
  // <Tabs.TabPane tab="插件" key="plugins" />
  // <Tabs.TabPane tab="DNS" key="dns" />
  // <Tabs.TabPane tab="直播" key="live" />
  // <Tabs.TabPane tab="三方" key="third" />

  // 处理应用图标点击
  const handleAppClick = (appKey: any) => {
    // 可以导航到特定应用的路由
    // navigate(`/app/${appKey}`);
    console.log(`Clicked on app: ${appKey}`)
  }

  // 处理功能标签点击
  const handleFeatureClick = (env: string, feature?: string) => {
    // 可以导航到特定功能的路由
    // navigate(`/${env}/${feature}`);
    console.log(`Clicked on feature: ${feature} in environment: ${env}`)
  }

  return (
    <div>
      {/* 顶部搜索和操作区 */}
      <div className="flex items-center justify-between">
        <Input.Search placeholder="搜索应用" style={{ width: 300 }} enterButton enterKeyHint="search" />
        <Space>
          <Button type="primary" icon={<AiOutlinePlus />} onClick={() => setOpenCreate(true)}>
            创建应用
          </Button>
          <Button icon={<AiOutlineSetting />}>设置</Button>
          <ToolsHeader
            refreshRef={refreshRef}
            handleRefresh={() => {}}
            handleImport={{ api: '/api', callback: () => {} }}
          />
        </Space>
      </div>

      <Divider />

      {/* 应用图标区域 */}
      <div style={{ marginTop: 16, marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <AppCol>
            <AppCard name="旺旺-prod" backgroundColor="#1677ff" onClick={() => handleAppClick('wangwang')} />
          </AppCol>
          <AppCol>
            <AppCard name="起聊-prod" backgroundColor="#1890ff" onClick={() => handleAppClick('qiliao')} />
          </AppCol>
          <AppCol>
            <AppCard name="堡垒机-prod" backgroundColor="#52c41a" onClick={() => handleAppClick('jumpserver')} />
          </AppCol>
          <AppCol>
            <AppCard
              shortName="+"
              name="添加应用"
              backgroundColor="#f0f0f0"
              color="#999"
              onClick={() => handleAppClick('addApp')}
            />
          </AppCol>
        </Row>
      </div>

      {/* 标签页导航 */}
      <Tabs defaultActiveKey="all" items={tabItems}></Tabs>

      {/* 环境卡片区域 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} md={8}>
          <Card
            title="开发测试环境-dev"
            styles={{
              header: { background: '#f90', color: '#fff' },
              body: { padding: '12px' },
            }}
          >
            <Space wrap>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'portal')}>
                【门户】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'admin')}>
                【后台管理】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'asset')}>
                【资产管理】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'bastion')}>
                【堡垒机】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'git')}>
                【Git仓库】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'jenkins')}>
                【Jenkins】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'maven')}>
                【Maven】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'dns')}>
                【DNS】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'deploy')}>
                【发布流程】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('dev', 'log')}>
                【查看日记】
              </Tag>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title="预发环境-pre"
            styles={{
              header: { background: '#39c', color: '#fff' },
              body: { padding: '12px' },
            }}
          >
            <Space wrap>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'portal')}>
                【门户】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'admin')}>
                【后台管理】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'asset')}>
                【资产管理】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'bastion')}>
                【堡垒机】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'git')}>
                【Git仓库】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'jenkins')}>
                【Jenkins】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'maven')}>
                【Maven】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'dns')}>
                【DNS】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'deploy')}>
                【发布流程】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'log')}>
                【查看日记】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'proxy')}>
                【代理服务器】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'monitor')}>
                【业务监天管理】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'alert')}>
                【消息队列配置】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('pre', 'robot')}>
                【聊天机器人设置】
              </Tag>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title="生产环境-prod"
            styles={{
              header: { background: '#6c3', color: '#fff' },
              body: { padding: '12px' },
            }}
          >
            <Space wrap>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'portal')}>
                【门户】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'admin')}>
                【后台管理】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'asset')}>
                【资产管理】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'bastion')}>
                【堡垒机】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'dns')}>
                【DNS】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'git')}>
                【Git仓库】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'jenkins')}>
                【Jenkins】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'maven')}>
                【Maven】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'deploy')}>
                【发布流程】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'log')}>
                【查看日记】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'monitor')}>
                【监控告警】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'proxy')}>
                【代理服务器】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'business')}>
                【业务勋天管理】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'alert')}>
                【消息队列配置】
              </Tag>
              <Tag color="default" onClick={() => handleFeatureClick('prod', 'robot')}>
                【聊天机器人设置】
              </Tag>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 版本信息 */}
      <div style={{ marginTop: 24, textAlign: 'right', color: '#999', fontSize: 12 }}>Version v1.0.0 Nebula-Cmdb</div>

      <AppForm
        open={openCreate}
        onOk={() => setOpenCreate(false)}
        onCancel={() => setOpenCreate(false)}
        action="create"
        onFinish={createApp}
      />
      <AppForm
        open={openUpdate}
        onOk={() => setOpenUpdate(false)}
        onCancel={() => setOpenUpdate(false)}
        action="update"
        onFinish={updateApp}
      />
    </div>
  )
}

export default Home
