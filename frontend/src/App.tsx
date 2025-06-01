import Router from '@/router'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import './App.css'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider
          locale={zhCN}
          theme={{
            components: {
              Menu: {
                activeBarBorderWidth: 0, // 菜单没有边框
              },
            },
          }}
        >
          <Router />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
