import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeBtnStyle = {
    backgroundColor: '#00b7c2',
    color: '#1b262c'
  }

  const onLike = (event) => {
    event.preventDefault()
    updateBlog(blog.id,
      {
        user: blog.user.id,
        likes: blog.likes+1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      })
  }

  const onRemoveBlog = () => {
    window.confirm(`Remove blog ${blog.title} by ${blog.author}?`) && deleteBlog(blog.id)
    console.log(blog, user)
  }

  const [buttonLabel, setButtonLabel] = useState('view')

  return <div style={blogStyle}>
    <span>{blog.title} {blog.author}</span>
    {buttonLabel === 'view' ?
      <button onClick={() => setButtonLabel('hide')}>{buttonLabel}</button>
      :
      <>
        <button onClick={() => setButtonLabel('view')}>{buttonLabel}</button>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={onLike} >like</button></p>
        <p>{blog.user.name}</p>
        {user && user.username === blog.user.username && <button style={removeBtnStyle} onClick={onRemoveBlog}>remove</button>}
      </>}
  </div>
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog
