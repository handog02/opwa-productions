import { useAuthContext } from '../hooks/useAuthContext'

// components
import Header from './Header'
import SidebarLayout from './SidebarLayout'

export default function Layout({ children }) {
  const { user, authIsReady } = useAuthContext()

  return authIsReady && (
    <div className="bg-light">
      <Header />
      {user && (
        <SidebarLayout>
          <main>{children}</main>
        </SidebarLayout>
      )}
      {!user && <main>{children}</main>}
    </div>
  )
}
