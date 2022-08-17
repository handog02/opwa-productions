import { useAuthContext } from '../hooks/useAuthContext'
import { useCollection } from '../hooks/useCollection'
import { useRedirect } from '../hooks/useRedirect'

// bootstrap
import Card from 'react-bootstrap/Card'

export default function Home() {
  useRedirect()

  const { documents: opera } = useCollection('opera')
  const { user } = useAuthContext()

  const userRoles = []

  if (opera) {
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
  }

  return opera && (
    <div className="text-dark">
      <h1 className="mt-4 text-center">Hey, {user?.displayName}</h1>
      <p className="lead text-center mt-3">Welcome to OpWa's very own productions app! The current production is {opera[0].composer}'s <span className="h5">{opera[0].opera}</span></p>

      <p className="mt-5 mb-2 h5">
        Your role(s) in this opera:
        {userRoles.map((role, index) => {
          if (index + 1 === userRoles.length) {          
          return (<span key={role} className="h4"> {role}</span>)
          } else {
            return (<span key={role} className="h4"> {role},</span>)
          }
        })}      
      </p>

      <p className="mt-5 mb-2">Here's what the producers have to say:</p>

      <Card>
        <Card.Body dangerouslySetInnerHTML={{__html: opera[0].message}}></Card.Body>
      </Card>

      <p className="mt-5 mb-2">Bored? Have a read through the synopsis below:</p>
      <Card body>
        {opera[0].synopsis.map((text, index) => (
          <div key={index}>
            <h5 className="mb-2">Act {index + 1}</h5>
            <p className="mb-4 content">{text}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}
