import { Box } from "@mui/material";
// import FormCreate from "./FormCreate";
import { useTheme } from "@emotion/react";
import CreateOrEditProduct from "components/CreateOrEditProduct";

function ProductCreate(props) {
  const theme = useTheme();
  return (
    <Box>
      <Box p='2rem' m='2rem auto' borderRadius='1.5rem' backgroundColor={theme.palette.background.alt}>
        <CreateOrEditProduct />
      </Box>
    </Box>
  );
}

export default ProductCreate;
