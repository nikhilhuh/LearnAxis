import React from "react";
import { useUser } from "../../context/UserContext";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import NoDataImg from "../../assets/images/nodata.svg";
import RoomData from "../../components/Rooms/RoomData";
import { getRooms } from "../../services/api/apiCalls/common/getRooms";
import AddRoom from "../../components/Rooms/AddRoom";
import ConfirmModal from "../../components/Modals/Status Modals/ConfirmModal";
import { deleteRoom } from "../../services/api/apiCalls/admin/delete/deleteRoom";
import SuccessModal from "../../components/Modals/Status Modals/SuccessModal";
import { Room } from "../../utils/constants";
import Clockloader from "../../components/Loaders/Clockloader";

const AdminRooms: React.FC = () => {
  const { UserDetails } = useUser();
  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [roomToDelete, setRoomToDelete] = React.useState<Room | null>(null);

  const handleDeleteConfirm = async (response: "yes" | "no") => {
    if (!UserDetails?.email) return;
    if (response === "yes" && roomToDelete) {
      setLoadingData(true);
      try {
        const result = await deleteRoom(UserDetails.email, roomToDelete.name);
        if (result.success) {
          setSuccess(result.message || "Room deleted successfully");
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
    setRoomToDelete(null); // hide modal
  };

  const handleDeleteRequest = (room: Room) => {
    setRoomToDelete(room); // open confirm modal
  };
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    const fetchRooms = async () => {
      if (!UserDetails?.email) return;
      setLoadingData(true);
      try {
        const result = await getRooms(UserDetails.email);

        if (result.success) {
          setRooms(result.data);
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

    fetchRooms();
  }, [UserDetails]);

  if (!UserDetails) return null;

  return (
    <div className="flex-grow">
      {error && <ErrorModal error={error} />}
      {success && <SuccessModal success={success} />}
      {/* Confirm delete modal */}
      {roomToDelete && (
        <ConfirmModal
          confirm="Are you sure you want to delete this room permanently?"
          onClick={handleDeleteConfirm}
        />
      )}
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl laptop-sm:text-2xl laptop-lg:text-3xl font-bold">
          Rooms
        </h2>
        <AddRoom />
      </div>
      {loadingData ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Clockloader size={60} />
        </div>
      ) : (
        <>
          {rooms.length === 0 ? (
            <div className="flex flex-col h-full w-full translate-y-1/2 items-center gap-4">
              <img src={NoDataImg} alt="No Data" className="h-[25vh] w-auto" />
              <p className="text-gray-400">No Rooms found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 tablet:grid-cols-2 laptop-sm:grid-cols-3 gap-4 tablet:gap-8">
                {rooms.map((room, idx) => (
                  <RoomData
                    key={idx}
                    room={room}
                    deleteClick={() => handleDeleteRequest(room)}
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

export default AdminRooms;
