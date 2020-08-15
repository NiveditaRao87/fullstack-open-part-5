import React, {useState} from 'react'

const CreateForm = ({ createBlog }) => {
  
  const [newBlog, setNewBlog] = useState({title:'',author: '',url: ''})
  
  const onCreate = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({title: '',author: '',url: ''})
  }

  return (
      <>
      <h2>Create a new Blog</h2>
    <form onSubmit={onCreate}>
      <p>title: 
        <input
        type='text'
        value={newBlog.title}
        onChange={({ target }) =>setNewBlog({ ...newBlog, title: target.value })} 
        />
      </p>
      <p>author: 
        <input
        type='text'
        value={newBlog.author}
        onChange={({ target }) =>setNewBlog({ ...newBlog, author: target.value })}
        />
      </p>
      <p>url: 
        <input
        type='text'
        value={newBlog.url}
        onChange={({ target }) =>setNewBlog({ ...newBlog, url: target.value })}
        />
      </p>
      <button type='submit'>create</button>
    </form>
    </>)
}

export default CreateForm