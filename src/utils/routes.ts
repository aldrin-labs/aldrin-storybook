import Home from '../Home'
// import Counter from '../Login'
// TODO: defiac routes example
import App from './App'
import NotFound from '../NotFound'
// import {
//   ListPosts,
//   PostDetail,
//   PostCreate,
//   PostEdit,
// } from 'pages/Blog'
// import App from './app'
export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
      },
      // {
      //   path: '/login',
      //   component: Login,
      // },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]
