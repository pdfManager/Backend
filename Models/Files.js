// const mongoose = require('mongoose')

// const { Schema } = mongoose;

// const UserSchema = new Schema({
//     email:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     file: [
//         {
//           type: String,
//           required: true,
//         },
//       ],
//   });
// const File = mongoose.model('File', UserSchema);
// module.exports = File;


const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  file: [
    {
      type: String,
      required: true,
    },
  ],
  shareableLinks: [
    {
      id: {
        type: String,
        required: true,
      },
      fileName: {
        type: String,
        required: true,
      },
    },
  ],
});

const File = mongoose.model('File', UserSchema);
module.exports = File;
