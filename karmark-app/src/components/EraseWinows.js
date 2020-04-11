import React from 'react'
import './eraseWindows.sass'

let stringCode

export default function ({ accept, cancel, code }) {
    function handleAccept(event) {
        event.preventDefault()
        accept()
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
        <form className='eraseWindow' onSubmit={handleAccept}>
            <h4 className='eraseWindow__text'>Do you want to remove {stringCode}</h4>
            <div>
                <button className='eraseWindow__accept'>Accept</button>
                <a className='eraseWindow__cancel' onClick={handleCancel}>Cancel</a>
            </div>
        </form>
    </>
}