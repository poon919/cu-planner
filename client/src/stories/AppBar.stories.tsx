import React, { useState } from 'react'
import { action, actions } from '@storybook/addon-actions'
import Drawer from '@material-ui/core/Drawer'
import HomeIcon from '@material-ui/icons/Home'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import ScheduleIcon from '@material-ui/icons/Schedule'
import DateRangeIcon from '@material-ui/icons/DateRange'

import MainAppBar from '../components/MainAppBar'
import { RouteList } from '../components/RouteList/RouteList'

export default {
  component: MainAppBar,
  title: 'MainAppBar',
}

const props = actions('onMenuClick', 'onShowPresets', 'onFindCourse', 'onSidebarStateChange')

export const DisabledRoutes = () => (
  <MainAppBar {...props} disableActions>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
    facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
    gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
    donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
    adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
    Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
    imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
    arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
    donec massa sapien faucibus et molestie ac.
  </MainAppBar>
)

const routes = [
  {
    key: 'home',
    path: '/',
    icon: HomeIcon,
    text: { primary: 'Home' },
    ListItemProps: { divider: true },
  },
  {
    key: 'mycourses',
    path: '/mycourses',
    icon: LibraryBooksIcon,
    text: { primary: 'My Courses' },
  },
  {
    key: 'timetable',
    path: '/timetable',
    icon: ScheduleIcon,
    text: { primary: 'Timetable' },
  },
  {
    key: 'exam',
    icon: DateRangeIcon,
    text: { primary: 'Exam' },
    children: [{
      key: 'exam-midterm',
      path: '/exam/midterm',
      text: { primary: 'Midterm' },
    }, {
      key: 'exam-final',
      path: '/exam/final',
      text: { primary: 'Final' },
    }],
  },
]

export const WithRoutes = () => {
  const [showNav, setShowNav] = useState(false)

  const handleRoute = (route: string) => {
    action('Routing')(route)
    setShowNav(false)
  }

  return (
    <>
      <MainAppBar
        {...props}
        onMenuClick={() => setShowNav(true)}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
        facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
        gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
        donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
        adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
        Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
        imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
        arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
        donec massa sapien faucibus et molestie ac.
      </MainAppBar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={showNav}
        onClose={() => setShowNav(false)}
        ModalProps={{ keepMounted: true }}
      >
        <div style={{ width: '250px' }}>
          <RouteList
            routes={routes}
            onRoute={handleRoute}
          />
        </div>
      </Drawer>
    </>
  )
}
