import { useRedirectProd } from '../../hooks/useRedirectProd'
import { useEffect, useState } from 'react'
import { setCollection } from '../../hooks/setCollection'
import { useFirestore } from '../../hooks/useFirestore'
import { Timestamp } from 'firebase/firestore'
import AddRehearsal from '../../components/AddRehearsal'
import RehearsalListEdit from '../../components/RehearsalListEdit'

// bootstrap
import Container from 'react-bootstrap/container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function Rehearsals() {
  useRedirectProd()

  const [termOne, setTermOne] = useState('')
  const [termTwo, setTermTwo] = useState('')
  const [termThree, setTermThree] = useState('')

  const { documents } = setCollection('opera')
  const { updateDocument, response } = useFirestore('opera')

  useEffect(() => {
    if (documents) {
      setTermOne(documents[0].termOne.toDate().toISOString().slice(0, 10))
      setTermTwo(documents[0].termTwo.toDate().toISOString().slice(0, 10))
      setTermThree(documents[0].termThree.toDate().toISOString().slice(0, 10))
    }
  }, [documents])

  const handleSaveTerms = () => {
    updateDocument({
      termOne: Timestamp.fromDate(new Date(termOne)),
      termTwo: Timestamp.fromDate(new Date(termTwo)),
      termThree: Timestamp.fromDate(new Date(termThree)),
    }, 'opera')
  }

  return (
    <Container fluid="lg" className="text-dark my-4">
      <h1 className="text-center">Rehearsals</h1>
      <p className="text-center">This is where you post rehearsal info! Please set the term dates first, so the app knows which week to put the rehearsal in.</p>

      <Form className="mt-4">
        <Row>
          <Col lg>
            <Form.Group controlId="term1Date">
              <Form.Label>Term 1 Start Date:</Form.Label>
              <Form.Control type="date" onChange={e => setTermOne(e.target.value)} value={termOne} />
            </Form.Group>
          </Col>
          <Col lg>
            <Form.Group controlId="term2Date">
              <Form.Label>Term 2 Start Date:</Form.Label>
              <Form.Control type="date" onChange={e => setTermTwo(e.target.value)} value={termTwo} />
            </Form.Group>
          </Col>
          <Col lg>
            <Form.Group controlId="term3Date">
              <Form.Label>Term 3 Start Date:</Form.Label>
              <Form.Control type="date" onChange={e => setTermThree(e.target.value)} value={termThree} />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center my-4">
          {!response.isPending && <Button variant="outline-primary" size="sm" onClick={handleSaveTerms}>Save Changes</Button>}
          {response.isPending && <Button variant="outline-primary" size="sm" disabled>Loading</Button>}
        </div>
      </Form>

      <AddRehearsal termOne={termOne} termTwo={termTwo} termThree={termThree} />

      <RehearsalListEdit />
    </Container>
  )
}
