// bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// components
import Sidebar from './Sidebar'

export default function SidebarLayout({ children }) {
  return (
    <Container fluid="xxl" className="vh-100">
      <Row>
        <Col xs="3" lg="2" className="d-none d-sm-block"><Sidebar /></Col>
        <Col className="main-content">{children}</Col>
      </Row>
    </Container>
  )
}
