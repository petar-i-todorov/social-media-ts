import React, { useContext, useEffect, useState } from "react";
import Input from "../Input/Input";
import styles from "./CreatePost.module.scss";
import TextArea from "../TextArea/TextArea";
import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiRedditFill,
  RiStackOverflowFill,
  RiYoutubeFill,
} from "react-icons/ri";
import { SiUdemy } from "react-icons/si";
import Button from "../Button/Button";
import BouncingDotsLoader from "../BouncingDotsLoader/BouncingDotsLoader";
import { ModalsManipulationContext } from "../../contexts/ModalsManipulationContext";
import { PostsContext } from "../../contexts/PostsContext";
import FormMessage from "../FormMessage/FormMessage";
import ModalBuilder from "../ModalBuilder/ModalBuilder";
import { IPost } from "../../types/feed";
import { PostIdContext } from "../../contexts/PostIdContext";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";

const AddPost: React.FC<{
  editPost?: boolean;
  postToEdit?: IPost;
  setClosingConfirmationVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}> = ({ setClosingConfirmationVisibility, editPost, postToEdit }) => {
  const {
    setFeedFlashMessageConfiguration,
    setIsFeedFlashMessage,
    activeFlashTimeout,
    setActiveFlashTimeout,
  } = useContext(FlashMessageContext);
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
  const [chosenDevRole, setChosenDevRole] = useState("");
  const [isDevRoleValid, setIsDevRoleValid] = useState(true);
  const [isYoutubeSelected, setIsYoutubeSelected] = useState(false);
  const [isStackoverflowSelected, setIsStackoverflowSelected] = useState(false);
  const [isGithubSelected, setIsGithubSelected] = useState(false);
  const [isRedditSelected, setIsRedditSelected] = useState(false);
  const [isLinkedinSelected, setIsLinkedinSelected] = useState(false);
  const [isUdemySelected, setIsUdemySelected] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAddPostVisibility, setEditPostVisibility } = useContext(
    ModalsManipulationContext
  );
  const [isFormError, setIsFormError] = useState(false);
  const [formErrorText, setFormErrorText] = useState("");
  const { postId } = useContext(PostIdContext);
  const { setPosts, posts } = useContext(PostsContext);
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setDescription(postToEdit.description);
      setUrl(postToEdit.url);
      setChosenDevRole(postToEdit.devRole);
      if (postToEdit.platform === "YOUTUBE") {
        setIsYoutubeSelected(true);
      } else if (postToEdit.platform === "UDEMY") {
        setIsUdemySelected(true);
      } else if (postToEdit.platform === "LINKEDIN") {
        setIsLinkedinSelected(true);
      } else if (postToEdit.platform === "STACKOVERFLOW") {
        setIsStackoverflowSelected(true);
      } else if (postToEdit.platform === "GITHUB") {
        setIsGithubSelected(true);
      } else if (postToEdit.platform === "REDDIT") {
        setIsRedditSelected(true);
      } else {
        setIsOtherSelected(true);
      }
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
        } else if (!chosenDevRole) {
          setIsDevRoleValid(false);
        } else if (
          !isYoutubeSelected &&
          !isStackoverflowSelected &&
          !isGithubSelected &&
          !isRedditSelected &&
          !isLinkedinSelected &&
          !isUdemySelected &&
          !isOtherSelected
        ) {
          setIsHighlighted(true);
        } else {
          setIsLoading(true);
          const platform = isYoutubeSelected
            ? "YOUTUBE"
            : isStackoverflowSelected
            ? "STACKOVERFLOW"
            : isGithubSelected
            ? "GITHUB"
            : isRedditSelected
            ? "REDDIT"
            : isLinkedinSelected
            ? "LINKEDIN"
            : isUdemySelected
            ? "UDEMY"
            : "OTHER";
          try {
            if (editPost && postToEdit) {
              const res = await fetch(
                `http://localhost:8080/posts/${postToEdit._id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                  body: JSON.stringify({
                    id: postId,
                    title: title,
                    description: description,
                    url: url,
                    devRole: chosenDevRole,
                    platform: platform,
                  }),
                }
              );
              setIsLoading(false);
              setEditPostVisibility(false);
              if (res.status === 200) {
                const resData = await res.json();
                const indexOfUpdatedPost = posts
                  .map((post) => post._id)
                  .indexOf(resData.updatedPost._id.toString());
                const updatedPosts = JSON.parse(JSON.stringify(posts));
                updatedPosts[indexOfUpdatedPost] = resData.updatedPost;
                console.log(Array.isArray(updatedPosts));
                console.log(Array.isArray(posts));
                setPosts([updatedPosts[0], updatedPosts[1]]);
                setIsFeedFlashMessage(true);
                setFeedFlashMessageConfiguration({
                  text: resData.message,
                  color: "green",
                });
                clearTimeout(activeFlashTimeout);
                const timeout = setTimeout(() => {
                  setIsFeedFlashMessage(false);
                }, 5000);
                setActiveFlashTimeout(timeout);
              } else {
                setIsFeedFlashMessage(true);
                setFeedFlashMessageConfiguration({
                  text: "Something went wrong. Please, try again later.",
                  color: "red",
                });
                clearTimeout(activeFlashTimeout);
                const timeout = setTimeout(() => {
                  setIsFeedFlashMessage(false);
                }, 5000);
                setActiveFlashTimeout(timeout);
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
                  devRole: chosenDevRole,
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
                clearTimeout(activeFlashTimeout);
                const timeout = setTimeout(() => {
                  setIsFeedFlashMessage(false);
                }, 5000);
                setActiveFlashTimeout(timeout);
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
            clearTimeout(activeFlashTimeout);
            const timeout = setTimeout(() => {
              setIsFeedFlashMessage(false);
            }, 5000);
            setActiveFlashTimeout(timeout);
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
        <select
          defaultValue={postToEdit?.devRole || "choose"}
          name="Dev Role"
          onChange={(event) => {
            const target = event.target as HTMLSelectElement;
            if (
              target.value === "Frontend" ||
              target.value === "Backend" ||
              target.value === "DevOps"
            ) {
              setChosenDevRole(target.value);
            }
          }}
          className={!isDevRoleValid ? styles.invalidSelect : ""}
        >
          <option disabled value="choose">
            -- choose a dev role --
          </option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="DevOps">DevOps</option>
        </select>
        <span>Source' social media</span>
        <div className={styles.optionsContainer}>
          <RiYoutubeFill
            className={
              styles.option +
              " " +
              (isYoutubeSelected && styles.selected) +
              " " +
              (isHighlighted && styles.invalid)
            }
            size="50"
            color="red"
            onClick={() => {
              setIsHighlighted(false);
              setIsYoutubeSelected(true);
              setIsUdemySelected(false);
              setIsStackoverflowSelected(false);
              setIsGithubSelected(false);
              setIsRedditSelected(false);
              setIsLinkedinSelected(false);
              setIsOtherSelected(false);
            }}
          />
          <RiStackOverflowFill
            className={
              styles.option +
              " " +
              (isStackoverflowSelected && styles.selected) +
              " " +
              (isHighlighted && styles.invalid)
            }
            size="50"
            color="orange"
            onClick={() => {
              setIsHighlighted(false);
              setIsStackoverflowSelected(true);
              setIsYoutubeSelected(false);
              setIsUdemySelected(false);
              setIsGithubSelected(false);
              setIsRedditSelected(false);
              setIsLinkedinSelected(false);
              setIsOtherSelected(false);
            }}
          />
          <RiGithubFill
            className={
              styles.option +
              " " +
              (isGithubSelected && styles.selected) +
              " " +
              (isHighlighted && styles.invalid)
            }
            size="50"
            onClick={() => {
              setIsHighlighted(false);
              setIsGithubSelected(true);
              setIsYoutubeSelected(false);
              setIsUdemySelected(false);
              setIsStackoverflowSelected(false);
              setIsRedditSelected(false);
              setIsLinkedinSelected(false);
              setIsOtherSelected(false);
            }}
          />
          <RiRedditFill
            className={
              styles.option +
              " " +
              (isRedditSelected && styles.selected) +
              " " +
              (isHighlighted && styles.invalid)
            }
            size="50"
            color="red"
            onClick={() => {
              setIsHighlighted(false);
              setIsRedditSelected(true);
              setIsYoutubeSelected(false);
              setIsUdemySelected(false);
              setIsStackoverflowSelected(false);
              setIsGithubSelected(false);
              setIsLinkedinSelected(false);
              setIsOtherSelected(false);
            }}
          />
          <RiLinkedinBoxFill
            className={
              styles.option +
              " " +
              (isLinkedinSelected && styles.selected) +
              " " +
              (isHighlighted && styles.invalid)
            }
            size="50"
            color="blue"
            onClick={() => {
              setIsHighlighted(false);
              setIsLinkedinSelected(true);
              setIsYoutubeSelected(false);
              setIsUdemySelected(false);
              setIsStackoverflowSelected(false);
              setIsGithubSelected(false);
              setIsRedditSelected(false);
              setIsOtherSelected(false);
            }}
          />
          <SiUdemy
            className={
              styles.option +
              " " +
              (isUdemySelected && styles.selected) +
              " " +
              (isHighlighted && styles.invalid)
            }
            size="50"
            color="purple"
            onClick={() => {
              setIsHighlighted(false);
              setIsUdemySelected(true);
              setIsYoutubeSelected(false);
              setIsStackoverflowSelected(false);
              setIsGithubSelected(false);
              setIsRedditSelected(false);
              setIsLinkedinSelected(false);
              setIsOtherSelected(false);
            }}
          />
          <span
            className={
              styles.option +
              " " +
              (isOtherSelected && styles.selected) +
              " " +
              (isHighlighted && styles.invalid)
            }
            onClick={() => {
              setIsHighlighted(false);
              setIsOtherSelected(true);
              setIsYoutubeSelected(false);
              setIsUdemySelected(false);
              setIsStackoverflowSelected(false);
              setIsGithubSelected(false);
              setIsRedditSelected(false);
              setIsLinkedinSelected(false);
            }}
          >
            OTHER
          </span>
        </div>
        {isFormError && <FormMessage color="red">{formErrorText}</FormMessage>}
        <Button color="green" type="submit">
          {isLoading ? <BouncingDotsLoader text="Submitting" /> : "Submit"}
        </Button>
      </>
    </ModalBuilder>
  );
};

export default AddPost;
