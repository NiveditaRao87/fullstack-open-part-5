import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null,type: null })

  const createFormRef = useRef() //The ref is used in this case to access the visibility
  // which is contorlled within a child component from the parent. A ref remains unchanged
  // inspite of re-renders.

  useEffect(() => {
    blogService.getAll().then(blogs =>
      //Since using sort directly on array will mutate state
      setBlogs( [...blogs].sort((b,a) => a.likes - b.likes ))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleNotification = (message,type) => {
    // Type to indicate if its an error message or a notification
    setNotification({ message,type })
    setTimeout(() => {
      setNotification({ message: null,type: null })
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
    } catch ({ response }) {
      if(response.status === 401){
        handleNotification('Wrong username or password','error')
      } else {
        handleNotification('Failed to login, try again later or contact your administrator','error')
      }
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    handleNotification('Logged out successfully.','message')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreate = async (blogObject) => {
    createFormRef.current.toggleVisibility()
    try{
      const returnedBlog = await blogService
        .create(blogObject)
      //Since new blog is always created with 0 likes so no sorting needed here
      setBlogs(blogs.concat(returnedBlog))
      handleNotification(`A new blog ${returnedBlog.title} by ${returnedBlog.author} was added to the list`,'message')
    }
    catch(exception) {
      handleNotification('Failed to create blog','error')
    }
  }

  const handleUpdate = async (id, blogObject) => {
    try {
      const returnedBlog =  await blogService.update(id,blogObject)
      setBlogs(blogs.map(blog => blog.id !== returnedBlog.id? blog : { ...blog, likes: returnedBlog.likes }).sort((b,a) => a.likes - b.likes ))
    }
    catch(exception){
      handleNotification('Failed to update blog','error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id ))
    }
    catch(exception){
      handleNotification('Failed to remove blog','error')
    }
  }


  return (
    <>
      <header>
        <h1>Blog App</h1>
        <Notification notification={notification} />
      </header>
      <main>
        {user === null ?
          <Togglable buttonLabel='login'>
            <LoginForm
              login={handleLogin}
            />
          </Togglable>
          :
          <>
            <p>{user.name} logged-in
              <button type='button' onClick={handleLogout}>logout</button>
            </p>
            <Togglable buttonLabel='create new blog' ref={createFormRef}>
              <CreateForm
                createBlog={handleCreate}
                user={user}
              />
            </Togglable>
          </>
        }
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={handleUpdate} deleteBlog={handleDelete} user={user} />
        )}
      </main>
    </>
  )
}

export default App