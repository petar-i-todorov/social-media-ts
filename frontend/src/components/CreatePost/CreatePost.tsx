import { ChangeEvent, useState } from "react";
import Input from "../Input/Input";
import formStyles from "../../scss/Form.module.scss";
import styles from "./CreatePost.module.scss";
import TextArea from "../TextArea/TextArea";

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
      <div className={styles.modal}>
        <div className={formStyles.mainContainer}>
          <form className={formStyles.form}>
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
            {/* <Input
              id="url"
              type="url"
              placeholder="URL"
              value={description}
              errorPosition="right"
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
                if (title.length < 20) {
                  setDescriptionErrorMessage(
                    "Description has to be at least 20 symbols. Please, describe the course with more details."
                  );
                  setIsDescriptionValid(false);
                }
              }}
            /> */}
          </form>
        </div>
      </div>{" "}
    </div>
  );
};

export default AddPost;
