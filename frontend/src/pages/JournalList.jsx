// src/pages/JournalList.jsx
import React, { useEffect, useState, useContext } from "react";
import { AppContent } from "../context/AppContext.jsx";
import { createJournalApi } from "../api/JournalApi.jsx";
import JournalCard from "../components/JournalCard.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const JournalList = () => {
  const { backendUrl } = useContext(AppContent);
  const journalApi = createJournalApi(backendUrl);
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const fetchEntries = async () => {
    try {
      const res = await journalApi.getEntries();
      if (res.data.success) setEntries(res.data.entries);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEdit = (entry) => {
    navigate("/canvas", { state: { entry } });
  };

  const handleDelete = async () => {
    // const confirm = window.confirm("Are you sure you want to delete this journal?");
    // if (!confirm) return;

    try {
      const res = await journalApi.deleteEntry(deleteId);
      if (res.data.success) {
        toast.success("Journal deleted successfully!");
        setEntries(entries.filter((entry) => entry._id !== deleteId));
      } else {
        toast.error("Failed to delete journal.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally{
        setDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Journals</h1>
      {entries.length === 0 ? (
        <div className="text-gray-500">No journal entries found.</div>
      ) : (
        entries.map((entry) => (
          <JournalCard
            key={entry._id}
            entry={entry}
            onEdit={() => handleEdit(entry)}
            onDelete={() => setDeleteId(entry._id)} 
          />
        ))
      )}

      {/* Confirmation modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this journal? This action cannot be undone."
        />
    </div>
  );
};

export default JournalList;
