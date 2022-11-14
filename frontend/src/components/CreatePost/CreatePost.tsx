import {
  useContext,
  useEffect,
  useState,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
} from "react";
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
import { createPost, updatePost } from "./utils";
import SourceOptions from "../SourceOptions/SourceOptions";
import { defaultFlashMessageConfig } from "../../constants/feed";

interface CreatePostProps {
  editPost?: boolean;
  postToEdit?: IPost;
  setClosingConfirmationVisibility: Dispatch<SetStateAction<boolean>>;
}

const useValidate = () => {
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [isTitleErrorMessageVisible, setIsTitleErrorMessageVisible] =
    useState(false);

  useEffect(() => {
    if (isTitleErrorMessageVisible) {
      setTitleErrorMessage("Title has to be at least 5 symbols.");
      setIsTitleValid(false);
    }
  }, [isTitleErrorMessageVisible]);

  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [
    isDescriptionErrorMessageVisible,
    setIsDescriptionErrorMessageVisible,
  ] = useState(false);

  useEffect(() => {
    if (isDescriptionErrorMessageVisible) {
      setDescriptionErrorMessage(
        "Description has to be at least 20 symbols. Please, describe the course with more details."
      );
      setIsDescriptionValid(false);
    }
  }, [isDescriptionErrorMessageVisible]);

  const [isUrlValid, setIsUrlValid] = useState(true);
  const [urlErrorMessage, setUrlErrorMessage] = useState("");
  const [isUrlErrorMessageVisible, setIsUrlErrorMessageVisible] =
    useState(false);

  useEffect(() => {
    if (isUrlErrorMessageVisible) {
      setUrlErrorMessage("Invalid Url.");
      setIsUrlValid(false);
    }
  }, [isUrlErrorMessageVisible]);

  return {
    descriptionErrorMessage,
    isDescriptionErrorMessageVisible,
    isDescriptionValid,
    isTitleErrorMessageVisible,
    isTitleValid,
    isUrlErrorMessageVisible,
    isUrlValid,
    setDescriptionErrorMessage,
    setIsDescriptionErrorMessageVisible,
    setIsDescriptionValid,
    setIsTitleErrorMessageVisible,
    setIsTitleValid,
    setIsUrlErrorMessageVisible,
    setIsUrlValid,
    setTitleErrorMessage,
    setUrlErrorMessage,
    titleErrorMessage,
    urlErrorMessage,
  };
};

const CreatePost: FC<CreatePostProps> = ({
  setClosingConfirmationVisibility,
  editPost,
  postToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [selectedOption, setSelectedOption] = useState<Platform>();
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormError, setIsFormError] = useState(false);
  const [formErrorText, setFormErrorText] = useState("");

  const { setFeedFlashMessageConfiguration, setIsFeedFlashMessage } =
    useContext(FlashMessageContext);
  const { postId } = useContext(PostIdContext);
  const { setPosts, posts, devRole } = useContext(PostsContext);
  const { setAddPostVisibility, setEditPostVisibility } = useContext(
    ModalsManipulationContext
  );

  const { isTitleValid, setIsTitleValid } = useValidate();

  const {
    descriptionErrorMessage,
    isDescriptionErrorMessageVisible,
    isDescriptionValid,
    isTitleErrorMessageVisible,
    isUrlErrorMessageVisible,
    isUrlValid,
    setDescriptionErrorMessage,
    setIsDescriptionErrorMessageVisible,
    setIsDescriptionValid,
    setIsTitleErrorMessageVisible,
    setIsUrlErrorMessageVisible,
    setIsUrlValid,
    setTitleErrorMessage,
    setUrlErrorMessage,
    titleErrorMessage,
    urlErrorMessage,
  } = useValidate();

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setDescription(postToEdit.description);
      setUrl(postToEdit.url);
      setSelectedOption(postToEdit.platform);
    }
  }, [postToEdit]);

  const editPostFunction = useCallback(async () => {
    const res = await updatePost({
      id: postId,
      title,
      description,
      devRole,
      platform: selectedOption,
      url,
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
  }, [
    description,
    devRole,
    postId,
    posts,
    selectedOption,
    setEditPostVisibility,
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
    setPosts,
    title,
    url,
  ]);

  const createPostFunction = useCallback(async () => {
    const res = await createPost({
      title,
      description,
      url,
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
  }, [
    description,
    devRole,
    selectedOption,
    setAddPostVisibility,
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
    setPosts,
    title,
    url,
  ]);

  const onFormSubmit = useCallback(async () => {
    if (title.length < 5) {
      setIsTitleErrorMessageVisible(true);
    } else if (description.length < 20) {
      setIsDescriptionErrorMessageVisible(true);
    } else if (url.length < 10) {
      setIsUrlErrorMessageVisible(true);
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
  }, [
    title.length,
    description.length,
    url.length,
    selectedOption,
    setIsTitleErrorMessageVisible,
    setIsDescriptionErrorMessageVisible,
    setIsUrlErrorMessageVisible,
    editPost,
    postToEdit,
    editPostFunction,
    createPostFunction,
    setIsFeedFlashMessage,
    setFeedFlashMessageConfiguration,
  ]);

  return (
    <ModalBuilder
      onOverlayClick={() => {
        setClosingConfirmationVisibility(true);
      }}
      onFormSubmit={onFormSubmit}
    >
      <>
        <h2>Source info</h2>
        <Input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          errorPosition="RIGHT"
          isValid={isTitleValid}
          setIsValid={setIsTitleValid}
          errorMessage={titleErrorMessage}
          isErrorMessageVisible={isTitleErrorMessageVisible}
          setIsErrorMessageVisible={setIsTitleErrorMessageVisible}
          onChange={(event) => {
            setTitle((event.target as HTMLInputElement).value);
          }}
          onBlur={() => {
            if (title.length < 5) {
              setTitleErrorMessage("Title has to be at least 5 symbols.");
              setIsTitleValid(false);
            }
          }}
        />
        <TextArea
          errorMessage={descriptionErrorMessage}
          id="description"
          isErrorMessageVisible={isDescriptionErrorMessageVisible}
          isValid={isDescriptionValid}
          label="Description"
          setIsErrorMessageVisible={setIsDescriptionErrorMessageVisible}
          setIsValid={setIsDescriptionValid}
          value={description}
          onChange={(event) => {
            setDescription((event.target as HTMLInputElement).value);
          }}
          onBlur={() => {
            if (description.length < 20) {
              setDescriptionErrorMessage(
                "Description has to be at least 20 symbols. Please, describe the course with more details."
              );
              setIsDescriptionValid(false);
            }
          }}
        />
        <Input
          id="url"
          type="url"
          placeholder="Source URL"
          value={url}
          errorPosition="RIGHT"
          isValid={isUrlValid}
          setIsValid={setIsUrlValid}
          errorMessage={urlErrorMessage}
          isErrorMessageVisible={isUrlErrorMessageVisible}
          setIsErrorMessageVisible={setIsUrlErrorMessageVisible}
          onChange={(event) => {
            setUrl((event.target as HTMLInputElement).value);
          }}
          onBlur={() => {
            if (url.length < 10) {
              setUrlErrorMessage("Invalid Url.");
              setIsUrlValid(false);
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
