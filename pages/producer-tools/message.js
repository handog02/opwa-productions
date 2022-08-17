import { useRedirectProd } from '../../hooks/useRedirectProd'
import { Editor } from '@tinymce/tinymce-react'
import { useState, useEffect } from 'react'
import { useFirestore } from '../../hooks/useFirestore'

// bootstrap
import Container from 'react-bootstrap/container'
import Button from 'react-bootstrap/Button'
import { useCollection } from '../../hooks/useCollection'

export default function Message() {
  useRedirectProd()

  const [message, setMessage] = useState('Write Message Here.')

  const { updateDocument, response } = useFirestore('opera')
  const { documents } = useCollection('opera')

  const handleSave = () => {
    updateDocument({ message }, 'opera')
  }

  return (
    <Container fluid="lg" className="text-dark">
      <h1 className="mt-4 text-center">Message</h1>
      <p className="text-center">This is where you can write a message to the cast, and it will show up on their dashboard! It can be anything from notices, links to good recordings, etc.</p>

      {documents && (
        <Editor
          apiKey="6oyfe7axt5p01bdkllhv9elubcfuq78jwedvbbun44wvnpq4"
          textareaName="message"
          initialValue={documents[0].message}
          onEditorChange={newText => {setMessage(newText)}}
        />
      )}

      <div className="text-center my-4">
        {!response.isPending && <Button variant="outline-primary" onClick={handleSave}>Save Changes</Button>}
        {response.isPending && <Button variant="outline-primary" disabled>Loading</Button>}
      </div>
    </ Container>
  )
}
