const mongoose = require('mongoose')


const registerSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    }
}, {
    timestamps: true
}
)

module.exports = mongoose.model("Register", registerSchema)