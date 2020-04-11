import React from 'react'
import './delete-windows.sass'

export default function ({ accept, cancel, name, id }) {

    function handleAccept(event) {
        event.preventDefault()

        accept(id)
    }

    function handleCancel(event) {
        event.preventDefault()

        cancel()
    }

    return <>
        <div className="deletewindows">
            <h4 className="deletewindows__name">Do you want to delete {name} ?</h4>
            <div className="deletebuttons">
                <button className="deletebuttons__accept" onClick={handleAccept}>Accept</button>
                <button className="deletebuttons__cancel" onClick={handleCancel}>Cancel</button>

            </div>
        </div>
    </>
}