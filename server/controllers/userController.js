import userModel from "../models/userModel.js";

export const getUserData = async(req, res) => {

    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        })
    } catch (error) {
        res.json({success: false, message: error.message}); 
    }
}

export const getUserStreak = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      streak: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastJournalDate: user.lastJournalDate
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
