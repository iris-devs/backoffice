import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import React from 'react'

export default ({ questionId, comment, onCancel }) => (
  <div style={{ marginTop: 20 }}>
    <TextField
      style={{ backgroundColor: '#fff', marginBottom: 15 }}
      value={comment?.body}
      label="Answer"
      multiline
      rows="4"
      variant="outlined"
      fullWidth={true}
    />
    <div style={{ textAlign: 'right' }}>
      <Button onClick={() => onCancel?.()}>Cancel</Button>
      {' '}
      <Button color="primary" variant="contained">Save</Button>
    </div>
  </div>
)