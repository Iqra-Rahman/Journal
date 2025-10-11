import mongoose from "mongoose";
import { JOURNAL_STATUS } from "../utils/constants.js";

const journalSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    status: {type: String, enum: Object.values(JOURNAL_STATUS), default: JOURNAL_STATUS.PRIVATE},
}, {timestamps: true});

const journalModel = mongoose.models.journal || mongoose.model('journal', journalSchema);

export default journalModel;
