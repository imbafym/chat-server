const express = require('express')
const utils = require('utility')

const Router = express.Router()
const model = require('./moudle')
const User = model.getModel('user')
const Chat = model.getModel('chat')

const _filter = { 'pwd': 0, '__v': 0 }

Router.get('/list', function (req, res) {
    // User.remove({},function(e,d){})
    const { type } = req.query
    User.find({ type }, function (err, doc) {
        return res.json({ code: 0, data: doc })
    })
})

Router.get('/getMsgList', function (req, res) {
    const user = req.cookies.userid
    // Chat.remove({},function(e,d){})
    let users = {}
    User.find({}, function (err, doc) {

        doc.forEach(v => {
            users[v._id] = { name: v.user, avatar: v.avatar }
        })
    })
    Chat.find({ '$or': [{ from: user }, { to: user }] }, function (err, doc) {
        if (!err) {
            // console.log(doc + ' get msg llist')
            return res.json({ code: 0, msgs: doc, users: users })
        }
    })
})
Router.post('/readmsg', function (req, res) {
    const user = req.cookies.userid

    const { from } = req.body
    // console.log(user, from)
    Chat.update(
        { from, to: user },
        { '$set': { read: true } },
        { 'multi': true },
            function(err, doc){
            if(!err) {
                // console.log(doc)
                return res.json({ code: 0, num: doc.nModified })
            }
        return res.json({ code: 1, msg: 'reda msg failed' })
        })
})

Router.post('/login', function (req, res) {

    const { user, pwd } = req.body
    User.findOne({ user, pwd: md5Pwd(pwd) }, { 'pwd': 0 }, function (err, doc) {
        if (!doc) {
            return res.json({ code: 1, msg: 'username or password incorrect' })
        }
        res.cookie('userid', doc._id)
        return res.json({ code: 0, data: doc })

    })

})
Router.post('/update', function (req, res) {
    const userid = req.cookies.userid
    if (!userid) {
        return json.dumps({ code: 1 })
    }
    const body = req.body
    User.findByIdAndUpdate(userid, body, function (err, doc) {
        const data = Object.assign({}, {
            user: doc.user,
            type: doc.type
        }, body)
        // console.log(doc + ' this is doc')
        // console.log(JSON.stringify (body) + ' this is body')
        // console.log(JSON.stringify (data) + ' this is data')

        return res.json({ code: 0, data })
    })


})

Router.post('/register', function (req, res) {
    // console.log(req.body)
    const { user, pwd, type } = req.body
    User.findOne({ user: user }, function (err, doc) {
        if (doc) {
            return res.json({ code: 1, msg: 'user name existed' })
        }

        const userModel = new User({ user, pwd: md5Pwd(pwd), type })
        userModel.save(function (e, d) {
            if (e) {
                return res.json({ code: 1, msg: 'backend error' })
            }
            const { user, type, _id } = d
            res.cookie('userid', _id)
            return res.json({ code: 0, data: { user } })
        })
        // create 不好 因爲無法得到_id
        // User.create({ user, pwd: md5Pwd(pwd), type }, function (e, d) {
        //     if (e) {
        //         return res.json({ code: 1, msg: 'backend error' })
        //     }

        //     return res.json({ code: 0 })
        // })
    })
})

Router.get('/info', function (req, res) {
    const { userid } = req.cookies
    if (!userid) {
        return res.json({ code: 1 })
    }
    User.findOne({ _id: userid }, _filter, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: 'backend error' })
        }
        if (doc) {
            return res.json({ code: 0, data: doc })
        }
    })
    //if user has cookies 

    return
})

function md5Pwd(pwd) {
    const salt = 'this_is_salt_57348x8Yfg#!asd@'
    return utils.md5(utils.md5(pwd + salt))
}



module.exports = Router