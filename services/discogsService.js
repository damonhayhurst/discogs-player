let discogs = require('discogs')
let axios = require('axios')

var token = 'RuqXWaBuCSpndEwoAlmoexQtWwjJuBVzYERtugVr'

async function query(url, page) {
    url = addToken(url)
    if (page) {
        url = url.concat('&page=', page, '&per_page=5')
    }
    return await axios.get(url) 
}

function addToken(url) {
    var tokenString = '';
    if (/[?]q=/.test(url)) {
        tokenString = 'token=' + token;
        if (!/[&]q=/.test(url)) {
            tokenString = '&' + tokenString;
        } 
    } else {
        tokenString = '?token=' + token;
    }
    return url + tokenString;
}

async function getInventory(username, page) {
    return await query('https://api.discogs.com/users/' + username + '/inventory', page)
}

async function getInventoryReleases(username, page) {
    let inventory = await getInventory(username, page)
    var releases = await Promise.all(
        inventory.data.listings.map(
            async (listing) => {
                var response = await query(listing.release.resource_url)
                return response.data
            }
        )
    )
    return releases
}

exports.getInventoryReleases = getInventoryReleases