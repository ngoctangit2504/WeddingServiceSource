import { createSlice } from "@reduxjs/toolkit"

export const commentSlice = createSlice({
  name: "comment",
  initialState: {
    updateComments: false,
  },
  reducers: {
    render: (state) => {
      state.updateComments = !state.updateComments
    },
  },
})
export const { render } = commentSlice.actions

export default commentSlice.reducer
