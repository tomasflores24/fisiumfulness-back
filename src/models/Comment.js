const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const Comment = new Schema({
  _id: {
    type: String,
    default: function () {
      return new ObjectId().toString();
    },
  },
  user_id:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  },
  user_email:{
    type:String,
    required:true
  },
  user_name:{
    type:String,
    required:true
  },
  blog_id:{
    type:String,
    required:true
  },
  status:{
    type:Boolean,
    default:true
  }
},{ timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });



module.exports = model("Comment", Comment);


