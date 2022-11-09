import ContentLoader from "react-content-loader";

const MyLoader = () => (
  <ContentLoader
    speed={1}
    backgroundColor="#b7b4b4"
    foregroundColor="#979191"
    style={{ width: "100%", height: "100%", padding: "10px" }}
  >
    <rect x="0" y="0" rx="7" ry="7" width="100%" height="34" />
    <rect x="0" y="66" rx="7" ry="7" width="30" height="30" />
    <rect x="0" y="116" rx="7" ry="7" width="30" height="30" />
    <rect x="0" y="166" rx="7" ry="7" width="30" height="30" />
    <rect x="50" y="66" rx="7" ry="7" width="calc(100% - 120px)" height="32" />
    <rect
      x="50"
      y="116"
      rx="7"
      ry="7"
      width="calc(100% - 120px)"
      height="100"
    />
    <rect
      x="calc(100% - 60px)"
      y="116"
      rx="20"
      ry="20"
      width="60"
      height="60"
    />
    <circle cx="16" cy="245" r="16" />
    <rect x="50" y="230" rx="7" ry="7" width="calc(100% - 100px)" height="35" />
    <rect x="calc(100% - 40px)" y="230" rx="7" ry="7" width="35" height="35" />
  </ContentLoader>
);

export default MyLoader;
