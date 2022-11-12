import { Outlet } from "react-router-dom";
import { BsGithub, BsLinkedin } from "react-icons/bs";

import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <>
      <Outlet />
      <footer className={styles.footer}>
        <div className={styles.text}>
          <h5 className={styles.title}>Petar Todorov</h5>
          <div className={styles.subtitle}>
            Fullstack web development enthusiast
          </div>
        </div>
        <div className={styles.icons}>
          <a href="https://github.com/Petar-JS" target="_blank">
            {
              <BsGithub
                size="20"
                className={styles.icon + " " + styles.github}
              />
            }
          </a>
          <a
            href="https://www.linkedin.com/in/%D0%BF%D0%B5%D1%82%D1%8A%D1%80-%D1%82%D0%BE%D0%B4%D0%BE%D1%80%D0%BE%D0%B2-885b94246/"
            target="_blank"
          >
            <BsLinkedin
              size="20"
              className={styles.icon + " " + styles.linkedin}
            />
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
