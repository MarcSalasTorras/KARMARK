import React, { useState, useEffect, useContext } from 'react'
import { retrieveUser, isLoggedIn, logeOut, stop } from '../logic'
import './home.sass'
import { withRouter } from 'react-router-dom'
import { Context } from './ContextProvider'
import Feedback from './Feedback'

export default withRouter(function ({ history }) {
    const [state , setState] = useContext(Context)
    const [name, setName] = useState()

    function handleError(page, message) {

        setState({ page: page, error: message })

        setTimeout(() => {

            setState({ page: page, error: undefined })

        }, 3000);
    }

    useEffect(() => {
        if (isLoggedIn())
            (async () => {
                try {
                    const { name } = await retrieveUser()

                    setName(name)

                    setState({ page: 'home' })
                } catch ({ message }) {
                    logeOut()

                    setState({ page: 'login' })

                    history.push('/login')

                }
            })()
        else {
            setState({ page: 'login' })

            history.push('/login')
        }
    }, [])

    function handleLogeOut() {
        logeOut()

        setState({ page: 'login' })

        history.push('/login')
    }

    async function handleOnToControl() {
        try {
            await stop()
            try {
                await retrieveUser()

                setState({ page: 'control' })

                history.push('/control')
            } catch (error) {

                logeOut()
                setState({ page: 'login' })

                history.push('/login')
            }

        } catch (error) {
            handleError('home', 'no device connected')
        }
    }

    async function handleOnToPrograme() {
        try {
            await stop()
            try {
                await retrieveUser()

                setState({ page: 'programe' })

                history.push('/programe')
            } catch (error) {

                logeOut()
                setState({ page: 'login' })

                history.push('/login')
            }

        } catch (error) {
            handleError('home', 'no device connected')
        }
    }
    const {error} = state
    return <>
        <div className="home">
            <header className="homeheader">
                <h1 className="homeheader__user"> Hello {name}</h1>
                <button className="homeheader__button" onClick={handleLogeOut}><i className="fas fa-lock"></i></button>
            </header>
            <main className="homemenu">
                <button className="homemenu__programe" onClick={handleOnToPrograme}>PROGRAME</button>
                <button className="homemenu__control" onClick={handleOnToControl}>CONTROL</button>
            </main>
             {error && <Feedback message={error} level="error" />}
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
                integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossOrigin="anonymous" />
        </div>
    </>
})