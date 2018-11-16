module.exports = {
    // removes metadata from query results
    getJSON : function(results){
        let output = null
        if (results.constructor === Array && results.length != 0){
            output = results.map(function(object){
                return object.get({plain: true})
            })
        }
        if(results.constructor !== Array){
            output = results.get({plain: true})
        }
        return output
    },
    //returns the start day
    getStartDate: function(timeFilter){
        let today = new Date()
        let date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
        
        if (timeFilter == "all"){
            date.setDate(1)
            date.setMonth(0)
            date.setFullYear(1970)
        }
        if (timeFilter == 'week'){
            date.setDate(date.getDate() - date.getDay())
        }
        if(timeFilter == "month"){
            date.setDate(1)
        }
        return date
    }
}