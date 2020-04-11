import React from 'react'

export default function ({ name, code, play, deleteProgramWindows, id }) {

    function handleplay(event) {
        event.preventDefault()

        play(code)
    }

    function handleDelete(event) {
        event.preventDefault()
        
        deleteProgramWindows(name, id)
    }
    return <div className="menubody__program">
        <h3 className="menubody__name">{name}</h3>
        <button className="menubody__go" onClick={handleplay}><i className="fas fa-play-circle"></i></button>
        <button className="menubody__delete" onClick={handleDelete} ><i className="fas fa-times-circle"></i></button>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
            integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossOrigin="anonymous" />
    </div>
}