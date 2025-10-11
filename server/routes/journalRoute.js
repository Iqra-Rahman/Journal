import express from 'express';
import { addJournalEntry, deleteJournalEntry, getJournalEntries, updateJournalEntry } from '../controllers/journalController.js';
import userAuth from '../middleware/userAuth.js';
const journalRouter = express.Router();

journalRouter.post('/add-entry', userAuth, addJournalEntry);
journalRouter.get('/entries', userAuth, getJournalEntries);
journalRouter.put('/update-entry/:entryId', userAuth, updateJournalEntry);
journalRouter.delete('/delete-entry/:entryId', userAuth, deleteJournalEntry);

export default journalRouter;