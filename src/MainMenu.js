import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import NewReleasesIcon from '@material-ui/icons/NewReleases'
import PeopleIcon from '@material-ui/icons/People'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import { useRouter } from 'next/router'
import React from 'react'

export const MENU_ITEMS = [{
  title: 'Messages',
  icon: <NewReleasesIcon/>,
  route: '/',
}, {
  title: 'Questions',
  // subTitle: 'and answers',
  icon: <QuestionAnswerIcon/>,
  route: '/questions',
}, {
  title: 'Users',
  icon: <PeopleIcon />,
  route: '/users',
}]

export const MainMenu = () => {
  const router = useRouter()
  const currentRoute = router.pathname

  return (
    <div>
      {MENU_ITEMS.map(({ title, icon, route, subTitle }) => (
        <ListItem
          selected={currentRoute === route}
          key={title}
          button
          onClick={() => router.push(route)}>
          {icon && (<ListItemIcon>{icon}</ListItemIcon>)}
          <ListItemText primary={title} secondary={subTitle}/>
        </ListItem>
      ))}
    </div>
  )
}