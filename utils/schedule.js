var schedule = require('node-schedule');

function scheduleJob(timing, callback){
    var j = schedule.scheduleJob(timing, callback);
    return j;
}

module.exports = {scheduleJob};