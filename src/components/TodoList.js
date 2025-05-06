import "../styles/todolist.css";
import { useState, useEffect } from "react";
import EditTodo from "./EditTodo";
import { doc, updateDoc, deleteDoc, query, where, getDocs, collection } from "firebase/firestore"; // Import collection here
import { db, auth } from "../firebase"; // Import auth to access current user

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState({ edit: false, view: false });
  const [currentTodo, setCurrentTodo] = useState(null); // State to hold the current todo for editing

  const handleClose = () => {
    setOpen({ edit: false, view: false });
  };

  /* function to fetch todos for the current user */
  const fetchTodos = async () => {
    const userId = auth.currentUser.uid; // Get the current user's ID
    const q = query(collection(db, "todo"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const todosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTodos(todosList);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  /* function to update document in firestore */
  const handleCheckedChange = async (id, checked) => {
    const taskDocRef = doc(db, "todo", id);
    try {
      await updateDoc(taskDocRef, {
        completed: checked,
      });
      fetchTodos(); // Refresh the todo list after updating
    } catch (err) {
      alert(err);
    }
  };

  /* function to delete a document from firestore */
  const handleDelete = async (id) => {
    const taskDocRef = doc(db, "todo", id);
    try {
      await deleteDoc(taskDocRef);
      fetchTodos(); // Refresh the todo list after deletion
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="todoList">
      {todos.map(todo => (
        <div key={todo.id}>
          <input
            id={`checkbox-${todo.id}`}
            className="checkbox-custom"
            name="checkbox"
            checked={todo.completed}
            type="checkbox"
            onChange={() => handleCheckedChange(todo.id, !todo.completed)}
          />
          <label htmlFor={`checkbox-${todo.id}`} onClick={() => handleCheckedChange(todo.id, !todo.completed)}></label>
          <h2>{todo.title}</h2>
          <p>{todo.description}</p>
          <button onClick={() => { 
            console.log("Editing todo:", todo); // Log the todo being edited
            setCurrentTodo(todo); 
            setOpen({ ...open, edit: true }); 
          }}>Edit</button>
          <button onClick={() => handleDelete(todo.id)}>Delete</button>
        </div>
      ))}
      {open.edit && currentTodo && (
        <EditTodo
          onClose={() => {
            handleClose();
            fetchTodos(); // Refresh the todo list after editing
          }}
          id={currentTodo.id}
          userId={currentTodo.userId}
          toEditTitle={currentTodo.title}
          toEditDescription={currentTodo.description}
        />
      )}
    </div>
  );
}

export default TodoList;