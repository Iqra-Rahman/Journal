import userModel from "../models/userModel.js";
import journalModel from "../models/journalModel.js";

export const addJournalEntry = async(req, res) => {
    const {title, content} = req.body;
    const userId = req.userId;  
    if(!title || !content) {
        return res.json({success: false, message: 'All fields are required'});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        const newEntry = new journalModel({
            user: userId,
            title,
            content
        });
        await newEntry.save();
        res.json({success: true, message: 'Journal entry added successfully', entry: newEntry});
    } catch (error) {
        res.json({success: false, message: error.message}); 
    }
}

export const getJournalEntries = async(req, res) => {
    const userId = req.userId;  
    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        const entries = await journalModel.find({user: userId}).populate('user', 'name email').sort({createdAt: -1});
        res.json({success: true, entries});
    } catch (error) {
        res.json({success: false, message: error.message}); 
    }
}

export const updateJournalEntry = async(req, res) => {
    const {entryId} = req.params;
    const {title, content} = req.body;
    const userId = req.userId;
    if(!title || !content) {
        return res.json({success: false, message: 'All fields are required'});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        const entry = await journalModel.findById(entryId);
        if(!entry) {
            return res.json({success: false, message: 'Journal entry does not exist'});
        }
        if(entry.user.toString() !== userId) {
            return res.json({success: false, message: 'You are not authorized to update this entry'});
        }
        entry.title = title;
        entry.content = content;
        await entry.save();
        res.json({success: true, message: 'Journal entry updated successfully', entry});
    }
    catch (error) {
        res.json({success: false, message: error.message}); 
    }
}
export const deleteJournalEntry = async(req, res) => {
    const {entryId} = req.params;
    const userId = req.userId;
    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        const entry = await journalModel.findById(entryId);
        if(!entry) {
            return res.json({success: false, message: 'Journal entry does not exist'});
        }
        if(entry.user.toString() !== userId) {
            return res.json({success: false, message: 'You are not authorized to delete this entry'});
        }
        // await entry.remove();
        await journalModel.findByIdAndDelete(entryId);
        res.json({success: true, message: 'Journal entry deleted successfully'});
    } catch (error) {
        res.json({success: false, message: error.message}); 
    }
}