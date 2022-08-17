import { useCollection } from '../hooks/useCollection'
import RehearsalCard from '../components/RehearsalCard'
import { useState } from 'react'
import { useAuthContext} from '../hooks/useAuthContext'
import { useRedirect } from '../hooks/useRedirect'

// bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

const terms = [1, 2, 3]
const weeks = Array.from({length: 10}, (_, i) => i + 1)

const isEmpty = a => Array.isArray(a) && a.every(isEmpty)

export default function Rehearsals() {
  useRedirect()

  const [filter, setFilter] = useState(false)

  let rehearsals = terms.map(term => weeks.map(week => {
    const { documents } = useCollection(
      'rehearsals',
      ['term', '==', term],
      ['week', '==', week],
      ['date']
    )
    return documents
  }))

  const { user } = useAuthContext()
  const { documents: opera } = useCollection('opera')

  if (filter) {
    rehearsals = rehearsals.map(termRehearsals => {
      return termRehearsals.map(weekRehearsals => {
        if (weekRehearsals.length) {

          const filtered = weekRehearsals.filter(rehearsal => {
            const userRoles = []
            const roles = rehearsal.assignedRoles.map(role => {
              const [name] = Object.keys(role)
              return name
            })
            opera[0].solos.forEach(solo => {
              const [roleName] = Object.keys(solo)
              const [id] = Object.values(solo)
              if (user.uid === id) {
                userRoles.push(roleName)
              }
            })
            opera[0].groups.forEach(group => {
              const [roleName] = Object.keys(group)
              const [ids] = Object.values(group)
              if (ids.includes(user.uid)) {
                userRoles.push(roleName)
              }
            })
            return userRoles.some(r => roles.includes(r))
          })
          return filtered

        } else {
          return weekRehearsals
        }
        
      })
    })
  }

  return (
    <>
      <Form.Check
        type="checkbox"
        id="filter"
        label="Filter my rehearsals"
        className="mt-2"
        onChange={() => setFilter(current => !current)}
      />
      {rehearsals.map((termRehearsals, index) => (
        <div key={index}>
          {!isEmpty(termRehearsals) && <h3 className="text-center mt-3">Term {terms[index]}</h3>}
          {!isEmpty(termRehearsals) && termRehearsals.map((weekRehearsals, index) => !isEmpty(weekRehearsals) && (
            <div key={index}>
              <h4 className="mt-3">Week {weeks[index]}</h4>
              <Container>
                <Row>
                  {weekRehearsals?.map((rehearsal, index) => (
                    <RehearsalCard rehearsal={rehearsal} key={index} producer={false} />
                  ))}
                </Row>
              </Container>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
