import { setCollection } from '../hooks/setCollection'
import RehearsalCard from './RehearsalCard'

// bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

const terms = [1, 2, 3]
const weeks = Array.from({length: 10}, (_, i) => i + 1)

const isEmpty = a => Array.isArray(a) && a.every(isEmpty)

export default function RehearsalListEdit() {
  const rehearsals = terms.map(term => weeks.map(week => {
    const { documents } = setCollection(
      'rehearsals',
      ['term', '==', term],
      ['week', '==', week],
      ['date']
    )
    return documents
  }))

  return rehearsals.map((termRehearsals, index) => (
    <div key={index}>
      {!isEmpty(termRehearsals) && <h3 className="text-center mt-5">Term {terms[index]}</h3>}
      {!isEmpty(termRehearsals) && termRehearsals.map((weekRehearsals, index) => !isEmpty(weekRehearsals) && (
        <div key={index}>
          <h4 className="mt-3">Week {weeks[index]}</h4>
          <Container>
            <Row>
              {weekRehearsals?.map((rehearsal, index) => (
                <RehearsalCard rehearsal={rehearsal} key={index} producer={true} />
              ))}
            </Row>
          </Container>
        </div>
      ))}
    </div>
  ))
}
