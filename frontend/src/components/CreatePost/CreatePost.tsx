import {
  useContext,
  useEffect,
  useState,
  Dispatch,
  FC,
  SetStateAction,
} from "react";
import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiRedditFill,
  RiStackOverflowFill,
  RiYoutubeFill,
} from "react-icons/ri";
import { SiUdemy } from "react-icons/si";

import Input from "../Input/Input";
import styles from "./CreatePost.module.scss";
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
import { SwitchThemeContext } from "../../contexts/SwitchThemeContext";
import {
  GITHUB,
  LINKEDIN,
  OTHER,
  REDDIT,
  STACKOVERFLOW,
  UDEMY,
  YOUTUBE,
} from "../../constants/feed";
import { updatePost } from "./utils";

interface CreatePostProps {
  editPost?: boolean;
  postToEdit?: IPost;
  setClosingConfirmationVisibility: Dispatch<SetStateAction<boolean>>;
}

const CreatePost: FC<CreatePostProps> = ({
  setClosingConfirmationVisibility,
  editPost,
  postToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [isTitleErrorMessageVisible, setIsTitleErrorMessageVisible] =
    useState(false);
  const [description, setDescription] = useState("");
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [
    isDescriptionErrorMessageVisible,
    setIsDescriptionErrorMessageVisible,
  ] = useState(false);
  const [url, setUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [urlErrorMessage, setUrlErrorMessage] = useState("");
  const [isUrlErrorMessageVisible, setIsUrlErrorMessageVisible] =
    useState(false);
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
  const { isDarkMode } = useContext(SwitchThemeContext);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setDescription(postToEdit.description);
      setUrl(postToEdit.url);
      setSelectedOption(postToEdit.platform);
    }
  }, []);

  return (
    <ModalBuilder
      onOverlayClick={() => {
        setClosingConfirmationVisibility(true);
      }}
      onFormSubmit={async (event) => {
        event.preventDefault();
        if (title.length < 5) {
          setTitleErrorMessage("Title has to be at least 5 symbols.");
          setIsTitleErrorMessageVisible(true);
          setIsTitleValid(false);
        } else if (description.length < 20) {
          setDescriptionErrorMessage(
            "Description has to be at least 20 symbols. Please, describe the course with more details."
          );
          setIsDescriptionErrorMessageVisible(true);
          setIsDescriptionValid(false);
        } else if (url.length < 10) {
          setUrlErrorMessage("Invalid Url.");
          setIsUrlValid(false);
          setIsUrlErrorMessageVisible(true);
        } else if (!selectedOption) {
          setIsHighlighted(true);
        } else {
          setIsLoading(true);
          const platform = selectedOption;
          try {
            if (editPost && postToEdit) {
              const res = await updatePost({
                id: postId,
                title,
                description,
                devRole,
                platform,
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
                setFeedFlashMessageConfiguration({
                  text: "Something went wrong. Please, try again later.",
                  color: "red",
                });
              }
            } else {
              const res = await fetch("http://localhost:8080/posts/new", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({
                  creator: localStorage.getItem("userId"),
                  title: title,
                  description: description,
                  url: url,
                  devRole: devRole,
                  platform: platform,
                }),
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
            }
          } catch (err) {
            setIsFeedFlashMessage(true);
            setFeedFlashMessageConfiguration({
              text: "Something went wrong. Please, try again later.",
              color: "red",
            });
          }
        }
      }}
    >
      <>
        <h2>Source info</h2>
        <Input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          errorPosition="right"
          isValid={isTitleValid}
          setIsValid={setIsTitleValid}
          errorMessage={titleErrorMessage}
          isErrorMessageVisible={isTitleErrorMessageVisible}
          setIsErrorMessageVisible={setIsTitleErrorMessageVisible}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setTitle(target.value);
          }}
          onBlur={() => {
            if (title.length < 5) {
              setTitleErrorMessage("Title has to be at least 5 symbols.");
              setIsTitleValid(false);
            }
          }}
        />
        <TextArea
          id="description"
          label="Description"
          value={description}
          isValid={isDescriptionValid}
          setIsValid={setIsDescriptionValid}
          errorMessage={descriptionErrorMessage}
          isErrorMessageVisible={isDescriptionErrorMessageVisible}
          setIsErrorMessageVisible={setIsDescriptionErrorMessageVisible}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setDescription(target.value);
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
          errorPosition="right"
          isValid={isUrlValid}
          setIsValid={setIsUrlValid}
          errorMessage={urlErrorMessage}
          isErrorMessageVisible={isUrlErrorMessageVisible}
          setIsErrorMessageVisible={setIsUrlErrorMessageVisible}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setUrl(target.value);
          }}
          onBlur={() => {
            if (url.length < 10) {
              setUrlErrorMessage("Invalid Url.");
              setIsUrlValid(false);
            }
          }}
        />
        <span>Source' social media</span>
        <div className={styles.optionsContainer}>
          <RiYoutubeFill
            className={`${styles.option} ${
              selectedOption === YOUTUBE && styles.selected
            } ${isHighlighted && styles.invalid} ${
              isDarkMode && styles.darkMode
            }`}
            size="50"
            color="red"
            onClick={() => {
              setIsHighlighted(false);
              setSelectedOption(YOUTUBE);
            }}
          />
          <RiStackOverflowFill
            className={`${styles.option} ${
              selectedOption === STACKOVERFLOW && styles.selected
            } ${isHighlighted && styles.invalid} ${
              isDarkMode && styles.darkMode
            }`}
            size="50"
            color="orange"
            onClick={() => {
              setIsHighlighted(false);
              setSelectedOption(STACKOVERFLOW);
            }}
          />
          <RiGithubFill
            className={`${styles.option} ${
              selectedOption === GITHUB && styles.selected
            } ${isHighlighted && styles.invalid} ${
              isDarkMode && styles.darkMode
            }`}
            size="50"
            onClick={() => {
              setIsHighlighted(false);
              setSelectedOption(GITHUB);
            }}
          />
          <RiRedditFill
            className={`${styles.option} ${
              selectedOption === REDDIT && styles.selected
            } ${isHighlighted && styles.invalid} ${
              isDarkMode && styles.darkMode
            }`}
            size="50"
            color="red"
            onClick={() => {
              setIsHighlighted(false);
              setSelectedOption(REDDIT);
            }}
          />
          <RiLinkedinBoxFill
            className={`${styles.option} ${
              selectedOption === LINKEDIN && styles.selected
            } ${isHighlighted && styles.invalid} ${
              isDarkMode && styles.darkMode
            }`}
            size="50"
            color="blue"
            onClick={() => {
              setIsHighlighted(false);
              setSelectedOption(LINKEDIN);
            }}
          />
          <SiUdemy
            className={`${styles.option} ${
              selectedOption === UDEMY && styles.selected
            } ${isHighlighted && styles.invalid} ${
              isDarkMode && styles.darkMode
            }`}
            size="50"
            color="purple"
            onClick={() => {
              setIsHighlighted(false);
              setSelectedOption(UDEMY);
            }}
          />
          <p
            className={`${styles.option} ${
              selectedOption === OTHER && styles.selected
            } ${isHighlighted && styles.invalid} ${
              isDarkMode && styles.darkMode
            }`}
            onClick={() => {
              setIsHighlighted(false);
              setSelectedOption(OTHER);
            }}
          >
            OTHER
          </p>
        </div>
        {isFormError && <FormMessage color="red">{formErrorText}</FormMessage>}
        <Button color="green" type="submit">
          {isLoading ? <BouncingDotsLoader text="Submitting" /> : "Submit"}
        </Button>
      </>
    </ModalBuilder>
  );
};

export default CreatePost;
