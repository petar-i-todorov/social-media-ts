import ContentLoader from "react-content-loader";

const MyLoader = () => (
  <ContentLoader
    speed={1}
    width={768}
    height={274}
    viewBox="0 0 768 294"
    backgroundColor="#b7b4b4"
    foregroundColor="#979191"
  >
    <rect x="10" y="20" rx="7" ry="7" width="748" height="34" />
    <rect x="20" y="76" rx="7" ry="7" width="30" height="30" />
    <rect x="20" y="131" rx="7" ry="7" width="30" height="30" />
    <rect x="20" y="186" rx="7" ry="7" width="30" height="30" />
    <rect x="70" y="76" rx="7" ry="7" width="598" height="32" />
    <rect x="70" y="116" rx="7" ry="7" width="598" height="100" />
    <rect x="690" y="116" rx="20" ry="20" width="60" height="60" />
    <circle cx="26" cy="261" r="16" />
    <rect x="61" y="243" rx="7" ry="7" width="648" height="35" />
    <rect x="724" y="243" rx="7" ry="7" width="35" height="35" />
  </ContentLoader>
);

export default MyLoader;
