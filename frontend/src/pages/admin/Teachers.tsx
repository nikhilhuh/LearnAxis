import React from "react";
import { useUser } from "../../context/UserContext";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import NoDataImg from "../../assets/images/nodata.svg";
import TeacherData from "../../components/Teachers/TeacherData";
import AddTeacher from "../../components/Teachers/AddTeacher";
import { getTeachers } from "../../services/api/apiCalls/admin/get/getTeachers";
import ConfirmModal from "../../components/Modals/Status Modals/ConfirmModal";
import { deleteTeacher } from "../../services/api/apiCalls/admin/delete/deleteTeacher";
import SuccessModal from "../../components/Modals/Status Modals/SuccessModal";
import { Teacher } from "../../utils/constants";
import Clockloader from "../../components/Loaders/Clockloader";
import { useNavigate } from "react-router-dom";

const AdminTeachers: React.FC = () => {
  const { UserDetails } = useUser();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [teacherToDelete, setTeacherToDelete] = React.useState<Teacher | null>(
    null
  );

  const handleDeleteConfirm = async (response: "yes" | "no") => {
    if (!UserDetails?.email) return;
    if (response === "yes" && teacherToDelete) {
      setLoadingData(true);
      try {
        const result = await deleteTeacher(
          UserDetails.email,
          teacherToDelete.user_id
        );
        if (result.success) {
          setSuccess(result.message || "Teacher deleted successfully");
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
    setTeacherToDelete(null); // hide modal
  };

  const handleDeleteRequest = (teacher: Teacher) => {
    setTeacherToDelete(teacher); // open confirm modal
  };
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    const fetchTeachers = async () => {
      if (!UserDetails?.email || UserDetails.role !== "admin") return;
      setLoadingData(true);
      try {
        const result = await getTeachers(UserDetails.email);

        if (result.success) {
          setTeachers(result.data);
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

    fetchTeachers();
  }, [UserDetails]);

  if (!UserDetails) return null;

  return (
    <div className="flex-grow">
      {error && <ErrorModal error={error} />}
      {success && <SuccessModal success={success} />}
      {/* Confirm delete modal */}
      {teacherToDelete && (
        <ConfirmModal
          confirm="Are you sure you want to delete this teacher permanently?"
          onClick={handleDeleteConfirm}
        />
      )}
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl laptop-sm:text-2xl laptop-lg:text-3xl font-bold">
          Teachers
        </h2>
        <AddTeacher />
      </div>
      {loadingData ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Clockloader size={60} />
        </div>
      ) : (
        <>
          {teachers.length === 0 ? (
            <div className="flex flex-col h-full w-full translate-y-1/2 items-center gap-4">
              <img src={NoDataImg} alt="No Data" className="h-[25vh] w-auto" />
              <p className="text-gray-400">No teachers found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 tablet:grid-cols-2 laptop-sm:grid-cols-3 gap-4 tablet:gap-8">
                {teachers.map((teacher, idx) => (
                  <TeacherData
                    key={idx}
                    teacher={teacher}
                    onClick={() =>
                      navigate(
                        `/admin/teachers/${encodeURIComponent(
                          teacher.user_id
                        )}`,
                        {
                          state: { teacher }, // passing teacher as location.state
                        }
                      )
                    }
                    deleteClick={() => handleDeleteRequest(teacher)}
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

export default AdminTeachers;
