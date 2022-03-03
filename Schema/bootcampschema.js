
const mongoose = require('mongoose')

const bootcampschema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    organizer: { type: String, required: true },
    organizer2: { type: String, required: true },
    phone1: { type: Number, required: true },
    phone2: { type: Number, required: true },
    userlimit: { type: Number, required: true },
    price: { type: Number, required: true },
    orgdate: { type: String, required: true },
    starttime: { type: String, required: true },
    endtime: { type: String, required: true },
    createdAt: { type: Date, required: true, default: new Date().valueOf() },
    userlists: { type: Array, required: true, default: [] },
    status: { type: String, required: true, default: "open" }
})

module.exports = mongoose.model('bootcamplist', bootcampschema)
