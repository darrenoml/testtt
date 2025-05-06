import Modal from "./Modal";
import { useState } from "react";
import "../styles/editTodo.css";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // Import auth to access current user

function EditTodo({ id, toEditTitle, toEditDescription, onClose }) {
  const [title, setTitle] = useState(toEditTitle);
  const [description, setDescription] = useState(toEditDescription);

  const handleUpdate = async () => {
    const taskDocRef = doc(db, "todo", id);
    try {
      await updateDoc(taskDocRef, {
        title,
        description,
      });
      onClose(); // Close the modal and refresh the list
    } catch (err) {
      alert("Error updating todo: ", err);
    }
  };

  return (
    <div className="editTodo">
      <h2>Edit Todo</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={handleUpdate}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default EditTodo;