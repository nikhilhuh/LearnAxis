import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import SuccessModal from "../Modals/Status Modals/SuccessModal";
import ErrorModal from "../Modals/Status Modals/ErrorModal";
import { addRoom } from "../../services/api/apiCalls/admin/add/addRooms";
import AddRoomModal from "../Modals/Input Modals/AddRoomModal";
import { Room } from "../../utils/constants";
import Cliploader from "../Loaders/Cliploader";

const AddRoom: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const { UserDetails } = useUser();
  if (!UserDetails) return null;

  const onClose = () => {
    setIsOpen(false);
  };
  const handleAddRoom = async (rooms: Room[]) => {
    setLoading(true);
    try {
      const response = await addRoom(UserDetails.email, rooms);
      if (response.success) {
        setSuccess(response.message || "Room(s) added successfully");
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
      <AddRoomModal
        isOpen={isOpen}
        onClose={onClose}
        handleAddRooms={handleAddRoom}
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
            <span>Add Room</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AddRoom;
