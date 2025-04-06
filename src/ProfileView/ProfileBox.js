import "./ProfileView.css";
import { IoIosClose } from "react-icons/io";

export default function ProfileBox({ userInfo, onSignOut, setViewProfile }) {
  return (
    <div className="ProfileBox">
      <div className="ProfileBoxHeader">
        <div>Profile</div>
        <IoIosClose
          style={{ fontSize: "8vw" }}
          onClick={() => {
            alert("close profile box");
            setViewProfile(false);
          }}
        />
      </div>
      <div className="InfoBox">
        <div>{userInfo.name}</div>
      </div>
      <div className="InfoBox">
        <div>{userInfo.email}</div>
      </div>
      <button onClick={onSignOut} value="Sg">
        LOGOUT
      </button>
    </div>
  );
}
