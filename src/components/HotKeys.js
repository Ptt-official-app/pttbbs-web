import { useKey } from 'react-use'

export default (props) => {
  // default parent page: root
  const {parentPage = '/'} = props

  // Hotkeys can be extended
  useKey('ArrowLeft', (e) => {
    console.log('go back to ' + parentPage)
    window.location.href = parentPage
  })

  return props.children
}