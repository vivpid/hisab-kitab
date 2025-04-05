import { useEffect, useState } from "react";
import EventView from "./EventView";
import OptionsBar from "./OptionsBar";
import { ClipLoader } from "react-spinners";
import DialogBox from "./DialogBox";

const BaseView = (props) => {
  const [eventData, setEventData] = useState(null);
  const [dialogProps, setDialogProps] = useState(null);
  const {userInfo} = props;

  const override = {
    display: "grid",
    justifySelf: "center",
  };

  useEffect(() => {
    fetch(`http://${process.env.REACT_APP_API_URL}/users/${userInfo.sub}/event`)
      .then((response)=> {
        if(response.ok)
          return response.json();
        throw new Error();
      })
      .then((jsonData)=> setEventData(jsonData))
      .catch((err) => {
        console.log(err.message);
        setEventData({});
      });
  }, []);
  
  return (
    <div className="BaseView">
      {dialogProps ?
      <DialogBox {...dialogProps} setEventData={setEventData} /> :
      <>
        { 
        eventData ?
        <EventView userId={userInfo.sub} eventData={eventData} setDialogProps={setDialogProps}/> : 
        <div style={{ height: "80vh", alignContent: "center"}}>
          <ClipLoader
          color="rgb(78, 216, 223)"
          size={100}
          cssOverride={override}/>
        </div>
        }
        <OptionsBar 
          userId={userInfo.sub} 
          showEventOptions={eventData?.eventName ? true: false} 
          setEventData={setEventData} 
          setDialogProps={setDialogProps}/>
      </>
      }
    </div>
    );
};

export default BaseView;
