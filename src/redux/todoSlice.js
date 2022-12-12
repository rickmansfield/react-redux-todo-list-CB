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
    }
  }
});
export const {
  addTodo, 
  toggleComplete,
  deleteTodo
} = todoSlice.actions;
export default todoSlice.reducer;