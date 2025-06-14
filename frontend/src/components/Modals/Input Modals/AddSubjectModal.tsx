import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import { Subject } from "../../../utils/constants";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddSubjects: (subjects: Subject[]) => void;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  handleAddSubjects,
}) => {
  if (!isOpen) return null;

  const [subjects, setSubjects] = React.useState<Subject[]>([
    { name: "", code: "" },
  ]);
  const handleInputChange = (
    index: number,
    field: keyof Subject,
    value: string
  ) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddSubjects(subjects);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-primaryHover)]/20 backdrop-blur-sm z-40 flex items-center justify-center">
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-[var(--color-primary)]/80 backdrop-blur-md border border-[var(--color-secondary)]/80 
        shadow-2xl drop-shadow-2xl rounded-xl laptop-lg:rounded-3xl w-[90vw] tablet:w-[70vw] laptop-sm:w-[60vw] z-40`}
      >
        <div className="bg-[var(--color-secondary)] px-4 py-2 rounded-tr-xl laptop-lg:rounded-tr-3xl rounded-tl-xl laptop-lg:rounded-tl-3xl flex justify-between items-center">
          <div className="font-semibold">Add Subject(s)</div>
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
          className="text-sm tablet:text-base p-4 h-[40vh] tablet:h-[45vh] max-h-[40vh] tablet:max-h-[45vh] overflow-y-auto flex flex-col justify-between"
        >
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="border p-4 my-2 rounded-md space-y-3 bg-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className=" font-semibold">Subject {index + 1}</h3>
                {index > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSubjects((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="text-red-600 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              {/* name input */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`Name${index}`} className="font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id={`Name${index}`}
                  className="modal-input-field"
                  value={subject.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  placeholder="subject name"
                  required
                />
              </div>
              {/* code input */}
              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`Code${index}`} className=" font-semibold">
                  Code
                </label>
                <input
                  type="text"
                  id={`Code${index}`}
                  className="modal-input-field"
                  value={subject.code}
                  onChange={(e) =>
                    handleInputChange(index, "code", e.target.value)
                  }
                  placeholder="subject code"
                  required
                />
              </div>
            </div>
          ))}

          {/* add another subject button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setSubjects((prev) => [
                ...prev,
                { name: "", code: "" },
              ]);
            }}
            className="add-another-button"
          >
            <FaPlusCircle />
            Add another Subject
          </button>

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
              title="Add Data to database"
              type="submit"
              className="add-button"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;
