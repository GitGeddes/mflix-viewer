// Mostly AI coded
import bcrypt from 'bcrypt'
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
  const user = this

  if (!user.isModified('password')) return
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return

      user.password = hash
    })
  })
})

export default mongoose.model('User', UserSchema)
