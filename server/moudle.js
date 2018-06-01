const mongoose = require('mongoose')
//connect mogodb 
// const DB_URL = 'mongodb://localhost:27017/react-chat'
const DB_URL = 'mongodb://imbafym:imbafym_1993@ds211558.mlab.com:11558/heroku_bbz7c6wp'

mongoose.connect(DB_URL)

const models = {
    user: {
        'user': { type: String, require: true },
        'pwd': { type: String, require: true },
        'type': { type: String, require: true },
        'avatar': { type: String },
        'desc': { type: String },
        'title': { type: String },
        //if boss two more 
        'company': { type: String },
        'moeny': { type: String },


    },
    chat: {
        'chatid': {type: String, require:true},
        'from': { type: String, require: true },
        'to': { type: String, require: true },
        //read 只对to 
        'read':{type: Boolean, default:false},
        'content': { type: String, require: true, default: '' },
        'create_time': { type: Number, default: Date.now }
    }

}


for (let m in models) {
    mongoose.model(m, new mongoose.Schema(models[m]))
}

module.exports = {
    getModel: function (name) {
        return mongoose.model(name)
    }
}