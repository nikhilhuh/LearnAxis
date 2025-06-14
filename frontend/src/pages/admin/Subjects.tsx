import React from "react";
import { useUser } from "../../context/UserContext";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import NoDataImg from "../../assets/images/nodata.svg";
import { getSubjects } from "../../services/api/apiCalls/common/getSubjects";
import SubjectData from "../../components/Subjects/SubjectData";
import AddSubject from "../../components/Subjects/AddSubject";
import ConfirmModal from "../../components/Modals/Status Modals/ConfirmModal";
import { deleteSubject } from "../../services/api/apiCalls/admin/delete/deleteSubject";
import SuccessModal from "../../components/Modals/Status Modals/SuccessModal";
import { Subject } from "../../utils/constants";
import Clockloader from "../../components/Loaders/Clockloader";

const AdminSubjects: React.FC = () => {
  const { UserDetails } = useUser();
  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [subjectToDelete, setSubjectToDelete] = React.useState<Subject | null>(
    null
  );

  const handleDeleteConfirm = async (response: "yes" | "no") => {
    if (!UserDetails?.email) return;
    if (response === "yes" && subjectToDelete) {
      setLoadingData(true);
      try {
        const result = await deleteSubject(
          UserDetails.email,
          subjectToDelete.code
        );
        if (result.success) {
          setSuccess(result.message || "Subject deleted successfully");
          setTimeout(() => setSuccess(""), 2000);
        } else {
          setError(result.message || "Something went wrong.");
          setTimeout(() => setError(""), 2000);
        }
      } catch (err: any) {
        setError("Something went wrong.");
        setTimeout(() => setError(""), 2000);
      } finally {
        setLoadingData(false);
      }
    }
    setSubjectToDelete(null); // hide modal
  };

  const handleDeleteRequest = (subject: Subject) => {
    setSubjectToDelete(subject); // open confirm modal
  };
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    const fetchSubjects = async () => {
      if (!UserDetails?.email) return;

      setLoadingData(true);
      try {
        const result = await getSubjects(UserDetails.email);

        if (result.success) {
          setSubjects(result.data);
        } else {
          setError(result.message || "Something went wrong.");
          setTimeout(() => setError(""), 2000);
        }
      } catch (err: any) {
        setError("Something went wrong.");
        setTimeout(() => setError(""), 2000);
      } finally {
        setLoadingData(false);
      }
    };

    fetchSubjects();
  }, [UserDetails]);

  if (!UserDetails) return null;

  return (
    <div className="flex-grow">
      {error && <ErrorModal error={error} />}
      {success && <SuccessModal success={success} />}
      {/* Confirm delete modal */}
      {subjectToDelete && (
        <ConfirmModal
          confirm="Are you sure you want to delete this subject permanently?"
          onClick={handleDeleteConfirm}
        />
      )}
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl laptop-sm:text-2xl laptop-lg:text-3xl font-bold">
          Subjects
        </h2>
        <AddSubject />
      </div>
      {loadingData ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Clockloader size={60} />
        </div>
      ) : (
        <>
          {subjects.length === 0 ? (
            <div className="flex flex-col h-full w-full translate-y-1/2 items-center gap-4">
              <img src={NoDataImg} alt="No Data" className="h-[25vh] w-auto" />
              <p className="text-gray-400">No subjects found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 tablet:grid-cols-2 laptop-sm:grid-cols-3 gap-4 tablet:gap-8">
                {subjects.map((subject, idx) => (
                  <SubjectData
                    key={idx}
                    subject={subject}
                    deleteClick={() => handleDeleteRequest(subject)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminSubjects;
