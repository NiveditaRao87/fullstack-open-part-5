import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ login }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = (event) => {
    event.preventDefault()
    login({ username, password })
    setUsername('')
    setPassword('')
  }

  return <form onSubmit={onLogin}>
    <h2>Login to blog application</h2>
    <div>
            username
      <input
        type="text"
        id="username"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
            password
      <input
        id='password'
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}

      />
    </div>
    <button id="login-button" type="submit">login</button>
  </form>
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginForm