import React from "react";
import { ClockLoader } from "react-spinners";

const Clockloader: React.FC<{size: number}> = ({ size }) => {
  return (
      <ClockLoader
        size={size}
        color="var(--color-primary)" 
        aria-label="Loading Spinner"
        data-testid="loader"
      />
  );
};

export default Clockloader;
