import dotenv from 'dotenv'
dotenv.config({ path: '../../.env.local' })
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const { Schema } = mongoose;

const userSchema = new Schema({
    file: { type: String, required: false },
    username: { type: String, required: true },
    name: { type: String, required: true },
    userSubscription: { type: Schema.Types.Mixed, required: false },
    email: {type: String, required: [true, "E-Mail ist erforderlich"], unique: true, lowercase: true, trim: true},
    provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
    password: {
        type: String,
        select: false,
        required: function () { return this.provider === "credentials"; },
        validate: {
        validator: function (v) {
            if (this.provider !== "credentials") return true;     
                return typeof v === "string" && v.length >= 8;        
            },
            message: "Passwort ist erforderlich und muss mind. 8 Zeichen haben.",
        },
    },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: {type: String, default: null},
    passwordResetExpires: {type: Date, default: null},
});


userSchema.pre("save", async function (next) {
  try {
    if (this.provider !== "credentials") return next();
    if (!this.isModified("password") || !this.password) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.provider !== "credentials") return false;

  let hash = this.password;
  if (!hash) {
    const fresh = await this.constructor.findById(this._id).select("+password");
    hash = fresh?.password;
  }
  if (!hash) return false; 
  return bcrypt.compare(candidatePassword, hash);
};


userSchema.index({ alarmActive: 1, alarmTime: 1 });

const connection = mongoose.createConnection(process.env.MONGODB_URI, { dbName: "plantsDatabase" });
const User = connection.model("User", userSchema); 


    
export default User;
