import { useEffect } from 'react';
import setupTodo from './script.js';
import './style.css';

function App() {
  // Chạy JS cũ sau khi React đã đưa giao diện lên trang.
  useEffect(function () {
    return setupTodo();
  }, []);

  return (

  <main className="todo-app">
    
    <header className="app-header">
      <p className="app-label">MỖI NGÀY MỘT CHÚT</p>
      <h1>Công việc của tôi<span className="title-dot">.</span></h1>
      <p className="app-description">Bắt đầu từ việc nhỏ nhất.</p>
    </header>

    
    <section className="add-task" aria-labelledby="add-task-title">
      <h2 id="add-task-title" className="input-label">Bạn muốn làm gì?</h2>
      <div className="task-input-row">
        <input type="text" id="task-input" className="task-input"
          placeholder="Ví dụ: Viết Javascript" aria-labelledby="add-task-title" />
        <button type="button" id="add-button" className="add-button">
          <span aria-hidden="true"></span> Thêm
        </button>
      </div>
    </section>

   
    <section className="task-section" aria-labelledby="task-list-title">
      <div className="list-header">
        <h2 id="task-list-title">Danh sách công việc</h2>
        
      </div>

      <ul id="task-list" className="task-list">
        <li className="task-item">
          <label className="task-label">
            <input type="checkbox" className="task-checkbox" />
            <span className="task-text">Hoàn thành giao diện</span>
          </label>
          <button type="button" className="delete-button"
            aria-label="Xóa công việc Hoàn thành giao diện">Xóa</button>
        </li>
        <li className="task-item">
          <label className="task-label">
            <input type="checkbox" className="task-checkbox" />
            <span className="task-text">Học JavaScript</span>
          </label>
          <button type="button" className="delete-button"
            aria-label="Xóa công việc Học JavaScript">Xóa</button>
        </li>
        <li className="task-item">
          <label className="task-label">
            <input type="checkbox" className="task-checkbox" defaultChecked />
            <span className="task-text">Học HTML và CSS</span>
          </label>
          <button type="button" className="delete-button"
            aria-label="Xóa công việc Học HTML và CSS">Xóa</button>
        </li>
      </ul>
      <p className="list-hint"></p>
    </section>
    <footer className="app-footer">###</footer>
  </main>
  

  );
}

export default App;
