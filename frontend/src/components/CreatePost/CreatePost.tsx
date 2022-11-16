import React from "react";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import Button from "../Button/Button";
import BouncingDotsLoader from "../BouncingDotsLoader/BouncingDotsLoader";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { PostsContext } from "../../contexts/PostsContext";
import FormMessage from "../FormMessage/FormMessage";
import ModalBuilder from "../ModalBuilder/ModalBuilder";
import { IPost, Platform } from "../../types/feed";
import { PostIdContext } from "../../contexts/PostIdContext";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";
import { createPost, updatePost } from "../../api/posts";
import SourceOptions from "../SourceOptions/SourceOptions";
import { defaultFlashMessageConfig } from "../../constants/feed";
import {
  reducer as formReducer,
  initialState as formInitialState,
  TITLE,
  DESCRIPTION,
  URL,
  SET_VALUES,
} from "../../reducers/createPostReducer";

interface CreatePostProps {
  editPost?: boolean;
  postToEdit?: IPost;
  setClosingConfirmationVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const useValidate = () => {
  const [formState, dispatch] = React.useReducer(formReducer, formInitialState);

  React.useEffect(() => {
    if (formState.title.isErrorVisible) {
      dispatch({
        type: TITLE,
        payload: {
          errorText: "Title has to be at least 5 symbols.",
          isValid: false,
        },
      });
    }
  }, [formState.title.isErrorVisible]);

  React.useEffect(() => {
    if (formState.description.isErrorVisible) {
      dispatch({
        type: DESCRIPTION,
        payload: {
          errorText:
            "Description has to be at least 20 symbols. Please, describe the course with more details.",
          isValid: false,
        },
      });
    }
  }, [formState.description.isErrorVisible]);

  React.useEffect(() => {
    if (formState.url.isErrorVisible) {
      dispatch({
        type: URL,
        payload: {
          errorText: "Invalid URL.",
          isValid: false,
        },
      });
    }
  }, [formState.url.isErrorVisible]);

  return {
    formState,
    dispatch,
  };
};

const CreatePost: React.FC<CreatePostProps> = ({
  setClosingConfirmationVisibility,
  editPost,
  postToEdit,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<Platform>();
  const [isHighlighted, setIsHighlighted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFormError, setIsFormError] = React.useState(false);
  const [formErrorText, setFormErrorText] = React.useState("");

  const { setFeedFlashMessageConfiguration, setIsFeedFlashMessage } =
    React.useContext(FlashMessageContext);
  const { postId } = React.useContext(PostIdContext);
  const { setPosts, posts, devRole } = React.useContext(PostsContext);
  const { setAddPostVisibility, setEditPostVisibility } = React.useContext(
    ModalsManipulationContext
  );

  const { formState, dispatch } = useValidate();

  React.useEffect(() => {
    if (postToEdit) {
      dispatch({
        type: SET_VALUES,
        payload: {
          title: postToEdit.title,
          description: postToEdit.description,
          url: postToEdit.url,
        },
      });
      setSelectedOption(postToEdit.platform);
    }
  }, [postToEdit]);

  const editPostFunction = async () => {
    const res = await updatePost({
      id: postId,
      title: formState.title.value,
      description: formState.description.value,
      devRole,
      platform: selectedOption,
      url: formState.url.value,
    });
    setIsLoading(false);
    setEditPostVisibility(false);
    if (res.status === 200) {
      const resData = await res.json();
      const indexOfUpdatedPost = posts
        .map((post) => post._id)
        .indexOf(resData.updatedPost._id.toString());
      const updatedPosts = JSON.parse(JSON.stringify(posts));
      updatedPosts[indexOfUpdatedPost] = resData.updatedPost;
      setPosts(updatedPosts);
      setIsFeedFlashMessage(true);
      setFeedFlashMessageConfiguration({
        text: resData.message,
        color: "green",
      });
    } else {
      setIsFeedFlashMessage(true);
      setFeedFlashMessageConfiguration(defaultFlashMessageConfig);
    }
  };

  const createPostFunction = async () => {
    const res = await createPost({
      title: formState.title.value,
      description: formState.description.value,
      url: formState.url.value,
      platform: selectedOption,
      devRole,
    });
    setIsLoading(false);
    if (res.status === 200 || res.status === 201) {
      const resData = await res.json();
      setPosts((posts) => [resData.createdPost, ...posts]);
      setAddPostVisibility(false);
      setIsFeedFlashMessage(true);
      setFeedFlashMessageConfiguration({
        text: "Post was successfully created.",
        color: "green",
      });
    } else {
      const resData = await res.json();
      setFormErrorText(resData.message);
      setIsFormError(true);
    }
  };

  const onFormSubmit = async () => {
    if (formState.title.value.length < 5) {
      dispatch({ type: TITLE, payload: { isErrorVisible: true } });
    } else if (formState.description.value.length < 20) {
      dispatch({ type: DESCRIPTION, payload: { isErrorVisible: true } });
    } else if (formState.url.value.length < 10) {
      dispatch({ type: URL, payload: { isErrorVisible: true } });
    } else if (!selectedOption) {
      setIsHighlighted(true);
    } else {
      setIsLoading(true);
      try {
        if (editPost && postToEdit) {
          editPostFunction();
        } else {
          createPostFunction();
        }
      } catch (err) {
        setIsFeedFlashMessage(true);
        setFeedFlashMessageConfiguration(defaultFlashMessageConfig);
      }
    }
  };

  return (
    <ModalBuilder
      onOverlayClick={() => setClosingConfirmationVisibility(true)}
      onFormSubmit={onFormSubmit}
    >
      <>
        <h2>Source info</h2>
        <Input errorPosition="RIGHT" placeholder="Title" type="text" />
        <TextArea
          errorMessage={formState.description.errorText}
          isErrorMessageVisible={formState.description.isErrorVisible}
          isValid={formState.description.isValid}
          label="Description"
          setIsErrorMessageVisible={setIsDescriptionErrorMessageVisible}
          setIsValid={setIsDescriptionValid}
          value={formState.description.value}
          onChange={(event) => {
            dispatch({
              type: DESCRIPTION,
              payload: { value: (event.target as HTMLInputElement).value },
            });
          }}
          onBlur={() => {
            if (formState.description.value.length < 20) {
              dispatch({
                type: DESCRIPTION,
                payload: {
                  errorText:
                    "Description has to be at least 20 symbols. Please, describe the course with more details.",
                  isValid: false,
                },
              });
            }
          }}
        />
        <Input
          type="url"
          placeholder="Source URL"
          value={formState.url.value}
          errorPosition="RIGHT"
          isValid={formState.url.isValid}
          setIsValid={setIsUrlValid}
          errorMessage={formState.url.errorText}
          isErrorMessageVisible={formState.url.isErrorVisible}
          setIsErrorMessageVisible={setIsUrlErrorMessageVisible}
          onChange={(event) => {
            dispatch({
              type: URL,
              payload: { value: (event.target as HTMLInputElement).value },
            });
          }}
          onBlur={() => {
            if (formState.url.value.length < 10) {
              dispatch({
                type: URL,
                payload: { errorText: "Invalid URL.", isValid: false },
              });
            }
          }}
        />
        <SourceOptions
          isHighlighted={isHighlighted}
          setIsHighlighted={setIsHighlighted}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        {isFormError && <FormMessage color="red">{formErrorText}</FormMessage>}
        <Button color="green" type="submit">
          {isLoading ? <BouncingDotsLoader text="Submitting" /> : "Submit"}
        </Button>
      </>
    </ModalBuilder>
  );
};

export default CreatePost;
