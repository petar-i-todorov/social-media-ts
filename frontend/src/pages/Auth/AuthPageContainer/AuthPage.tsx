import { FC, PropsWithChildren } from "react";

import styles from "./AuthPage.module.scss";

const AuthPage: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.authPage}>{children}</div>;
};

export default AuthPage;
