import { useRedirectProd } from '../../hooks/useRedirectProd'
import { useEffect, useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useFirestore } from '../../hooks/useFirestore'
import Select from 'react-select'

// bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function roles() {
  useRedirectProd()

  const { documents: userDocs } = useCollection('users')
  const [users, setUsers] = useState(null)

  const { documents } = useCollection('opera')
  const [solos, setSolos] = useState([])
  const [groups, setGroups] = useState([])

  const { updateDocument, response } = useFirestore('opera')

  useEffect(() => {
    if (documents) {
      setSolos(documents[0].solos)
      setGroups(documents[0].groups)
    }
  }, [documents])

  const handleChange = (option, role) => {
    if (option) {
      setSolos(prevSolos => {
        const copy = [...prevSolos]
        const index = copy.findIndex(solo => {
          const [key] = Object.keys(solo)
          return key === role
        })
        copy[index] = { [role]: option.value.id }
        return copy
      })
    } else {
      setSolos(prevSolos => {
        const copy = [...prevSolos]
        const index = copy.findIndex(solo => {
          const [key] = Object.keys(solo)
          return key === role
        })
        copy[index] = { [role]: '' }
        return copy
      })
    }
  }

  const handleChangeChorus = (options, chorus) => {
    if (options.length) {
      setGroups(prevGroups => {
        const copy = [...prevGroups]

        const index = copy.findIndex(group => {
          const [key] = Object.keys(group)
          return key === chorus
        })

        const ids = options.map(option => option.value.id)
        copy[index] = { [chorus]: ids }
        return copy
      })
    } else {
      setGroups(prevGroups => {
        const copy = [...prevGroups]

        const index = copy.findIndex(group => {
          const [key] = Object.keys(group)
          return key === chorus
        })

        const ids = options.map(option => option.value.id)
        copy[index] = { [chorus]: '' }
        return copy
      })
    }
  }

  useEffect(() => {
    if (userDocs) {
      const userOptions = userDocs.map(userDoc => {
        return {
          value: userDoc,
          label: userDoc.firstName + ' ' + userDoc.lastName
        }
      })
      setUsers(userOptions)
    }
  }, [userDocs])

  const handleSaveSolos = () => {
    updateDocument({ solos }, 'opera')
  }

  const handleSaveChorus = () => {
    updateDocument({ groups }, 'opera')
  }

  return (
    <Container className="text-dark my-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <h1 className="text-center">Roles</h1>
          <p className="text-center">Use this page to assign people to solo and ensemble roles (they must have created an account for you to be able to see them!). Remember to click save after each section!</p>

          <h2 className="text-center my-4">Solo Roles</h2>

          {documents && users && solos?.map(solo => {
            const [role] = Object.keys(solo)
            
            return (
              <Form key={role} className="mb-3">
                <Form.Label>{role}:</Form.Label>
                <Select
                  isClearable
                  options={users}
                  onChange={(option) => handleChange(option, role)}
                  defaultValue={users[users.findIndex(user => {
                    const id = user.value.id
                    const roleIndex = solos.findIndex(solo => {
                      const [key] = Object.keys(solo)
                      return key === role
                    })
                    return id === solos[roleIndex][role]
                  })]}
                />
              </Form>
            )
          })}

          <div className="text-center my-5">
            {!response.isPending && <Button variant="outline-primary" size="sm" onClick={handleSaveSolos}>Save Changes</Button>}
            {response.isPending && <Button variant="outline-primary" size="sm" disabled>Loading</Button>}
          </div>

          <h2 className="text-center my-4">Ensemble Roles</h2>

          {documents && users && groups.map(group => {
            const [chorus] = Object.keys(group)

            return (
              <Form key={chorus} className="mb-3">
                <Form.Label>{chorus}:</Form.Label>
                <Select
                  isMulti
                  options={users}
                  onChange={(options) => handleChangeChorus(options, chorus)}
                  defaultValue={users.filter(user => {
                    const id = user.value.id
                    const roleIndex = groups.findIndex(group => {
                      const [key] = Object.keys(group)
                      return key === chorus
                    })
                    return groups[roleIndex][chorus].includes(id)
                  })}
                />
              </Form>
            )
          })}

          <div className="text-center my-5">
            {!response.isPending && <Button variant="outline-primary" size="sm" onClick={handleSaveChorus}>Save Changes</Button>}
            {response.isPending && <Button variant="outline-primary" size="sm" disabled>Loading</Button>}
          </div>
        </Col>
      </Row>
    </Container>
  )
}
