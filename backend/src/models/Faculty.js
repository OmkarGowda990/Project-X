import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

let FacultyTest = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: Number
  },
  department: {
    type: String
  },
  token: {
    type: String
  },
  mentees: {
    type: [{ type : _Schema.Types.ObjectId, ref: 'Student' }]
  }

  
});

export default model("FacultyTest", FacultyTest);