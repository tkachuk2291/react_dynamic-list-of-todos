import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api';
import { TodoModal } from '../TodoModal';
import { Loader } from '../Loader';

export interface TodoListProps {
  todoQuery: string;
  todoSearchQuery: string;
}


export const TodoList: React.FC<TodoListProps>= ({ todoQuery , todoSearchQuery }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectTodo, setSelectTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getTodos()
        .then((data) => {
          setTodos(data);
        })
        .finally(() => setLoading(false));
    }, 100);
  }, []);



  const filterTodos = (todos: Todo[], query: string, searchQuery: string) => {
    let filteredTodos = [...todos];

    if (query === "completed") {
      filteredTodos = filteredTodos.filter(todo => todo.completed);
    } else if (query === "active") {
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
    }

    if (searchQuery) {
      filteredTodos = filteredTodos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredTodos;
  };


  const visibleTodos = filterTodos(todos, todoQuery, todoSearchQuery);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <table className="table is-narrow is-fullwidth">
          <thead>
            <tr>
              <th>#</th>
              <th>
                <span className="icon">
                  <i className="fas fa-check" />
                </span>
              </th>
              <th>Title</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {visibleTodos.map(todo => (
              <tr data-cy="todo" className={selectTodo?.id  === todo.id ? "has-background-info-light" : ''} key={todo.id}>
                <td className="is-vcentered">{todo.id}</td>
                <td className="is-vcentered">
                  {todo.completed && (
                    <span className="icon" data-cy="iconCompleted">
                      <i className="fas fa-check" />
                    </span>
                  )}
                </td>
                <td className="is-vcentered is-expanded">
                  <p
                    className={
                      todo.completed ? ' has-text-success' : ' has-text-danger'
                    }
                  >
                    {todo.title}
                  </p>
                </td>

                <td className="has-text-right is-vcentered">
                  <button
                    data-cy="selectButton"
                    className="button"
                    type="button"
                    onClick={() => setSelectTodo(todo)}
                  >
                    <span className="icon">
                      {selectTodo?.id  === todo.id ? (
                        <i className="far fa-eye-slash " />
                      ) : (
                        <i className="far fa-eye" />
                      )}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectTodo && <TodoModal selectedTodo={selectTodo} setSelectTodo={setSelectTodo} />}
    </>
  );
};
