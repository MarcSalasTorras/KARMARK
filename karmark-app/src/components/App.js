import React, { useEffect, useContext } from 'react'
import Page from './Page'
import Register from './Register'
import Login from './Login'
import Home from './Home'
import Control from './Control'
import Programe from './Programe'
import Programs from './Programs'
import { registerUser, isLoggedIn, authenticateUser, up, down, right, left, stop, play, createProgram } from '../logic'
import { Context } from './ContextProvider'
import { Route, withRouter, Redirect } from 'react-router-dom'
let code = []

export default withRouter(function ({ history }) {
  const [state, setState] = useContext(Context)

  function handleError(page, message) {

    setState({ page: page, error: message })

    setTimeout(() => {

      setState({ page: page, error: undefined })

    }, 3000);
  }

  useEffect(() => {
    if (isLoggedIn()) {
      code = []
      setState({ page: 'home' })

      history.push('/home')

    } else {
      code = []
      setState({ page: 'login' })

      history.push('/login')
    }
  }, [])

  async function handleRegister(name, surname, username, password) {

    try {
      await registerUser(name, surname, username, password)

      setState({ page: 'login' })
      history.push('/login')
    } catch ({ message }) {
      history.push('/register')

      handleError('register', message)
    }
  }

  async function handleLogin(username, password) {
    try {
      await authenticateUser(username, password)

      setState({ page: 'home' })
    } catch ({ message }) {
      history.push('/login')

      handleError('login', message)
    }
  }

  async function handleUp() {
    try {
      await up()

    } catch ({ message }) {
      history.push('/control')

      handleError('control', message)
    }
  }

  async function handleDown() {
    try {
      await down()

    } catch ({ message }) {
      history.push('/control')

      handleError('control', message)
    }
  }

  async function handleRight() {
    try {
      await right()

    } catch ({ message }) {
      history.push('/control')

      handleError('control', message)
    }
  }

  async function handleLeft() {
    try {
      await left()

    } catch ({ message }) {
      history.push('/control')

      handleError('control', message)
    }
  }

  async function handleStop() {
    try {
      await stop()

    } catch ({ message }) {
      history.push('/control')

      handleError('control', message)
    }
  }

  async function handleOnPlay() {
    try {
      await play(code)

    } catch ({ message }) {
      history.push('/programe')

      handleError('programe', message)
    }
  }

  function handleSaveProgram(name) {
    try {
      createProgram(name, code)

      setState({ page: 'programe', save: false })
    } catch ({ message }) {

      handleError('programe', `name was empty, program not saved`)
    }

  }

  function handleSaveUp() {
    code.push('up')

  }

  function handleSaveDown() {
    code.push('down')
    console.log(code)
  }

  function handleSaveRight() {
    code.push('right')
  }

  function handleSaveLeft() {
    code.push('left')
  }

  function handleDelete() {
    code = []
    setState({ page: 'programe', erase: false })
  }

  function handleGoToLogin() {

    history.push('/login')
  }

  function handleGoToRegister() {

    history.push('/register')
  }

  function handleGoToPrograms() {
    code = []
    history.push('/programs')
  }

  function handleGoToHome() {
    code = []
    history.push('/home')
  }

  function handleMountRegister() {
    setState({ page: 'register' })
  }

  function handleMountLogin() {
    setState({ page: 'login' })
  }

  function handleMountControl() {
    setState({ page: 'control' })

  }

  function handleMountPrograme() {
    setState({ page: 'programe' })
  }
  function handleOnErase() {
    setState({ page: 'programe', erase: true }) 
  }
  function handleOnSave() {
    setState({ page: 'programe', save: true })

  }

  function handleOnCancel() {
    setState({ page: 'programe', save: false, erase: false })
  }

  const { page, error, save, erase } = state
  return <div className="app">
    <Page name={page}>
      <Route exact path="/" render={() => isLoggedIn() ? <Redirect to="/home" /> : <Redirect to="/login" />} />
      <Route path="/register" render={() => isLoggedIn() ? <Redirect to="/home" /> : <Register onSubmit={handleRegister} onGoToLogin={handleGoToLogin} error={error} onMount={handleMountRegister} />} />
      <Route path="/login" render={() => isLoggedIn() ? <Redirect to="/home" /> : <Login onSubmit={handleLogin} onGoToRegister={handleGoToRegister} error={error} onMount={handleMountLogin} />} />
      <Route path="/control" render={() => isLoggedIn() ? <Control onUp={handleUp} onDown={handleDown} onRight={handleRight} onLeft={handleLeft} onStop={handleStop} onMount={handleMountControl} onGoToHome={handleGoToHome} error={error} /> : <Redirect to="/login" />} />
      <Route path="/programe" render={() => isLoggedIn() ? <Programe onUp={handleSaveUp} onDown={handleSaveDown} onRight={handleSaveRight} onLeft={handleSaveLeft} onDelete={handleDelete} onPlay={handleOnPlay} onMount={handleMountPrograme} onGoToHome={handleGoToHome} error={error} onSave={handleOnSave} onCancel={handleOnCancel} saveProgram={handleSaveProgram} save={save} erase={erase} onErase={handleOnErase} onPrograms={handleGoToPrograms} code={code} /> : <Redirect to="/login" />} />
      <Route path="/home" render={() => isLoggedIn() ? <Home /> : <Redirect to="/login" />} />
      <Route path="/programs" render={() => isLoggedIn() ? <Programs /> : <Redirect to="/login" />} />
    </Page>
  </div>
})
