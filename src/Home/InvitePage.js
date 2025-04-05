import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useInviteKey } from "./InviteKeyProvider";

function InvitePage() {
  const { key } = useParams();
  const navigate = useNavigate();
  const { setInviteKey } = useInviteKey();

  useEffect(() => {
    if (key) {
      console.log("Invite Key:", key);
      fetch(`/api/events/inviteKey/${key}`)
        .then((response) => response.text())
        .then((data) => {
            if(data === "true"){
                setInviteKey(key);
                navigate("/", { replace: true });
            }else{
                return new Error("Invalid invite link");
            }
        });
    }
  }, [key, navigate]);

  return null; // No UI since user gets redirected
}

export default InvitePage;
