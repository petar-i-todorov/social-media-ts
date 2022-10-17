import { ChangeEvent, useState } from "react";
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
  return (
    <div className={styles.overlay}>
      <div className={formStyles.mainContainer}>
        <form
          className={formStyles.form}
          onSubmit={(event) => {
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
            }
          }}
        >
          <h2>Enter the source info:</h2>
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
          <select name="Dev Role" id="">
            <option selected disabled value="">
              -- choose a dev role --
            </option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="devops">DevOps</option>
          </select>
          <span>Source Social Media</span>
          <div className={formStyles.optionsContainer}>
            <RiYoutubeFill
              className={formStyles.option}
              size="50"
              color="red"
            />
            <RiStackOverflowFill
              className={formStyles.option}
              size="50"
              color="orange"
            />
            <RiGithubFill className={formStyles.option} size="50" />
            <RiRedditFill className={formStyles.option} size="50" color="red" />
            <RiLinkedinBoxFill
              className={formStyles.option}
              size="50"
              color="blue"
            />
            <SiUdemy className={formStyles.option} size="50" color="purple" />
            <span className={formStyles.option}>OTHER</span>
          </div>
          <Button color="green" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
