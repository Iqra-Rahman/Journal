import userModel from "../models/userModel.js";
import journalModel from "../models/journalModel.js";

export const addJournalEntry = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.userId;
    if (!title || !content) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }
        const newEntry = new journalModel({
            user: userId,
            title,
            content
        });
        await newEntry.save();

        const today = new Date();
        const last = user.lastJournalDate ? new Date(user.lastJournalDate) : null;

        // Get date strings in IST (YYYY-MM-DD format)
        const todayDateStr = today.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        const lastDateStr = last ? last.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) : null;

        console.log("=== STREAK CALCULATION ===");
        console.log({ todayDateStr, lastDateStr, currentStreak: user.currentStreak, lastJournalDate: user.lastJournalDate });

        if (!last) {
            user.currentStreak = 1;
            user.lastJournalDate = today;
        } else if (todayDateStr === lastDateStr) {
            // Same day - don't increment streak, don't update lastJournalDate
            console.log("Same day entry - streak unchanged");
        } else {
            // Different days - calculate difference
            const todayParts = todayDateStr.split('-').map(Number);
            const lastParts = lastDateStr.split('-').map(Number);
            
            const todayObj = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);
            const lastObj = new Date(lastParts[0], lastParts[1] - 1, lastParts[2]);
            
            const diffInDays = Math.round((todayObj - lastObj) / (1000 * 60 * 60 * 24));

            console.log({ diffInDays });

            if (diffInDays === 1) {
                user.currentStreak += 1;
                console.log("Consecutive day! New streak:", user.currentStreak);
            } else if (diffInDays > 1) {
                user.currentStreak = 1;
                console.log("Streak broken. Reset to 1");
            }
            
            // Update lastJournalDate when it's a different day
            user.lastJournalDate = today;
        }

        if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
        }

        await user.save();

        res.json({
            success: true, 
            message: 'Journal entry added successfully',
            entry: newEntry,
            streak: {
                current: user.currentStreak,
                longest: user.longestStreak
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getJournalEntries = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }
        const entries = await journalModel.find({ user: userId }).populate('user', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, entries });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const updateJournalEntry = async (req, res) => {
    const { entryId } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;
    if (!title || !content) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }
        const entry = await journalModel.findById(entryId);
        if (!entry) {
            return res.json({ success: false, message: 'Journal entry does not exist' });
        }
        if (entry.user.toString() !== userId) {
            return res.json({ success: false, message: 'You are not authorized to update this entry' });
        }
        entry.title = title;
        entry.content = content;
        await entry.save();
        res.json({ success: true, message: 'Journal entry updated successfully', entry });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}
export const deleteJournalEntry = async (req, res) => {
    const { entryId } = req.params;
    const userId = req.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }
        const entry = await journalModel.findById(entryId);
        if (!entry) {
            return res.json({ success: false, message: 'Journal entry does not exist' });
        }
        if (entry.user.toString() !== userId) {
            return res.json({ success: false, message: 'You are not authorized to delete this entry' });
        }
        // await entry.remove();
        await journalModel.findByIdAndDelete(entryId);
        res.json({ success: true, message: 'Journal entry deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}