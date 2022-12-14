import './css/test.css'
import _ from 'lodash'
import { add } from './page/home'
import dashboard from './page/dashboard'
function test(params) {
  // import('lodash' /* webpackChunkName: "lodash" */).then(_ => {
  //   console.log(params)
  //   console.log(_.add(5, params))
  //   console.log(_.add(5, params))
  // })
  console.log(add(5, 5))
  console.log(dashboard(true))
  console.log(_.add(params, 1))
}
test(13)
