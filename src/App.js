import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [typeMessage, setTypeMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
        const user = await loginService.login({
          username, password,
        })

        window.localStorage.setItem(
          'loggedNoteappUser', JSON.stringify(user)
        )

        setUser(user)
        blogService.setToken(user.token)
        
        setUsername('')
        setPassword('')
      } catch (exception) {
        setErrorMessage('Wrong credentials')
        setTypeMessage('error')
        setTimeout(() => {
          setErrorMessage(null)
          setTypeMessage('')
        }, 5000)
      }
  }

  

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleTitleChange = (event) => {
    console.log(event.target.value)
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    console.log(event.target.value)
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    console.log(event.target.value)
    setNewUrl(event.target.value)
  }
  const handleLikesChange = (event) => {
    console.log(event.target.value)
    setNewLikes(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author:newAuthor,
      url:newUrl,
      likes:newLikes
    }

    blogService
    .create(blogObject)
    .then(returnedBlog   => {
      setBlogs(blogs.concat(returnedBlog  ))
      setErrorMessage('Blog Created')
      setTypeMessage('ok')
      
      setTimeout(() => {
        setErrorMessage(null)
        setTypeMessage('')
      }, 5000)

      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setNewLikes('')
    })
    .catch(error=>{
      console.log(error.response.data.error)
      setErrorMessage(error.response.data.error) //falta capturar el error
      setTypeMessage('error')
      setTimeout(() => {
        setErrorMessage(null)
        setTypeMessage('')
      }, 5000)
    })
  }

  const loginForm = () => (
      <div>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
  )

  const logout = () => (
    <div>
      username
      <input
      type="button"
      value="Logout"
      onClick={() => {window.localStorage.clear(); setUser(null)}}
      />
    </div>
  )

  const blogForm = () => (
    <div>
      <h2>Crear New Blog </h2>
          
      <form onSubmit={addBlog}>
        title:<input
          value={newTitle}
          onChange={handleTitleChange}
        />
        Author:<input
          value={newAuthor}
          onChange={handleAuthorChange}
        />
        Url:<input
          value={newUrl}
          onChange={handleUrlChange}
        />
        Likes:<input
          value={newLikes}
          onChange={handleLikesChange}
        />
        <button type="submit">save</button>
      </form>  
      </div>
  )

  return (
    <div>
      <Notification message={errorMessage} typeMessage={typeMessage} />
      <h2>{user !== null ?
         `Logged in ${user.name.toUpperCase()  }`  
         :"User y Pass is required." }</h2> 
      {user !== null && logout()}   
      {user === null ? 
        loginForm()
        :
        blogForm()       
      }      
      <h2>blogs</h2>     
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}      
  </div>
  )
}

export default App