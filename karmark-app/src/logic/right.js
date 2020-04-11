/** Send instruction right to car
 *
 */
export default function() {
    return (async () => {
        await fetch(`http://172.20.10.2/right`, {
            method: 'GET',
            mode: 'no-cors'
        })
        console.log('moving right')
    })()
}