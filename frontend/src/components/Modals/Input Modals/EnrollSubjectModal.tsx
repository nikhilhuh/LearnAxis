import React from "react";
import { IoMdClose } from "react-icons/io";
import { Subject } from "../../../utils/constants";
import SubjectData from "../../Subjects/SubjectData";
import NoDataImg from "../../../assets/images/nodata.svg";

interface EnrollSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  enrolledSubjects: Subject[];
  handleEnrollSubjects: (subjects: Subject["code"][]) => void;
}

const EnrollSubjectModal: React.FC<EnrollSubjectModalProps> = ({
  isOpen,
  onClose,
  subjects,
  enrolledSubjects,
  handleEnrollSubjects,
}) => {
  const [selectedSubjects, setSelectedSubjects] = React.useState<
    Subject["code"][]
  >([]);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedSubjects([]);
    }
  }, [isOpen]);
  const isEnrollDisabled = selectedSubjects.length === 0;

  const handleToggleSubject = (code: Subject["code"]) => {
    setSelectedSubjects((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) return;
    handleEnrollSubjects(selectedSubjects);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--color-primaryHover)]/20 backdrop-blur-sm z-40 flex items-center justify-center">
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
           bg-[var(--color-primary)]/80 backdrop-blur-md border border-[var(--color-secondary)]/80 
           shadow-2xl drop-shadow-2xl rounded-xl laptop-lg:rounded-3xl w-[90vw] tablet:w-[70vw] laptop-sm:w-[60vw] z-40`}
      >
        <div className="bg-[var(--color-secondary)] px-4 py-2 rounded-tr-xl laptop-lg:rounded-tr-3xl rounded-tl-xl laptop-lg:rounded-tl-3xl flex justify-between items-center">
          <div className="font-semibold">Enroll Subject(s)</div>
          <IoMdClose
            title="Close"
            className="text-red-700 text-2xl cursor-pointer hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="text-sm tablet:text-base p-4 h-max max-h-[75vh] overflow-y-auto flex flex-col justify-between"
        >
          {subjects.length === 0 ? (
            <div className="flex flex-col h-full w-full justify-center items-center gap-4">
              <img src={NoDataImg} alt="No Data" className="h-[25vh] w-auto" />
              <p className="text-gray-400">No subjects found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 mobile-l:grid-cols-2 laptop-sm:grid-cols-3 gap-4">
                {subjects
                  .filter (
                    (subject) =>
                      !enrolledSubjects.some(
                        (enrolled) => enrolled.code === subject.code
                      )
                  )
                  .map((subject, idx) => (
                    <SubjectData
                      key={idx}
                      subject={subject}
                      toggle={handleToggleSubject}
                      isSelected={selectedSubjects.includes(subject.code)}
                    />
                  ))}
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-4 justify-around mt-4">
            <button
              title="Cancel addition"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              title={
                isEnrollDisabled
                  ? "Select any subject"
                  : "Enroll for these subjects"
              }
              type="submit"
              className={`add-button ${
                isEnrollDisabled
                  ? "opacity-50 cursor-not-allowed! hover:bg-current!"
                  : ""
              }`}
              disabled={selectedSubjects.length === 0}
            >
              Enroll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollSubjectModal;
