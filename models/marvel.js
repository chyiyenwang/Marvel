var mongoose = require('mongoose')
var Schema = mongoose.Schema

var marvelSchema = new Schema({
    "id": Number,
    "name": String,
    "description": String,
    //"modified": "2013-10-17T14:41:30-0400",
    "thumbnail": {
        "path": String,
        "extension": String
    },
    "resourceURI": String,
    "comics": {
        //available and returned shouldn't be necessary, use items.length in
        //javascript to get the numbers
        //"available": Number,
        "collectionURI": String,
        "items": [
            {
                "id": Number,
                "resourceURI": String,
                "name": String
            }
        ]//,
        //"returned": 36
    },
    "series": {
        //"available": 23,
        "collectionURI": String,
        "items": [
            {
                "resourceURI": String,
                "name": String
            }
        ]//,
        //"returned": 20
    },
    "stories": {
        //"available": 28,
        "collectionURI": String,
        "items": [
            // {
            //     "resourceURI": String,
            //     "name": String,
            //     "type": String
            // }
        ]//,
        //"returned": 20
    },
    "events": {
        //"available": 0,
        "collectionURI": String,
        "items": []//,
        //"returned": 0
    },
    // "urls": [
    //     {
    //         "type": String,
    //         "url": String
    //     }
    // ],
    "wiki": {
        "universe": String,
        "base_of_operations": String,
        "debut": String,
        "origin": String,
        "significant_issues": String,
        "current_members": String,
        "former_members": String,
        "other_members": String,
        "main_image": String,
        "bio_text": String,
        "bio": String,
        "categories": [String]
    }
})

var marvel = mongoose.model('marvel', marvelSchema)
module.exports = marvel