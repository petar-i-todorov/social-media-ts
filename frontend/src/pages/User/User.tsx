import { useContext, useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { FlashMessageContext } from "../../contexts/FlashMessageFeedContext";

const User = () => {
  const [user, setUser] = useState();
  const params = useParams();
  const { setFeedFlashMessageConfiguration, setIsFeedFlashMessage } =
    useContext(FlashMessageContext);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:8080/users/${params.userId}`
      );
      if (response.status === 200) {
        const resData = await response.json();
        setUser(resData.user);
      } else {
        setFeedFlashMessageConfiguration({
          text: "Something went wrong. Please, try again later.",
          color: "red",
        });
        setIsFeedFlashMessage(true);
        setTimeout(() => {
          setIsFeedFlashMessage(false);
        }, 5000);
      }
    };
    fetchUser();
  }, []);
  return (
    <div>
      <FaUserCircle size="35" />
    </div>
  );
};

export default User;
