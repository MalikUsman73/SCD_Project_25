import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Record", recordSchema);
