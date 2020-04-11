/** Send instruction up to car
 *
 */
export default function async() {
    return (async () => {
        try {
            await fetch(`http://172.20.10.2/up`,{
                method: 'GET',
                mode: 'no-cors'
            })
            console.log('moving up')
            
        } catch ({message}) {
            console.log(message)
        }
    })()
}