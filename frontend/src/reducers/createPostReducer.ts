export const TITLE = "TITLE";
export const DESCRIPTION = "DESCRIPTION";
export const URL = "URL";
export const SET_VALUES = "SET_VALUES";

export const initialState = {
  title: {
    errorText: "",
    isErrorVisible: false,
    isValid: true,
    value: "",
  },
  description: {
    errorText: "",
    isErrorVisible: false,
    isValid: true,
    value: "",
  },
  url: {
    errorText: "",
    isErrorVisible: false,
    isValid: true,
    value: "",
  },
};

export type ActionType = "TITLE" | "DESCRIPTION" | "URL";

export type ActionPayload = {
  errorText?: string;
  isErrorVisible?: boolean;
  isValid?: boolean;
  value?: string;
};

type ReducerAction =
  | {
      type: "TITLE" | "DESCRIPTION" | "URL";
      payload: {};
    }
  | {
      type: "SET_VALUES";
      payload: {
        title: string;
        description: string;
        url: string;
      };
    };

export const reducer = (state: typeof initialState, action: ReducerAction) => {
  switch (action.type) {
    case TITLE:
    case DESCRIPTION:
    case URL:
      const option = action.type.toLowerCase() as
        | "title"
        | "description"
        | "url";
      return {
        ...state,
        [option]: { ...state[option], ...action.payload },
      };
    case SET_VALUES:
      return {
        title: { ...state.title, value: action.payload.title },
        description: {
          ...state.description,
          value: action.payload.description,
        },
        url: { ...state.url, value: action.payload.url },
      };
    default:
      return state;
  }
};
