import _ from 'lodash'

export default function show(visible) {
  console.log(visible)
  console.log(_.assign({}, { a: visible }))
  //   console.log('dashboard')
}
