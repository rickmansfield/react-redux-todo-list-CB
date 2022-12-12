import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// a Thunk is a function that returns another function
export const getTodosAsync = createAsyncThunk(
  'todos/getTodosAsync',
  async () => {
    const response = await fetch('http://localhost:7000/todos');
    if (response.ok) {
      const todos = await response.json();
      return { todos };
    }
  }
);

export const addTodoAsync = createAsyncThunk(
  'todos/addTodoAsync',
  async (payload) => {
  const response = await fetch('http://localhost:7000/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title: payload.title})
  });
  if (response.ok) {
    const todo = await response.json();
    return { todo };
  }
});

export const toggleCompleteAsync = createAsyncThunk(
  'todos/completeTodoAsync',
  async (payload) => {
    const response = await fetch(`http://localhost:7000/todos/${payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({completed: payload.completed})
    });
    if (response.ok) {
      const todo = await response.json();
      return { id: todo.id, completed: todo.completed };
    }
  }
);

export const deleteTodoAsync = createAsyncThunk(
  'todos/deleteTodoAsync',
  async (payload) => {
    const response = await fetch(`http://localhost:7000/todos/${payload.id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      return { id: payload.id };
    }
  }
);
//slice is a collection of reducers and actions
const todoSlice = createSlice({
  name: "todos",
  initialState: [
    { id: 1, title: "todo1", completed: false },
    { id: 2, title: "todo2", completed: false },
    { id: 3, title: "todo3", completed: false },
  ],
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        title: action.payload.title,
        completed: false,
      };
      state.push(newTodo);
    },
    toggleComplete: (state, action) => {
      //find the index of the todo that matches the id of the payload
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      //toggle the completed property
      state[index].completed = action.payload.completed;
    },
    deleteTodo: (state, action) => {
      //find the index of the todo that matches the id of the payload
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      //remove the todo from the array
      state.splice(index, 1);
    }
    // alternative syntax to deleteTodo
    // deleteTodo: (state, action) => {
    //   return state.filter((todo) => todo.id !== action.payload.id);
    // }
  },
  extraReducers: {
    [getTodosAsync.pending]: (state, action) => {
      console.log('loading todos...');
    },
    [getTodosAsync.fulfilled]: (state, action) => {
      console.log('todos loaded YAAAAY!');
      return action.payload.todos;
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      state.push(action.payload.todo);
    },
    [toggleCompleteAsync.fulfilled]: (state, action) => {
      const index = state.findIndex(
        (todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
    [deleteTodoAsync.fulfilled]: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload.id);
    }
  }
});
export const {
  addTodo, 
  toggleComplete,
  deleteTodo
} = todoSlice.actions;
export default todoSlice.reducer;