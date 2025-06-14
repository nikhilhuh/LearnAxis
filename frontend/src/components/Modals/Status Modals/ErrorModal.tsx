import React from "react";

interface ErrorModalProps {
  error: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error }) => {
  return (
    <div className="fixed inset-0 bg-[var(--color-primaryHover)]/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-[var(--color-primary)]/50 backdrop-blur-md border border-[var(--color-secondary)]/30 
        shadow-2xl drop-shadow-2xl rounded-xl laptop-lg:rounded-3xl 
        max-h-[60vh] min-w-[90%] mobile-m:min-w-[75%] mobile-l:min-w-[65%] tablet:min-w-[55%] laptop-sm:min-w-[40%] laptop-l:min-w-[30%] 4k:min-w-[25%] 
        max-w-[90%] mobile-m:max-w-[75%] mobile-l:max-w-[65%] tablet:max-w-[55%] laptop-sm:max-w-[40%] laptop-l:max-w-[30%] 4k:max-w-[25%] 
        overflow-hidden p-4 flex flex-col items-center gap-[2.5vw] tablet:gap-[1.5vw] laptop-sm:gap-[1vw] laptop-l:gap-[0.8vw]">
        <div className="flex flex-col items-center">
          {/* Animated Cross Icon */}
          <svg
            className="w-[12vw] h-[12vw] tablet:w-[8vw] tablet:h-[8vw] laptop-sm:w-[5vw] laptop-sm:h-[5vw] laptop-l:w-[4vw] laptop-l:h-[4vw]"
            viewBox="0 0 52 52"
          >
            <circle
              className="stroke-current text-red-500"
              cx="26"
              cy="26"
              r="25"
              fill="none"
              strokeWidth="2"
            />
            <path
              className="stroke-current text-red-500 cross cross-1"
              fill="none"
              strokeWidth="4"
              d="M16 16 36 36"
            />
            <path
              className="stroke-current text-red-500 cross cross-2"
              fill="none"
              strokeWidth="4"
              d="M36 16 16 36"
            />
          </svg>
          <p className="text-red-500 font-semibold font-serif text-[6vw] tablet:text-[4vw] laptop-sm:text-[3vw] laptop-l:text-[2.5vw]">
            Error
          </p>
        </div>

        <div className="break-words text-center text-[4vw] tablet:text-[3vw] laptop-sm:text-[2vw] laptop-l:text-[1.7vw]">
          {error}
        </div>

      </div>
    </div>
  );
};

export default ErrorModal;
