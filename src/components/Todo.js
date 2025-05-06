import Modal from "./Modal";
import "../styles/todo.css";

function Todo({ onClose, open, title, description }) {
  return (
    <Modal modalLable="Todo" onClose={onClose} open={open}>
      <div className="todo updated-todo">
        <h2 className="todo__title">{title}</h2>
        <p className="todo__description">{description}</p>
      </div>
    </Modal>
  );
}

export default Todo;
