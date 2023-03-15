import React from "react";

import { Box, CircularProgress } from "@mui/material";

function CircularLoading({ boxStyles, progressStyles, size, thickness }) {
  return (
    <Box
      sx={{
        ...boxStyles,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        sx={{ ...progressStyles }}
        size={size}
        thickness={thickness}
      />
    </Box>
  );
}

export default CircularLoading;
