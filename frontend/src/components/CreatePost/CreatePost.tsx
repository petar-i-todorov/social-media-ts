import { useContext, useState } from "react";
import Input from "../Input/Input";
import formStyles from "../../scss/Form.module.scss";
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
import { AddPostContext } from "../../contexts/AddPostContext";
import { PostsContext } from "../../contexts/PostsContext";

const AddPost = () => {
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
  const [devRole, setDevRole] = useState<"Frontend" | "Backend" | "DevOps">(
    "Frontend"
  );
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
  const { setAddPost } = useContext(AddPostContext);
  const { posts, setPosts } = useContext(PostsContext);
  return (
    <div
      className={styles.overlay}
      onClick={() => {
        setAddPost(false);
      }}
    >
      <div className={formStyles.mainContainer + " " + styles.nonAnimated}>
        <form
          onClick={(event) => {
            event.stopPropagation();
          }}
          className={formStyles.form}
          onSubmit={async (event) => {
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
            } else if (!devRole) {
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
                await fetch("http://localhost:8080/posts/new", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    creator: localStorage.getItem("userId"),
                    title: title,
                    description: description,
                    url: url,
                    devRole: devRole,
                    platform: platform,
                  }),
                });
                const response = await fetch("http://localhost:8080/posts", {
                  method: "GET",
                });
                const posts = await response.json();
                setIsLoading(false);
                setAddPost(false);
                setPosts(posts);
              } catch (err) {
                //todo
              }
            }
          }}
        >
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
            defaultValue="choose"
            name="Dev Role"
            onChange={(event) => {
              const target = event.target as HTMLSelectElement;
              if (
                target.value === "Frontend" ||
                target.value === "Backend" ||
                target.value === "DevOps"
              ) {
                setDevRole(target.value);
              }
            }}
            className={!isDevRoleValid ? formStyles.invalidSelect : ""}
          >
            <option disabled value="choose">
              -- choose a dev role --
            </option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="DevOps">DevOps</option>
          </select>
          <span>Source' social media</span>
          <div className={formStyles.optionsContainer}>
            <RiYoutubeFill
              className={
                formStyles.option +
                " " +
                (isYoutubeSelected && formStyles.selected) +
                " " +
                (isHighlighted && formStyles.invalid)
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
                formStyles.option +
                " " +
                (isStackoverflowSelected && formStyles.selected) +
                " " +
                (isHighlighted && formStyles.invalid)
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
                formStyles.option +
                " " +
                (isGithubSelected && formStyles.selected) +
                " " +
                (isHighlighted && formStyles.invalid)
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
                formStyles.option +
                " " +
                (isRedditSelected && formStyles.selected) +
                " " +
                (isHighlighted && formStyles.invalid)
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
                formStyles.option +
                " " +
                (isLinkedinSelected && formStyles.selected) +
                " " +
                (isHighlighted && formStyles.invalid)
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
                formStyles.option +
                " " +
                (isUdemySelected && formStyles.selected) +
                " " +
                (isHighlighted && formStyles.invalid)
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
                formStyles.option +
                " " +
                (isOtherSelected && formStyles.selected) +
                " " +
                (isHighlighted && formStyles.invalid)
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
          <Button color="green" type="submit">
            {isLoading ? <BouncingDotsLoader text="Submitting" /> : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
