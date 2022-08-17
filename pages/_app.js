import SSRProvider from 'react-bootstrap/SSRProvider'
import { AuthContextProvider } from '../context/AuthContext'

// styles
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../sass/main.scss'

// components
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {

  return (
    <SSRProvider>
      <AuthContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </AuthContextProvider>
    </SSRProvider>
  )
}

export default MyApp
