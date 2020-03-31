import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MessageIcon from '@material-ui/icons/Message'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import { useRouter } from 'next/router'
import React from 'react'

export const MENU_ITEMS = [{
  title: 'Messages',
  icon: <MessageIcon/>,
  route: '/',
}, {
  title: 'Questions',
  icon: <QuestionAnswerIcon/>,
  route: '/questions',
}]

export const MainMenu = () => {
  const router = useRouter()
  const currentRoute = router.pathname

  return (
    <div>
      {MENU_ITEMS.map(({ title, icon, route }) => (
        <ListItem
          selected={currentRoute === route}
          key={title}
          button
          onClick={() => router.push(route)}>
          {icon && (<ListItemIcon>{icon}</ListItemIcon>)}
          <ListItemText primary={title}/>
        </ListItem>
      ))}
    </div>
  )
}