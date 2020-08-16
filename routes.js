module.exports = function(app) {
    
    let discogs = require('./controllers/discogsController.js')

    app.route('/discogs/inventory/:username')
        .get(discogs.getInventory)
}