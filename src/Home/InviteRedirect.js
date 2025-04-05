import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInviteKey } from "./InviteKeyProvider";

function InviteRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setInviteKey } = useInviteKey();

  useEffect(() => {
    const pathParts = location.pathname.split("/"); // Split the path
    if (pathParts[1] === "inviteKey" && pathParts[2]) {
      const inviteKey = pathParts[2]; // Extract invite key
      console.log("Invite Key:", inviteKey);
      fetch(`/events/inviteKey/${inviteKey}`)
        .then((response) => response.text())
        .then((data) => {
            if(data === "true"){
                setInviteKey(inviteKey);
                navigate("/", { replace: true });
            }else{
                return new Error("Invalid invite link");
            }
        });
    }
  }, [location, navigate]);

  return null; // No UI needed
}

export default InviteRedirect;
