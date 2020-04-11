import React from 'react'
import './saveWindows.sass'

let stringCode

export default function ({ accept, cancel, code }) {
    function handleAccept(event) {
        event.preventDefault()

        const { target: {
            name: { value: name }
        } } = event
        accept(name)
    }

    function handleCancel(event) {
        event.preventDefault()

        cancel()
    }

    (function handleCode(){
        stringCode = ''
        
        code.forEach( item => {
            stringCode += `${item}, `
        })

        return stringCode
    })();

    return <>
        <form className='saveWindow' onSubmit={handleAccept}>
            <h4 className='saveWindow__text'>Introduce program name for {stringCode}</h4>
            <input className='saveWindow__name' name='name' />
            <div>
                <button className='saveWindow__accept'>Accept</button>
                <a className='saveWindow__cancel' onClick={handleCancel}>Cancel</a>
            </div>
        </form>
    </>
}