import { styled } from "@mui/material/styles";
import { PageContent } from "./PageContent";

const PaperWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
  overflow: "hidden",
  background: theme.palette.background.page,
}));

export const MainContent = ({ children, title }) => {
  return <PaperWrapper><PageContent title={title}>{children}</PageContent></PaperWrapper>;
};

