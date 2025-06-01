import Home from '@/pages/home'
import Layout from '@/pages/layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PAGE_CMDB_DNS, PAGE_CMDB_MACHINE, PAGE_DASHBOARD, PAGE_DEBUG, PAGE_HOME, PAGE_LOGIN } from '@/types/page'
import Dashboard from '@/pages/dashboard'
import Login from '@/pages/login'
import Debug from '@/pages/debug'
import Machine from '@/pages/cmdb/machine'
import Page403 from '@/pages/403'
import DNS from '@/pages/cmdb/dns'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PAGE_LOGIN} element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={PAGE_HOME} element={<Home />} />
          <Route path={PAGE_DASHBOARD} element={<Dashboard />} />
          <Route path={PAGE_DEBUG} element={<Debug />} />
          <Route path={PAGE_CMDB_MACHINE} element={<Machine />} />
          <Route path={PAGE_CMDB_DNS} element={<DNS />} />
          <Route path="*" element={<Page403 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
