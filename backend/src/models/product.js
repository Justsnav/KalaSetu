const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title : {
        type : String,
        required : true
    },
    description : String,
    price :{
        type : Number,
        required : true
    },
    category: {
        type: String,
        required: true
    },
    artForm: {
        type: String,
        required: true
    },
    image : [String],
    material : [String],
    dimensions : {
        height : String,
        width : String,
        depth : String,
        unit : String
    },
    stock : Number,
    story : String,
    model3D : {
        enabled : Boolean,
        glbUrl : String,
        usdzUrl : String,
    },
    status : String,
    createdAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    }
})
const product = mongoose.model("Product", productSchema);

module.exports = product