import { useEffect, useState } from 'react'
import Select from 'react-select'
import { setCollection } from '../hooks/setCollection'
import { Timestamp } from 'firebase/firestore'
import { useFirestore } from '../hooks/useFirestore'
import moment from 'moment'

// bootstrap
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

const getWeekNumber = (date) => {
  const startDate = startDate = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil(days / 7)
  return weekNumber
}

export default function AddRehearsal({ termOne, termTwo, termThree }) {
  const [show, setShow] = useState(false)
  const [error, setError] = useState(null)

  const [date, setDate] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [location, setLocation] = useState('')
  const [desc, setDesc] = useState('')
  const [roles, setRoles] = useState(null)
  const [assigned, setAssigned] = useState([])

  const { documents } = setCollection('opera')
  const { addDocument, response } = useFirestore('rehearsals')

  useEffect(() => {
    if (documents) {
      const soloRoles = documents[0].solos.map(solo => {
        const [roleName] = Object.keys(solo)
        return roleName
      })
      const groupRoles = documents[0].groups.map(group => {
        const [roleName] = Object.keys(group)
        return roleName
      })
      const labelOptions = soloRoles.concat(groupRoles)
      const valueOptions = documents[0].solos.concat(documents[0].groups)
      const roleOptions = labelOptions.map((option, index) => {
        return { label: option, value: valueOptions[index] }
      })
      setRoles(roleOptions)
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const rehearsalDate = moment(`${date} ${start}`, 'YYYY-MM-DD hh:mm').toDate()
    const term1 = new Date(termOne)
    const term2 = new Date(termTwo)
    const term3 = new Date(termThree)

    const rehearsalWeek = getWeekNumber(rehearsalDate)
    const term1Week = getWeekNumber(term1)
    const term2Week = getWeekNumber(term2)
    const term3Week = getWeekNumber(term3)
    
    let term = 0
    let week = 0

    if (term1 <= rehearsalDate && rehearsalDate < term2) {
      term = 1
      week = rehearsalWeek - term1Week + 1
    }
    if (term2 <= rehearsalDate && rehearsalDate < term3) {
      term = 2
      week = rehearsalWeek - term2Week + 1
    }
    if (term3 <= rehearsalDate) {
      term = 3
      week = rehearsalWeek - term3Week + 1
    }
    if (rehearsalDate < term1 || week > 10 || week < 1) {
      setError('Please check your dates!')
      e.stopPropagation()
    } else {
      const assignedRoles = assigned.map(role => role.value)

      const rehearsal = {
        date: Timestamp.fromDate(rehearsalDate),
        term,
        week,
        start,
        end,
        location,
        assignedRoles,
        desc
      }

      await addDocument(rehearsal)
      if (!response.error) {
        setDate('')
        setStart('')
        setEnd('')
        setLocation('')
        setDesc('')
        setAssigned([])
        setShow(false)
      }
    }

  }

  return (
    <>
      <h2 className="mt-5 text-center">Rehearsal List</h2>
      <div className="mt-4 text-center">
        <Button variant="primary" onClick={() => setShow(true)}>Add Rehearsal</Button>
      </div>

      <Modal show={show} size="lg" backdrop="static" keyboard={false} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Rehearsal</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>          
            <Form.Group controlId="rehearsalDate">
              <Form.Label>Date:</Form.Label>
              <Form.Control required type="date" onChange={e => setDate(e.target.value)} value={date} />
            </Form.Group>

            <Row className="mt-4">
              <Col>
                <Form.Group controlId="rehearsalStart">
                  <Form.Label>Start Time:</Form.Label>
                  <Form.Control required type="time" onChange={e => setStart(e.target.value)} value={start} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="rehearsalEnd">
                  <Form.Label>End Time:</Form.Label>
                  <Form.Control required type="time" onChange={e => setEnd(e.target.value)} value={end} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="rehearsalLocation" className="mt-4">
              <Form.Label>Location:</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Ensemble Room"
                onChange={e => setLocation(e.target.value)}
                value={location}
                required
              />
            </Form.Group>

            <Form.Group controlId="rehearsalDescription" className="mt-4">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="e.g. which scenes we are doing"
                onChange={e => setDesc(e.target.value)}
                value={desc}
                required
                rows={5}
              />
            </Form.Group>

            <Form.Group controlId="rehearsalDescription" className="mt-4">
              <Form.Label>Assign cast:</Form.Label>
              <Select
                isMulti
                options={roles}
                onChange={options => setAssigned(options)}
              />
            </Form.Group>          
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
            {response.error && <p className="text-danger">Could not upload the data</p>}
            {error && <p className="text-danger">{error}</p>}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
