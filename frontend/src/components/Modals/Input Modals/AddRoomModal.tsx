import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import { Room } from "../../../utils/constants";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddRooms: (rooms: Room[]) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  handleAddRooms,
}) => {
  const [rooms, setRooms] = useState<Room[]>([{ name: "", capacity: null }]);

  if (!isOpen) return null;

  const handleInputChange = (
    index: number,
    field: keyof Room,
    value: string
  ) => {
    const updated = [...rooms];
    if (field === "capacity") {
      updated[index][field] = value === "" ? null : Number(value);
    } else {
      updated[index][field] = value;
    }
    setRooms(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddRooms(rooms);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-primaryHover)]/20 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-[var(--color-primary)]/80 backdrop-blur-md border border-[var(--color-secondary)]/80 
        shadow-2xl drop-shadow-2xl rounded-xl laptop-lg:rounded-3xl w-[90vw] tablet:w-[70vw] laptop-sm:w-[60vw] z-40`}>
        <div className="bg-[var(--color-secondary)] px-4 py-2 rounded-tr-xl laptop-lg:rounded-tr-3xl rounded-tl-xl laptop-lg:rounded-tl-3xl flex justify-between items-center">
          <div className="font-semibold">Add Room(s)</div>
          <IoMdClose
            title="Close"
            className="text-red-700 text-2xl cursor-pointer hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="text-sm tablet:text-base p-4 h-[40vh] tablet:h-[45vh] max-h-[40vh] tablet:max-h-[45vh] overflow-y-auto flex flex-col justify-between">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="border p-4 my-2 rounded-md space-y-3 bg-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Room {index + 1}</h3>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setRooms((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-red-600 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`Name${index}`} className="font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id={`Name${index}`}
                  className="modal-input-field"
                  value={room.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  placeholder="room name"
                  required
                />
              </div>

              <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                <label htmlFor={`Capacity${index}`} className="font-semibold">
                  Capacity
                </label>
                <input
                  type="number"
                  id={`Capacity${index}`}
                  className="modal-input-field"
                  value={room.capacity === null ? "" : room.capacity}
                  onChange={(e) =>
                    handleInputChange(index, "capacity", e.target.value)
                  }
                  placeholder="room capacity"
                  min={1}
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setRooms((prev) => [...prev, { name: "", capacity: null }])
            }
            className="add-another-button"
          >
            <FaPlusCircle />
            Add another Room
          </button>

          <div className="flex gap-4 justify-around mt-4">
            <button
              type="button"
              title="Cancel addition"
              onClick={onClose}
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

export default AddRoomModal;
