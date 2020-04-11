import React, {useEffect} from 'react'
import './login.sass'
import Feedback from './Feedback'

export default function ({onSubmit, onGoToRegister, error, onMount}){
    useEffect(() => {
        onMount()
    }, [])
    
    function handleOnSubmit(event) {
        event.preventDefault()

        const {target :{
            username: {value: username},
            password: {value: password}
        }} = event

        onSubmit(username, password)
    }

    function handleGoToRegister(event) {
        event.preventDefault()

        onGoToRegister()
    }
    
    return <>
            <form className="login" onSubmit={handleOnSubmit}>
            <h1 className="login__tittle">KARMARK</h1>
            <input className="login__username" type="text" placeholder="username" name="username"/>
            <input className="login__password" type="password" placeholder="password" name="password"/>
            <button className="login__button">login</button>
            <a className="login__toregister" href="" onClick={handleGoToRegister}>to register</a>

            {error && <Feedback message={error} level="warn" />}
        </form>
    </>
}
