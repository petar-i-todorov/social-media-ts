import { ActionPayload } from "./createPostReducer";
import { EMAIL } from "./loginReducer";

export const initialState = {
  errorText: "",
  isActive: false,
  isErrorVisible: false,
  isFocused: false,
  isValid: true,
  value: "",
};

export const reducer = (
  state: typeof initialState,
  action: { type: "EMAIL"; payload: ActionPayload }
) => {
  switch (action.type) {
    case EMAIL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
