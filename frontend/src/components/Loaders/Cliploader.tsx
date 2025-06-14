import React from "react";
import { ClipLoader } from "react-spinners";

const Cliploader: React.FC<{size: number}> = ({ size }) => {
  return (
      <ClipLoader
        size={size}
        color="var(--color-primary)" 
        aria-label="Loading Spinner"
        data-testid="loader"
      />
  );
};

export default Cliploader;
