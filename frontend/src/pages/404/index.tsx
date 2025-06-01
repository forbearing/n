import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Page404() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-3">
      <p className="animate-pulse text-5xl font-bold">404</p>
      <p className="text-lg text-gray-500">Oops! Page not found.</p>
      <Button type="text" variant="filled" onClick={() => navigate('/')}>
        Go back home
      </Button>
    </div>
  )
}
