import { useAuthContext } from '../../hooks/useAuthContext'
import { useRedirectProd } from '../../hooks/useRedirectProd'
import { useEffect, useRef, useState } from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { setCollection } from '../../hooks/setCollection'

// bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import { Trash } from 'react-bootstrap-icons'

export default function Index() {
  useRedirectProd()

  // context and state
  const { user } = useAuthContext()
  const [opera, setOpera] = useState('')
  const [composer, setComposer] = useState('')
  const [solos, setSolos] = useState([])
  const [groups, setGroups] = useState([])
  const [newChorus, setNewChorus] = useState([])
  const [newRole, setNewRole] = useState('')
  const roleInput = useRef(null)
  const chorusInput = useRef(null)
  const [synopsis, setSynopsis] = useState([])
 
  // firestore stuff
  const { updateDocument, setDocument, response } = useFirestore('opera')
  const { updateDocument: updateRehearsal, response: rehearsalResponse } = useFirestore('rehearsals')

  const { documents } = setCollection('opera')
  const { documents: rehearsals } = setCollection('rehearsals')

  // set state based on what's on firestore
  useEffect(() => {
    if (documents) {
      setOpera(documents[0].opera)
      setComposer(documents[0].composer)
      setSynopsis(documents[0].synopsis)
      setSolos(documents[0].solos)
      setGroups(documents[0].groups)
    }
  }, [documents])

  const handleAddRole = (e) => {
    e.preventDefault()
    const role = newRole.trim()

    if (role && !(solos.map(solo => {
        const [key] = Object.keys(solo)
        return key
      }).includes(role))) {
      setSolos(prevSolos => {
        return [...prevSolos, {[role]: ''}]
      })
    }

    console.log(solos)

    setNewRole('')
    roleInput.current.focus()
  }

  const handleAddChorus = (e) => {
    e.preventDefault()
    const chorus = newChorus.trim()

    if (chorus && !(groups.map(group => {
        const [key] = Object.keys(group)
        return key
      }).includes(chorus))) {
      setGroups(prevChoruses => {
        return [...prevChoruses, {[chorus]: []}]
      })
    }

    setNewChorus('')
    chorusInput.current.focus()
  }

  const handleAddAct = () => {
    setSynopsis([...synopsis, ''])
  }

  const handleSubmit = () => {
    updateDocument({ opera, composer, synopsis, solos, groups }, 'opera')

    const compSolos = solos.map(s => {
      const [name] = Object.keys(s)
      return name
    })
    const compGroups = groups.map(s => {
      const [name] = Object.keys(s)
      return name
    })
    const allRoles = compSolos.concat(compGroups)

    rehearsals.forEach(rehearsal => {
      const filtered = rehearsal.assignedRoles.filter(roleObj => {
        const [role] = Object.keys(roleObj)        
        console.log(allRoles, role)
        return allRoles.includes(role)
      })

      console.log(filtered)

      updateRehearsal({ assignedRoles: filtered }, rehearsal.id)
    })

    if (response) {
      console.log(response.error)
    }
    if (rehearsalResponse) {
      console.log(rehearsalResponse.error)
    }
  }

  const handleDelete = (role) => {
    setSolos(current => {
      const newSolos = current.filter(solo => {
        const [key] = Object.keys(solo)
        return role !== key
      })
      return newSolos
    })
  }

  const handleDeleteChorus = (chorus) => {
    setGroups(current => {
      const newGroups = current.filter(group => {
        const [key] = Object.keys(group)
        return chorus !== key
      })
      return newGroups
    })
  }

  const handleDeleteAct = index => {
    setSynopsis(prevSynop => prevSynop.filter(s => s !== synopsis[index]))
  }

  return (
    <Container className="text-dark my-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <h1 className="text-center">Hi, {user?.displayName}.</h1>
          <p className="text-center">You are seeing this page because you're a producer, director or musical director :). To set up what OpWa members see in this app, please go through the flows below. Please remember to save ALL the changes you make.</p>
        </Col>

        <h2 className="text-center my-4">The Opera</h2>
          
        <Col lg={10} xl={8}>
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Opera Title</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={e => setOpera(e.target.value)}
                    value={opera}
                    placeholder="e.g. Manon"
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Opera Composer</Form.Label>
                  <Form.Control 
                    type="text"
                    onChange={e => setComposer(e.target.value)}
                    value={composer}
                    placeholder="e.g. Massenet"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-5">
              <Form.Label>Add Solo Roles</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  onChange={e => setNewRole(e.target.value)}
                  value={newRole}
                  placeholder="e.g. Manon, Des Grieux"
                  ref={roleInput}
                />
                <Button onClick={handleAddRole}>Add Role</Button>
              </InputGroup>
            </Form.Group>

            <ListGroup className="mt-3">
              {documents && solos.map((solo) => {
                const [role] = Object.keys(solo)
                return (
                  <ListGroup.Item key={role}>
                    <div className="d-flex">
                      <div>{role}</div>
                      <div className="ms-auto">
                        <Button className="no-padding-btn" variant="white" onClick={() => handleDelete(role)}><Trash /></Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                )})}
            </ListGroup>

            <Form.Group className="mt-5">
              <Form.Label>Add Ensemble Roles</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  onChange={e => setNewChorus(e.target.value)}
                  value={newChorus}
                  placeholder="e.g. Chorus 1 Sopranos, Dance group 2"
                  ref={chorusInput}
                />
                <Button onClick={handleAddChorus}>Add Group</Button>
              </InputGroup>
            </Form.Group>

            <ListGroup className="mt-3">
              {documents && groups.map((group) => {
                const [chorus] = Object.keys(group)               
                return (
                  <ListGroup.Item key={chorus}>
                    <div className="d-flex">
                      <div>{chorus}</div>
                      <div className="ms-auto">
                        <Button className="no-padding-btn" variant="white" onClick={() => handleDeleteChorus(chorus)}><Trash /></Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                )})}
            </ListGroup>

            <div className="text-center">
              <Button className="mt-5" onClick={handleAddAct}>Add an Act</Button>
            </div>

            {synopsis.map((_, index) => (
              <div key={index + 1}>
                <Form.Group className="mt-3">
                  <Form.Label>Act {index + 1} synopsis</Form.Label>
                  <Form.Control
                    as="textarea"
                    onChange={e => setSynopsis([...synopsis.slice(0, index), e.target.value, ...synopsis.slice(index + 1)])}
                    value={synopsis[index]}
                    rows={5}
                  />
                </Form.Group>
                <div className="text-center mt-2">
                  <Button variant="secondary" size="sm" onClick={() => handleDeleteAct(index)}>Delete Act</Button>
                </div>
              </div>
            ))}

            <div className="text-center my-5">
              {!response.isPending && <Button variant="outline-primary" size="lg" onClick={handleSubmit}>Save Changes</Button>}
              {response.isPending && <Button variant="outline-primary" size="lg" disabled>Loading</Button>}
            </div>

            {response.error && <p className="text-danger">Could not upload the data.</p>}
            
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
