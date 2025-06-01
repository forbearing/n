import { XLSImporter } from '@/components/xls-importer'

export default function App() {
  return (
    <div>
      <XLSImporter uploadUrl="http://localhost:8080/api/cmdb/dns/import" />
    </div>
  )
}
