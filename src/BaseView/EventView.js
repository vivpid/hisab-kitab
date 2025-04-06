import { useEffect } from "react";
import { FaPeopleGroup } from "react-icons/fa6";
import NoEvent from './NoEvents.png';
import EventDetails from "../EventDetails";

export default function EventView({ userId, eventData, setDialogProps}) {
    useEffect(()=>{
        console.log(JSON.stringify(eventData));
    }, []);
    return (
    <div className="eventView" style={{
        alignContent: Object.keys(eventData).length > 0? "start" : "center",
     }}>
        { Object.keys(eventData).length > 0?
        <>
          <EventHeader userId={userId} eventName={eventData.eventName} setDialogProps={setDialogProps} eventData={eventData}/>
          <EventDetails userId={userId} /> 
        </>:
        <img src={NoEvent}/>}
    </div>);
}

function EventHeader({userId, eventName, setDialogProps, eventData}){
    return (
        <div className="eventHeader">
            <div onClick={() => setDialogProps({
                dialogType: 'viewEventDetails',
                setDialogProps: setDialogProps,
                eventData: eventData,
                userId: userId,
              })}>{eventName}</div>
            <FaPeopleGroup style={{ fontSize: '8vw', marginLeft: '2vw', marginTop: '7px' }} 
              onClick={() => setDialogProps({
                dialogType: 'AddMember',
                setDialogProps: setDialogProps,
                eventData: eventData,
                userId: userId,
              })}/>
        </div>
    );
}
