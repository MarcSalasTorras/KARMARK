/** Send instruction stop to car
 *
 */
export default function() {
    return (async () => {
        await fetch(`http://172.20.10.2/stop`, {
            method: 'GET',
            mode: 'no-cors'
        })
        console.log('STOP')
    })()
}