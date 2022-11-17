import { ActionPayload } from "./createPostReducer";

export const EMAIL = "EMAIL";
export const PASSWORD = "PASSWORD";

export const initialState = {
  email: {
    errorText: "",
    isActive: false,
    isErrorVisible: false,
    isFocused: false,
    isValid: true,
    value: "",
  },
  password: {
    errorText: "",
    isActive: false,
    isErrorVisible: false,
    isFocused: false,
    isValid: true,
    value: "",
  },
};

type ActionType = {
  type: "EMAIL" | "PASSWORD";
  payload: ActionPayload;
};

export const reducer = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case EMAIL:
    case PASSWORD:
      const option = action.type.toLowerCase() as "email" | "password";
      return {
        ...state,
        [option]: {
          ...state[option],
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
