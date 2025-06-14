import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import SuccessModal from "../Modals/Status Modals/SuccessModal";
import ErrorModal from "../Modals/Status Modals/ErrorModal";
import { addSubject } from "../../services/api/apiCalls/admin/add/addSubjects";
import AddSubjectModal from "../Modals/Input Modals/AddSubjectModal";
import { Subject } from "../../utils/constants";
import Cliploader from "../Loaders/Cliploader";

const AddSubject: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const { UserDetails } = useUser();
  if (!UserDetails) return null;

  const onClose = () => {
    setIsOpen(false);
  };
  const handleAddSubject = async (subjects: Subject[]) => {
    setLoading(true);
    try {
      const response = await addSubject(UserDetails.email, subjects);
      if (response.success) {
        setSuccess(response.message || "Subject(s) added successfully");
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(response.message || "Something went wrong.");
        setTimeout(() => setError(""), 2000);
      }
    } catch (err: any) {
      setError("Something went wrong.");
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {error && <ErrorModal error={error} />}
      {success && <SuccessModal success={success} />}
      <AddSubjectModal
        isOpen={isOpen}
        onClose={onClose}
        handleAddSubjects={handleAddSubject}
      />
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg cursor-pointer hover:scale-90 flex gap-1 items-center bg-[var(--color-primary)] hover:bg-[var(--color-primaryHover)] font-semibold"
      >
        {loading ? (
          <Cliploader size={10} />
        ) : (
          <>
            <span>
              <FaPlusCircle />
            </span>
            <span>Add Subject</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AddSubject;
