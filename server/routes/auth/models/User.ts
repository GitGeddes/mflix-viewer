// Mostly AI coded
import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    displayname: {
      type: String,
      required: true,
      unique: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

// Middleware to validate password hash when saving the document
UserSchema.pre('save', function () {
  if (!this.password || this.isModified('password')) {
    throw new Error('Password hash must be set externally')
  }
})

export default mongoose.model('User', UserSchema)
