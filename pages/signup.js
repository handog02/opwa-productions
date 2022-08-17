import { useState, useEffect } from 'react'
import { useSignup } from '../hooks/useSignup'
import { useAuthContext } from '../hooks/useAuthContext'
import { useRouter } from 'next/router'

// bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

export default function Signup() {
  const { user } = useAuthContext()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { signup, error, isPending } = useSignup()

  const router = useRouter()

  useEffect(() => {
    if (user != null) {
      router.push('/')
    }
  }, [user])

  const handleSubmit = (e) => {

    if (email !== confirmEmail || password !== confirmPassword || password.length < 6) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      e.preventDefault()
      signup(firstName, lastName, email, password)
    }

  }

  return (
    <Container fluid="xxl">
      <div className="signup vh-100 main-content text-dark">
        <h2 className="my-5 text-center">Sign up</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Manon"
                  onChange={e => setFirstName(e.target.value)}
                  value={firstName}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Lescaut"
                  onChange={e => setLastName(e.target.value)}
                  value={lastName}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mt-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="manonlescaut@opwa.com"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
            <Form.Text>
              Please use your university email if possible.
            </Form.Text>
            <Form.Control.Feedback type="invalid">Please enter a valid email</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Confirm email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="manonlescaut@opwa.com"
              onChange={e => setConfirmEmail(e.target.value)}
              value={confirmEmail}
            />
            {confirmEmail && (
              email === confirmEmail ? (
                <Form.Text className="text-success">
                  Emails match!
                </Form.Text>
              ) : (
                <Form.Text className="text-danger">
                  Emails do not match!
                </Form.Text>
              )
            )}
          </Form.Group>

          <Form.Group className="mt-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="d3sgr13uxismybae"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
            {password && (
              password.length >= 6 ? (
                <Form.Text className="text-success">
                  Password okay!
                </Form.Text>
              ) : (
                <Form.Text className="text-danger">
                Password must be at least 6 characters long!
                </Form.Text>
              )
            )}
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="d3sgr13uxismybae"
              onChange={e => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            {confirmPassword && (
              password === confirmPassword ? (
                <Form.Text className="text-success">
                  Passwords match!
                </Form.Text>
              ) : (
                <Form.Text className="text-danger">
                  Passwords do not match!
                </Form.Text>
              )
            )}
          </Form.Group>

          <div className="text-center">
            {isPending ? (
              <Button type="submit" className="mt-4" variant="primary" size="lg" disabled>Loading</Button>
            ) : (
              <Button type="submit" className="mt-4" variant="primary" size="lg">Sign up</Button>
            )}
          </div>
          {error && <p className="text-danger text-center"><small>{error}</small></p>}
        </Form>
      </div>
    </Container>
  )
}
