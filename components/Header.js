import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { useState } from 'react'
import { useUser } from '../hooks/useUser'

// bootstrap
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import { List } from 'react-bootstrap-icons'
import Offcanvas from 'react-bootstrap/Offcanvas'
import ListGroup from 'react-bootstrap/ListGroup'

export default function Header() {
  const [show, setShow] = useState(false)

  const { user } = useAuthContext()
  const { userDoc } = useUser()

  const router = useRouter()

  const { logout, isPending } = useLogout()

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  return (
    <>
      <Navbar bg="primary" fixed="top">
        <Container fluid="xxl">
          {user && (
            <Button onClick={handleShow} className="d-sm-none"><List size={30} className="text-light" /></Button>
          )}
          <Navbar.Brand className="me-auto">
            <span className="fw-bold text-light h3">
              OpWa <span className="d-none d-sm-inline">Productions</span>
            </span>
          </Navbar.Brand>
          <Nav className="ms-auto">
            {!user && (
            <Link href="/login" passHref>
              <Nav.Link 
                className={
                (router.pathname == "/login" ? "active" : "") + " text-light"
                }
              >Login</Nav.Link>
            </Link>)
            }
            {!user && (
              <Link href="/signup" passHref>
                <Nav.Link 
                  className={
                  (router.pathname == "/signup" ? "active" : "") + " text-light"
                }>Signup</Nav.Link>
              </Link>
            )}

            {user && (isPending ? (
              <Button variant="light" className="text-primary ms-md-2" disabled>Loading</Button>
            ) : (
              <Button variant="light" className="text-primary ms-md-2" onClick={logout}>Logout</Button>
            ))}
          </Nav>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} className="bg-light text-primary">
        <Offcanvas.Header>
          <Offcanvas.Title><span className="h2 text-dark">Menu</span></Offcanvas.Title>
        </Offcanvas.Header>

        <ListGroup variant="flush" className="nav-list-group mt-3">
          <ListGroup.Item>
            <Link href="/" passHref>
              <a onClick={handleClose} className="mobile-nav-link">Dashboard</a>
            </Link>
          </ListGroup.Item>
          <ListGroup.Item>
            <Link href="/rehearsals" passHref>
              <a onClick={handleClose} className="mobile-nav-link">Rehearsals</a>
            </Link>
          </ListGroup.Item>

          {userDoc?.producer && (
            <>
              <h2 className="text-dark my-4 ms-3">Producer Tools</h2>

              <ListGroup.Item>
                <Link href="/producer-tools" passHref>
                  <a onClick={handleClose} className="mobile-nav-link">The Opera</a>
                </Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <Link href="/producer-tools/roles" passHref>
                  <a onClick={handleClose} className="mobile-nav-link">Roles</a>
                </Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <Link href="/producer-tools/rehearsals" passHref>
                  <a onClick={handleClose} className="mobile-nav-link">Rehearsals</a>
                </Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <Link href="/producer-tools/message" passHref>
                  <a onClick={handleClose} className="mobile-nav-link">Message</a>
                </Link>
              </ListGroup.Item>
            </>
          )}

        </ListGroup>
      </Offcanvas>
    </>
  )
}
