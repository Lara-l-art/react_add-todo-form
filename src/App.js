import React from 'react';
import './App.css';
import todos from './api/todos';
import users from './api/users';
import TodoList from './TodoList';

const preparedTodos = todos.map(element => ({
  ...element,
  user: users.find(item => item.id === element.userId),
}));

class App extends React.Component {
  state = {
    enteredValue: '',
    selectedUser: '',
    allTodos: preparedTodos,
    showErrorTitle: false,
    showErrorUser: false,
  }

  addValue = (event) => {
    this.setState({
      enteredValue: event.target.value,
    });
  }

  handleChange = (event) => {
    const { value } = event.target;
    const needUser = users.filter(item => item.id === +value);

    this.setState({
      selectedUser: needUser[0],
    });
  }

  addTodo = () => {
    if (this.state.enteredValue !== '' && this.state.selectedUser !== '') {
      this.setState(state => ({
        allTodos: [...state.allTodos, {
          title: state.enteredValue,
          id: state.allTodos.length + 1,
          userId: state.selectedUser.id,
          completed: false,
          user: state.selectedUser,
        }],
        enteredValue: '',
        selectedUser: '',
        showErrorUser: false,
        showErrorTitle: false,
      }));
    } else if (this.state.selectedUser === '') {
      this.setState(state => ({
        showErrorUser: true,
      }));
    }

    if (this.state.enteredValue === '') {
      this.setState(state => ({
        showErrorTitle: true,
      }));
    }
  }

  render() {
    const { showErrorUser,
      selectedUser,
      enteredValue,
      showErrorTitle,
      allTodos } = this.state;

    return (
      <div className="App">
        <h1 className="title is-1">Add todo form</h1>

        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          {showErrorUser && selectedUser === ''
            ? <div className="error error-user">Please choose a user</div>
            : ''}
          <label>
            <input
              type="text"
              className="input"
              name="enteredTodo"
              placeholder="What needs to be done?"
              value={enteredValue}
              onChange={this.addValue}
            />
          </label>

          {showErrorTitle && enteredValue === ''
            ? <div className="error error-title">Please enter the title</div>
            : ''}
          <div className="select">
            <label htmlFor="user">
              <select
                id="user"
                name="user"
                onChange={this.handleChange}
              >
                <option
                  value=""
                >
                  Choose a user
                </option>
                {users
                  .map(user => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <button
            className="button is-info is-outlined"
            type="submit"
            onClick={this.addTodo}
          >
            Add
          </button>
        </form>

        <TodoList todos={allTodos} />

      </div>
    );
  }
}

export default App;
