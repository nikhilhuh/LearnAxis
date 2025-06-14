import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import SuccessModal from "../Modals/Status Modals/SuccessModal";
import ErrorModal from "../Modals/Status Modals/ErrorModal";
import { Subject } from "../../utils/constants";
import Cliploader from "../Loaders/Cliploader";
import { enrollSubject } from "../../services/api/apiCalls/student/enrollSubjects";
import EnrollSubjectModal from "../Modals/Input Modals/EnrollSubjectModal";

const EnrollSubject: React.FC<{ subjects: Subject[] , enrolledSubjects: Subject[]}> = ({ subjects, enrolledSubjects }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const { UserDetails } = useUser();
  if (!UserDetails) return null;

  const onClose = () => {
    setIsOpen(false);
  };
  
  const handleEnrollSubjects = async (subjects: Subject['code'][]) => {
    setLoading(true);
    try {
      const response = await enrollSubject(UserDetails.email, subjects);
      if (response.success) {
        setSuccess(response.message || "Subject(s) enrolled successfully");
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
      <EnrollSubjectModal
        isOpen={isOpen}
        onClose={onClose}
        subjects={subjects}
        enrolledSubjects={enrolledSubjects}
        handleEnrollSubjects={handleEnrollSubjects}
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
            <span>Enroll Subject</span>
          </>
        )}
      </button>
    </div>
  );
};

export default EnrollSubject;
