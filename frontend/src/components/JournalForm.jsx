import React, { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JournalForm = ({ onSubmit, editEntry }) => {
  const [title, setTitle] = useState("");

  const saveDraft = () => {
    if (editEntry || !editor) return;
    const content = editor.getHTML();
    if (!title && content === "<p></p>") {
      localStorage.removeItem("journal-draft");
      return;
    }
    localStorage.setItem("journal-draft", JSON.stringify({ title, content }));
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Start writing your journal entry...",
        showOnlyWhenEditable: true,
        emptyNodeClass: "text-emerald-950/50 italic",
      }),
    ],
    content: "<p></p>", // ensures placeholder shows
    editorProps: {
      attributes: {
        class: "min-h-[350px] p-1 pt-7 text-emerald-950 border-none outline-none focus:outline-none focus:ring-0 focus:border-none",
      },
      handleClick: (view, pos, event) => {
        if (editor.isEmpty) {
          editor.commands.setTextSelection(0);
          return true; // Handle the event to prevent default behavior
        }
        return false; // Let default click handling proceed
      },
    },
    onUpdate: saveDraft,
  });

  useEffect(() => {
    if (editEntry) {
      setTitle(editEntry.title || "");
      editor?.commands.setContent(editEntry.content || "<p></p>");
    } else {
      const draft = JSON.parse(localStorage.getItem("journal-draft") || "{}");
      setTitle(draft.title || "");
      editor?.commands.setContent(draft.content || "<p></p>");
    }
  }, [editEntry, editor]);

  useEffect(() => {
    saveDraft();
  }, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editor.getHTML();

    if (!title.trim()) {
      toast.error("Please enter a title before saving your journal!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    if (content === "<p></p>") {
      toast.error("Your journal entry is empty!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    // 🟢 [ADDED] Success toast
    toast.success("Journal saved successfully!", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });

    onSubmit({ title, content });
    setTitle("");
    editor?.commands.clearContent();
    localStorage.removeItem("journal-draft");
  };

  if (!editor) return null;

  return (
    <form className="p-6 rounded-4xl shadow-lg mb-4 w-full min-h-screen flex flex-col">
      {/* Top row: Title + Toolbar + Save */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 p-2 rounded-4xl bg-white/10 text-emerald-950 focus:outline-none focus:border-0 focus:ring-0 border-0"
          />
        </div>

      {/* Toolbar */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 rounded-2xl border font-bold hover:bg-white/50 transition"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 rounded-2xl border italic hover:bg-white/50 transition"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-3 py-1 rounded-2xl border underline hover:bg-white/50 transition"
        >
          U
        </button>
        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="w-10 h-8 p-0 border-0 rounded hover:cursor-pointer"
        />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-gradient-to-t from-pink-500 to-pink-700 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-pink-800 transition"
      >
        {editEntry ? "Update Entry" : "Save"}
      </button>
    </div>

      {/* Editor */ }
  <div className="flex-1 flex flex-col">
    <EditorContent
      editor={editor}
      className="flex-1 bg-white rounded-4xl p-3 pt-7 text-emerald-950 focus:outline-none focus:ring-0 border-0"
    />
  </div>
    </form >
  );
};

export default JournalForm;