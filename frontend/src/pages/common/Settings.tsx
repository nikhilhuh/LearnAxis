import React from "react";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import SuccessModal from "../../components/Modals/Status Modals/SuccessModal";
import Profile from "../../components/Settings/Profile";
import Appearance from "../../components/Settings/Appearance";
import System from "../../components/Settings/System";

const Settings: React.FC = () => {
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {error && <ErrorModal error={error} />}
      {success && <SuccessModal success={success} />}
      {/* profile section */}
      <Profile />
      {/* appearance settings List */}
      <Appearance />
      {/* system settings list */}
      <System setError={setError} setSuccess={setSuccess} />
    </div>
  );
};

export default Settings;
