import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username wajib di isi"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "password wajib diisi"],
        minlength: 8,
        select: false,
    },
    email: {
        type: String,
        required: [true, "email wajib diisi"],
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Format email tidak valid']
    }
},
{
    timestamps: true,
    collection: 'users',
}
);

const User = mongoose.model("User", UserSchema);

export default User;