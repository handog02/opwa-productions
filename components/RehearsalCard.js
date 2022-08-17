import moment from 'moment'
import { useState } from 'react'
import { useFirestore } from '../hooks/useFirestore'

// bootstrap
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'

export default function RehearsalCard({ rehearsal, producer }) {
  const date = moment(rehearsal.date.toDate()).format('dddd, Do MMM YYYY')

  const [show, setShow] = useState(false)

  const { deleteDocument } = useFirestore('rehearsals')
  const handleDelete = () => {
    deleteDocument(rehearsal.id)
  }

  return (
    <>
      <Col md={6} lg={4} className="my-2">
        <Card>
          <Card.Body>
            <Card.Title>{date}</Card.Title>
            <Card.Text>
              {rehearsal.location}, {rehearsal.start} - {rehearsal.end} <br />
            </Card.Text>
            <div className="mb-3">
              {rehearsal.assignedRoles.map(role => {
                const [roleName] = Object.keys(role)
                return (
                  <Badge pill bg="light m-1" className="text-dark" key={roleName}>{roleName}</Badge>
                )
              })}
            </div>
            <div className="d-flex justify-content-between">
              <Button onClick={() => setShow(true)}>See Details</Button>
              {producer && <Button variant="danger" size="sm" onClick={() => handleDelete()}>Delete</Button>}
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Modal size="lg" aria-labelled-by="rehearsal-details-modal" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title id="rehearsal-details-modal">{date}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">{rehearsal.location}, {rehearsal.start} - {rehearsal.end}</p>
          <p className="content">{rehearsal.desc}</p>
          {rehearsal.assignedRoles.map(role => {
            const [roleName] = Object.keys(role)
            return (
              <Badge pill bg="light m-1" className="text-dark" key={roleName}>{roleName}</Badge>
            )
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
