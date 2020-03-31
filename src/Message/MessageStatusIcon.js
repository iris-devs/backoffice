import Tooltip from '@material-ui/core/Tooltip'
import AlarmIcon from '@material-ui/icons/AlarmOn'
import PublishedIcon from '@material-ui/icons/Check'
import RemovedIcon from '@material-ui/icons/HighlightOff'
import React from 'react'

export default ({ isPublished, isDeleted }) => {
  if (isDeleted) {
    return (
      <Tooltip title="deleted" placement="top">
        <RemovedIcon color="error"/>
      </Tooltip>
    )
  }

  if (isPublished) {
    return (
      <Tooltip title="published" placement="top">
        <PublishedIcon htmlColor="green" titleAccess="published"/>
      </Tooltip>
    )
  }

  return (
    <Tooltip title="pending" placement="top">
      <AlarmIcon color="disabled" titleAccess="pending"/>
    </Tooltip>
  )
}