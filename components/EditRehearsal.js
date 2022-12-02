import { useState, useEffect } from 'react'
import Select from 'react-select'
import { useFirestore } from '../hooks/useFirestore'
import { setCollection } from '../hooks/setCollection'
import { Timestamp } from 'firebase/firestore'
import moment from 'moment'

// bootstrap
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil(days / 7)
  return weekNumber
}

export default function EditRehearsal({ rehearsal, edit, setEdit, termOne, termTwo, termThree }) {
  const { updateDocument, response } = useFirestore('rehearsals')
  const { documents } = setCollection('opera')

  const [error, setError] = useState(null)

  const [date, setDate] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [location, setLocation] = useState('')
  const [desc, setDesc] = useState('')
  const [roles, setRoles] = useState([])
  const [assigned, setAssigned] = useState([])

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

    if (rehearsal) {
      setDate(rehearsal.date.toDate().toISOString().slice(0, 10))
      setStart(rehearsal.start)
      setEnd(rehearsal.end)
      setLocation(rehearsal.location)
      setDesc(rehearsal.desc)
    }
  }, [documents, rehearsal])

  const defaultRoles = roles.filter(role => {
    const roleName = role.label
    const found = rehearsal.assignedRoles.find(r => {
      if (r[roleName] || r[roleName] === '') {
        return true
      }
      return false
    })
    return found
  })

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

      let rehearsalNew = {
        date: Timestamp.fromDate(rehearsalDate),
        term,
        week,
        start,
        end,
        location,
        desc
      }

      if (assignedRoles.length) {
        rehearsalNew = { ...rehearsalNew, assignedRoles }
      }

      await updateDocument(rehearsalNew, rehearsal.id)
      if (!response.error) {
        setEdit(false)
      }
    }

  }

  return (
    <Modal show={edit} size="lg" backdrop="static" keyboard={false} onHide={() => setEdit(false)}>
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
              required
              value={location}
            />
          </Form.Group>

          <Form.Group controlId="rehearsalDescription" className="mt-4">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="e.g. which scenes we are doing"
              onChange={e => setDesc(e.target.value)}
              required
              rows={5}
              value={desc}
            />
          </Form.Group>

          <Form.Group controlId="rehearsalDescription" className="mt-4">
            <Form.Label>Assign cast:</Form.Label>
            <Select
              isMulti
              options={roles}
              onChange={options => setAssigned(options)}
              defaultValue={defaultRoles}
            />
          </Form.Group>          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
          {response.error && <p className="text-danger">Could not upload the data</p>}
          {error && <p className="text-danger">{error}</p>}
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
