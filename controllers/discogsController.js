let discogsService = require('../services/discogsService')

exports.getInventory = function(req, res) {
    let username = req.params.username
    let page = req.query.page
    discogsService.getInventoryReleases(username, page)
        .then(function(response) {
            res.json(response)
        }).catch(function(error) {
            console.log(error)
            res.send(error)
        })
}