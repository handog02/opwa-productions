import { useEffect, useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { useRouter } from 'next/router'

// bootstrap
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import { useAuthContext } from '../hooks/useAuthContext'

export default function login() {
  const { user } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const { login, isPending, error } = useLogin()

  useEffect(() => {
    if (user != null) {
      router.push('/')
    }
  }, [user])

  const handleSubmit = e => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <Container fluid="xxl">
      <div className="vh-100 main-content text-dark">
        <h2 className="my-5 text-center">
          Welcome to the OpWa Productions Hub.
        </h2>
        <p className="lead text-center">Please login to get started.</p>
        <div className="login mt-5">
          <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="floatingInput" label="Email" className="mb-4">
            <Form.Control
              type="email"
              placeholder="manonlescaut@opwa.com"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              placeholder="d3xgr13uxismybae"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </FloatingLabel>

          <div className="text-center">
            {isPending ? (
              <Button type="submit" className="mt-4" variant="primary" size="lg" disabled>Loading</Button>
            ) : (
              <Button type="submit" className="mt-4" variant="primary" size="lg">Login</Button>
            )}
          </div>
          {error && <p className="text-danger text-center"><small>{error}</small></p>}
          </Form>
        </div>
      </div>
    </Container>
  )
}
