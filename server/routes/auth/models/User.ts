// Mostly AI coded
import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
  {
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
    passwordHash: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      sparse: true,
    },
    resetPasswordExpires: {
      type: Date,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  { timestamps: true },
)

// Middleware to validate password hash when saving the document
UserSchema.pre('save', function () {
  if (!this.passwordHash || this.isModified('passwordHash')) {
    throw new Error('Password hash must be set externally')
  }
})

export default mongoose.model('User', UserSchema)
