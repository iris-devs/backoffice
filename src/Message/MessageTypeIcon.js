import Tooltip from '@material-ui/core/Tooltip'
import InfoIcon from '@material-ui/icons/Info'
import React from 'react'

export default ({ type }) => {
  let iconColor = "#90caf9";
  let iconTitle = "Info";

  switch (type) {
    case 'warn':
      iconColor = "orange";
      iconTitle = "Warning";
      break;
    case 'alert':
      iconColor = "red";
      iconTitle = "Alert";
      break;
  }
  return (
    <Tooltip title={iconTitle} placement="top">
      <InfoIcon htmlColor={iconColor} />
    </Tooltip>
  )
}
