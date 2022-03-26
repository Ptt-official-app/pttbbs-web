export default (props) => {
  let {prompt, width, height} = props
  width = width || 0
  height = height || 0

  let styles = {
    width,
    height,
  }
  let className = 'container'
  if(width === 0) {
    styles = {}
    className = 'container vh-100'
  }

  console.log('EmptyList: styles:', styles, 'className:', className)
  return (
    <div className={className} style={styles}>
      <h3 className="mx-4">{prompt}</h3>
    </div>
  )
}