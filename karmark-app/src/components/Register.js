import React, {useEffect} from 'react'
import './register.sass'
import Feedback from './Feedback'

export default function ({onSubmit, onGoToLogin, error, onMount}){
    useEffect(() =>{
        onMount()
    }, [])

    function handleSubmit(event) {
        event.preventDefault()

        const { target: 
            {name: {value : name},
            surname: {value : surname},
            username: {value: username},
            password: {value: password}}
        } = event

        onSubmit(name, surname, username, password)
    }

    function handleGoToLogin(event){
        event.preventDefault()
        
        onGoToLogin()
    }

    return <>
            <form className="register" onSubmit={handleSubmit}>
            <h1 className="register__tittle">KARMARK</h1>
            <input className="register__name" type="text" placeholder="name" name="name"/>
            <input className="register__surname" type="text" placeholder="surname" name="surname"/>
            <input className="register__username" type="text" placeholder="username" name="username"/>
            <input className="register__password" type="password" placeholder="password" name="password"/>
            <button className="register__button">register</button>
            <a className="register__tologin" href="" onClick={handleGoToLogin}>to login</a>

            {error && <Feedback message={error} level="warn" />}
        </form>
    </>
}