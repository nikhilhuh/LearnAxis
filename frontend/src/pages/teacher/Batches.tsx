import React from "react";
import { useUser } from "../../context/UserContext";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import NoDataImg from "../../assets/images/nodata.svg";
import BatchData from "../../components/Batches/BatchData";
import { Batch } from "../../utils/constants";
import Clockloader from "../../components/Loaders/Clockloader";
import { getTeacherBatches } from "../../services/api/apiCalls/teacher/getTeacherBatches";
import { useNavigate } from "react-router-dom";

const TeacherBatches: React.FC = () => {
  const { UserDetails } = useUser();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [batches, setBatches] = React.useState<Batch[]>([]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    const fetchBatches = async () => {
      if (!UserDetails?.email) return;

      setLoadingData(true);
      try {
        const result = await getTeacherBatches(UserDetails.email);

        if (result.success) {
          setBatches(result.data);
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

    fetchBatches();
  }, [UserDetails]);

  if (!UserDetails) return null;

  return (
    <div className="flex-grow">
      {error && <ErrorModal error={error} />}
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl laptop-sm:text-2xl laptop-lg:text-3xl font-bold">
          My Batches
        </h2>
      </div>
      {loadingData ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Clockloader size={60} />
        </div>
      ) : (
        <>
          {batches.length === 0 ? (
            <div className="flex flex-col h-full w-full translate-y-1/2 items-center gap-4">
              <img src={NoDataImg} alt="No Data" className="h-[25vh] w-auto" />
              <p className="text-gray-400">No batches found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 tablet:grid-cols-2 laptop-sm:grid-cols-3 gap-4 tablet:gap-8">
                {batches.map((batch, idx) => (
                  <BatchData
                    key={idx}
                    batch={batch}
                    onClick={() =>
                      navigate(`/teacher/batches/${encodeURIComponent(batch.name)}`, {
                        state: { batch }, // passing batch as location.state
                      })
                    }
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

export default TeacherBatches;
