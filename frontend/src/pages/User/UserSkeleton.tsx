import ContentLoader from "react-content-loader";

const MyLoader = () => (
  <ContentLoader
    speed={1}
    width={768}
    height={350}
    viewBox="0 0 768 350"
    backgroundColor="#e3e3e3"
    foregroundColor="#7f7c7a"
  >
    <rect x="298" y="197" rx="0" ry="0" width="0" height="2" />
    <rect x="0" y="0" rx="0" ry="0" width="768" height="200" />
    <rect x="265" y="125" rx="8" ry="8" width="250" height="207" />
    <rect x="423" y="246" rx="0" ry="0" width="1" height="14" />
  </ContentLoader>
);

export default MyLoader;
