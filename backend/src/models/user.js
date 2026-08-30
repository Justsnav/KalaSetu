const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    role : {
        type: String,
        enum: ["buyer", "artisan"],
        default: "buyer"
    },
    profileImage: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    craft: {
        type: String,
        default: ""
    },
    artForm: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    story: {
        type: String,
        default: ""
    },
    experience: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return; // skip hashing, nothing more to do
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const user = mongoose.model("User",userSchema);

module.exports = user;