let i = 0

/** Send a program to the car
 *  @param {Array} code array of instructions
 *
 */
export default async function recursive(code) {
    await fetch(`http://172.20.10.2/${code[i]}`, {
        method: 'GET',
        mode: 'no-cors'
    })
    console.log(`moving ${code[i]}`)

    setTimeout(async () => {
        if (i < code.length - 1) {
            i++
            recursive(code)
        } else {
            await fetch(`http://172.20.10.2/stop`, {
                method: 'GET',
                mode: 'no-cors'
            })
            i = 0
        }
    }, 1000)

}