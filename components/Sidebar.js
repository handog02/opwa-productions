import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '../hooks/useUser'

// bootstrap
import Nav from 'react-bootstrap/Nav'

export default function Sidebar() {
  const { userDoc } = useUser()

  const router = useRouter()

  return (
    <Nav className="flex-column pt-4 border-end sidebar sticky-top d-block vh-100 text-dark">
      <Link href="/" passHref>
        <Nav.Link className={
          (router.pathname == "/" ? "active" : "")
        } style={{marginTop: "60px"}}>Dashboard</Nav.Link>
      </Link>
      <Link href="/rehearsals" passHref>
        <Nav.Link className={
          (router.pathname == "/rehearsals" ? "active" : "")
        }>Rehearsals</Nav.Link>
      </Link>

      {userDoc?.producer && (
      <>
        <h5 className="mt-5">Producer Tools</h5>
        <Link href="/producer-tools" passHref>
          <Nav.Link className={
            (router.pathname == "/producer-tools" ? "active" : "")
          }>The Opera</Nav.Link>
        </Link>
        <Link href="/producer-tools/roles" passHref>
          <Nav.Link className={
            (router.pathname == "/producer-tools/roles" ? "active" : "")
          }>Roles</Nav.Link>
        </Link>
        <Link href="/producer-tools/rehearsals" passHref>
          <Nav.Link className={
            (router.pathname == "/producer-tools/rehearsals" ? "active" : "")
          }>Rehearsals</Nav.Link>
        </Link>
        <Link href="/producer-tools/message" passHref>
          <Nav.Link className={
            (router.pathname == "/producer-tools/message" ? "active" : "")
          }>Message</Nav.Link>
        </Link>
      </>
      )}
    </Nav>
  )
}
