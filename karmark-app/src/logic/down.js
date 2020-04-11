/** Send instruction down to car
 *
 */
export default function() {
    return (async () => {
        await fetch(`http://172.20.10.2/down`, {
            method: 'GET',
            mode: 'no-cors'
        })
        console.log('moving down')
    })()
}