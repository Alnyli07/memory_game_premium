const Data = require('sf-core/data');

module.exports = {
    getUserName: e => Data.getStringVariable("memory_game_username"),
    setUserName: e => Data.setStringVariable("memory_game_username", e)
};