const monooge =require('mongoose')

const ContactUsSchema = monooge.Schema({
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: 'Unread',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports=monooge.model('ContactUs',ContactUsSchema)