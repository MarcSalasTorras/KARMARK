import React, { useState, useEffect, useContext } from 'react'
import { retrievePrograms, retrieveUser, play, isLoggedIn, logeOut, deleteProgram } from '../logic'
import { withRouter } from 'react-router-dom'
import { Context } from './ContextProvider'
import Items from './Items'
import DeleteWindows from './DeleteWindows'
import './programs.sass'

export default withRouter(function ({ history }) {
    const [state, setState] = useContext(Context)
    const [programs, setPrograms] = useState()
    const [name, setName] = useState()
    useEffect(() => {
        if (isLoggedIn())
            (async () => {
                try {
                    const programs = await retrievePrograms()

                    console.log(programs)

                    const { name } = await retrieveUser()

                    setName(name)

                    setPrograms(programs)

                    setState({ page: 'programs' })

                    history.push('/programs')
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

    async function handlePlay(code) {
        try {
            await play(code)

        } catch ({ message }) {
            history.push('/programs')
            setState({ page: 'programs', error: message })
        }
    }

    async function handleOnPrograme(event) {
        event.preventDefault()
        
        try {
            await retrieveUser()

            setState({ page: 'control' })

            history.push('/programe')
        } catch (error) {

            logeOut()
            setState({ page: 'login' })

            history.push('/login')
        }
    }

    function handleDeleteWindows(name, id) {
        setState({ page: 'programs', delet: true, programName: name, programId: id })

    }

    async function handleAccept(id) {
        await deleteProgram(id)

        const programs = await retrievePrograms()

        setPrograms(programs)

        setState({ page: 'programs', delet: false })
    }

    async function handleCancel() {

        setState({ page: 'programs', delet: false })
    }

    const { delet, programName, programId } = state

    //console.log(programId)

    return <>
        <div className="menu">
            <div className="menuheader">
                <h1 className="menuheader__name">{name} programs</h1>
                <button className="menuheader__button" onClick={handleOnPrograme}><i className="fas fa-backspace"></i></button>
            </div>
            <div className="menubody">
                <div className="menubody__itme">
                    {programs && programs.map(item => <Items key={item.id} name={item.name} code={item.code} play={handlePlay} id={item.id} deleteProgramWindows={handleDeleteWindows} />)}
                </div>
            </div>
                {delet && <DeleteWindows accept={handleAccept} cancel={handleCancel} name={programName} id={programId} />}
        </div>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
            integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossOrigin="anonymous" />
    </>
})