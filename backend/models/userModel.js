const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:  {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });
userSchema.pre('save', async function() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.compare = function(pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model('User', userSchema);
