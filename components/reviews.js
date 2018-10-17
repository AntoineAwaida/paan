const reviews = async function({req}) {

    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
    const res = await fetch(baseUrl + '/review')
    const data = await res.json()
    console.log(`Show data fetched. Count: ${data.length}`)

    return {
        reviewlist: data
    }
}


export default reviews;