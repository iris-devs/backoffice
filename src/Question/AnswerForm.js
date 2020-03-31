import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import Alert from '@material-ui/lab/Alert'
import React, { useState } from 'react'
import { useQuestionSubscription } from '../../hooks'
import { useAuth } from '../../hooks/auth'

export default ({ questionId, comment, onCancel }) => {
  const [saving, setSaving] = useState(false)
  const [body, setBody] = useState(comment?.body)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const { reply } = useQuestionSubscription()

  const save = async () => {
    try {
      setSaving(true)
      await reply(questionId, {
        body,
        uid: user.uid,
        authorName: user.displayName,
      })
    } catch (error) {
      setError(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={error !== null}
        autoHideDuration={10000}
        onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
      </Snackbar>
      <TextField
        style={{ backgroundColor: '#fff', marginBottom: 15 }}
        value={body}
        onChange={e => setBody(e.target.value)}
        label="Answer"
        multiline
        rows="4"
        variant="outlined"
        fullWidth={true}
      />
      <div style={{ textAlign: 'right' }}>
        <Button onClick={() => onCancel?.()}>Cancel</Button>
        {' '}
        <Button color="primary" variant="contained" onClick={save} disabled={saving}>Save</Button>
      </div>
    </div>
  )
}