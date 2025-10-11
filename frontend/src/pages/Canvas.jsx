// import React, { useEffect, useState, useContext } from "react";
// import { AppContent } from "../context/AppContext.jsx";
// import { createJournalApi } from "../api/JournalApi.jsx";
// import JournalCard from "../components/JournalCard.jsx";
// import JournalForm from "../components/JournalForm.jsx";
// import { toast } from "react-toastify";

// const Canvas = () => {
//   const { backendUrl } = useContext(AppContent);
//   const journalApi = createJournalApi(backendUrl);

//   const [entries, setEntries] = useState([]);
//   const [editEntry, setEditEntry] = useState(null);

//   const fetchEntries = async () => {
//     try {
//       const res = await journalApi.getEntries();
//       if (res.data.success) setEntries(res.data.entries);
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   const handleAdd = async (data) => {
//     try {
//       if (editEntry) {
//         const res = await journalApi.updateEntry(editEntry._id, data);
//         if (res.data.success) {
//           fetchEntries();
//           toast.success("Entry updated successfully");
//         }
//         setEditEntry(null);
//       } else {
//         const res = await journalApi.addEntry(data);
//         if (res.data.success) {
//           fetchEntries();
//           toast.success("Entry added successfully");
//         }
//       }
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   // const handleDelete = async (id) => {
//   //   try {
//   //     const res = await journalApi.deleteEntry(id);
//   //     if (res.data.success) {
//   //       fetchEntries();
//   //       toast.success("Entry deleted successfully");
//   //     }
//   //   } catch (err) {
//   //     toast.error(err.message);
//   //   }
//   // };

//   const handleEdit = (entry) => setEditEntry(entry);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">My Journal</h1>
//       <JournalForm onSubmit={handleAdd} editEntry={editEntry} />
//       {entries.length === 0 ? (
//         <div className="text-gray-500">No journal entries found.</div>
//       ) : (
//         entries.map((entry) => (
//           <JournalCard
//             key={entry._id}
//             entry={entry}
//             onEdit={handleEdit}
//             // onDelete={handleDelete}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Canvas;


import React, { useEffect, useState } from "react";
import { AppContent } from "../context/AppContext.jsx";
import { createJournalApi } from "../api/JournalApi.jsx";
import JournalForm from "../components/JournalForm.jsx";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const Canvas = () => {
  const { backendUrl } = React.useContext(AppContent);
  const journalApi = createJournalApi(backendUrl);
  const location = useLocation();
  const navigate = useNavigate();

  const editingEntry = location.state?.entry || null;
  const [editEntry, setEditEntry] = useState(null);

  useEffect(() => {
    if (editingEntry) {
      setEditEntry(editingEntry);
    }
  }, [editingEntry]);

  const handleAdd = async (data) => {
    try {
      if (editEntry) {
        const res = await journalApi.updateEntry(editEntry._id, data);
        if (res.data.success) {
          toast.success("Entry updated successfully");
        }
        navigate('/journals');
        setEditEntry(null);
      } else {
        const res = await journalApi.addEntry(data);
        if (res.data.success) {
          toast.success("Entry added successfully");
          navigate('/journals');
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{editEntry ? "Edit your Journal" : "Write a Journal"}</h1>
      <JournalForm onSubmit={handleAdd} editEntry={editEntry} />
    </div>
  );
};

export default Canvas;
