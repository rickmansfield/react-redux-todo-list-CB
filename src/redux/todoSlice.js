import { createSlice } from "@reduxjs/toolkit";
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
  }
});
export const {
  addTodo, 
  toggleComplete,
  deleteTodo
} = todoSlice.actions;
export default todoSlice.reducer;