import React from "react";

const JournalCard = ({ entry, onEdit, onDelete }) => {

  const getPlainText = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const plainContent = getPlainText(entry.content);
  return (
    <div className="bg-white hover:bg-yellow-50 p-4 shadow-md mb-4">
      <div className="flex justify-between items-start">
      <h2 className="text-xl font-bold">{entry.title}</h2>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => onEdit(entry)}
          className="bg-gradient-to-t from-pink-500 to-pink-800 text-white rounded-full px-4 py-1 hover:from-pink-600 hover:to-pink-900 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(entry._id)}
          className="bg-gradient-to-t from-red-500 to-red-700 text-white rounded-full px-4 py-1 hover:from-red-600 hover:to-red-800 transition"
        >
          Delete
        </button>
      </div>
      </div>
      
      {/* Render rich text HTML */}
      <div
        className="text-gray-700 mt-2 line-clamp-2 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />

    </div>
  );
};

export default JournalCard;
