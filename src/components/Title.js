import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "../styles/title.css";
import TodoList from "./TodoList";
import AddTodo from "./AddTodo";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  where,
} from "firebase/firestore";
import { auth, db, logout } from "../firebase";

function Title() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [todos, setTodos] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = () => {
    try {
      //const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      //const doc = await getDocs(q);
      //console.log(auth._currentUser.displayName);
      //const data = doc.docs[0].data();
      //console.log(doc);
      setName(auth._currentUser.displayName);
    } catch (err) {
      console.error(err);
      //alert("Wakaka An error occured while fetching user data");
    }
  };

  const loadTodo = () => {
    const q = query(collection(db, "todo"), orderBy("created", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setTodos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    loadTodo();
    fetchUserName();
  }, [user, loading]);

  /* function to get all tasks from firestore in realtime */
  //useEffect(() => {

  //}, []);

  return (
    <div className="title">
      <header>Todo App</header>
      <div className="">
        <div className="">
          Logged in as
          <div>{name}</div>
          <div>{user?.email}</div>
          <button className="dashboard__btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="title__container">
        <button onClick={() => setOpenAddModal(true)}>New Task +</button>
        <div className="title__tasks">
          {todos.map((todolist) => (
            <TodoList
              id={todolist.id}
              key={todolist.id}
              completed={todolist.data.completed}
              title={todolist.data.title}
              description={todolist.data.description}
            />
          ))}
        </div>
      </div>

      {openAddModal && (
        <AddTodo onClose={() => setOpenAddModal(false)} open={openAddModal} />
      )}
    </div>
  );
}

export default Title;
