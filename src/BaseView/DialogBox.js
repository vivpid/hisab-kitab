import { Button } from "@mui/material";
import "./BaseView.css";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputAdornment from '@mui/material/InputAdornment';
import Select from "@mui/material/Select";
import SettledExpenses from "./SettledExpenses.png";
import { ClipLoader } from "react-spinners";
import { Share } from '@capacitor/share';

const SETTLEMENT_DESCRIPTION = '__SettlementKey__';

export default function DialogBox(props) {
  const { dialogType, setDialogProps, userId, setEventData, eventData } = props;
  return (
    <div className="dialogBoxView">
      <div className="dialogBox">
        {dialogType === "viewEventDetails" ?
          <ViewEventDetails
            setDialogProps={setDialogProps}
            currentUserId={userId}
            setEventData={setEventData}
            eventData={eventData}/>
         :dialogType === "AddEvent" ? (
          <AddEventDialog
            setDialogProps={setDialogProps}
            userId={userId}
            setEventData={setEventData}
          />
        ) : dialogType === "AddExpense" ? (
          <AddExpense
            setDialogProps={setDialogProps}
            userId={userId}
          />
        ) : dialogType === "AddMember" ? 
          (<AddMember currentUserId={userId} setDialogProps={setDialogProps} eventData={eventData}/>)
          : (
          <SettleUp userId={userId} setDialogProps={setDialogProps}/>
        )}
      </div>
    </div>
  );
}

function AddMember({currentUserId, setDialogProps}){
  const [userIdMapping, setUserIdMapping] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch('/api/events/users')
          .then((response)=>response.json())
          .then((data) => setUserIdMapping(data))
          .catch((err) => console.log(err.message));
  }, []);

  const copyInvite = () => {
    setLoading(true);
    fetch('/api/events/inviteKey')
      .then((response) => {
        if(response.ok){
          return response.text();
        }
      })
      .then((data) => {
        setLoading(false);
        const inviteLink = `http://hisab-kitab.ddns.net/inviteKey/${data}`;
        if(data.length > 0){
          try {
            navigator.clipboard.writeText(inviteLink).then(() => alert("Invite link copied to clipboard!"));
          } catch (error) {
            console.error('Error sharing:', error);
            alert(error.message);
          }
        }
      });
  }

  const removeMember = (userId) => {
    fetch(`/api/users/${currentUserId}/delete/${userId}`, {
      method: 'DELETE'
    })
    .then((response) => response.json())
    .then((data) => {
      setUserIdMapping(data);
    })
    .catch((err) => console.log(err.message));
  };

  return (
    <div className="DialogBox">
      <div className="dialogHeader">
        <div className="dialogName">Members</div>
        <IoIosClose
          style={{ fontSize: "8vw" }}
          onClick={() => setDialogProps(null)}
        />
      </div>
      <hr />
      {
        Object.keys(userIdMapping).length > 0 ? 
        Object.keys(userIdMapping).map((key) => 
        <div className="MemberList">
          <div> {userIdMapping[key]} </div>
          {currentUserId === '105532310443150760976' ?
            (<IoIosClose
            style={{ fontSize: "6vw", color: "red" }}
            onClick={() => removeMember(key)}
            />) : (<></>)
          }
        </div>
        ) :
        (<></>)
      }
      
      <Button
        color="rgb(78, 216, 223)"
        size="small"
        onClick={copyInvite}
        loading={loading}
        sx={{
          justifyContent: "center",
          alignContent: "center",
          marginTop: "3vw",
        }}
      >
        Share Invite!
      </Button>
    </div>
  );
}


function ViewEventDetails({ currentUserId, eventData, setEventData, setDialogProps }) {
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState(null);
  const [initiatorName, setInitiatorName] = useState("fetching...");
  useEffect(() => {
    fetch(`/api/users/${eventData.initiatorId}`)
      .then((response) => response.json())
      .then((data) => setInitiatorName(data.name))
      .catch((err) => console.log(err.message));
  })

  const deleteEvent = () => {
    setLoading(true);
    fetch("/api/events", {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((eventData) => {
        setLoading(false);
        setDialogProps(null);
        setEventData({});
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };
  return (
    <div className="DialogBox">
      <div className="dialogHeader">
        <div className="dialogName">Event</div>
        <IoIosClose
          style={{ fontSize: "8vw" }}
          onClick={() => setDialogProps(null)}
        />
      </div>
      <hr />
      <TextField
        id="eventName"
        label="Event Name"
        value={eventData.eventName}
        variant="outlined"
        size="small"
        disabled={currentUserId !== eventData.initiatorId || currentUserId !== '105532310443150760976'}
        onChange={(e) => setEventName(e.target.value)}
        sx={{
          marginTop: "2vw",
          "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
          },
        }}
      />
      <TextField
        id="eventDate"
        label="Event Started On"
        value={eventData.eventDate}
        variant="outlined"
        size="small"
        disabled={true}
        sx={{
          marginTop: "2vw",
          "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
          },
        }}
      />
      <TextField
        id="initiatorId"
        label="Event Started By"
        value={currentUserId ? initiatorName : initiatorName}
        variant="outlined"
        size="small"
        disabled={true}
        sx={{
          marginTop: "2vw",
          "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
          },
        }}
      />
      <TextField
        id="totalMember"
        label="Total Members"
        value={eventData.users.length}
        variant="outlined"
        size="small"
        disabled={true}
        sx={{
          marginTop: "2vw",
          "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
          },
        }}
      />
      <Button
        color="rgb(78, 216, 223)"
        size="small"
        onClick={() => {
          const userConfirmed = window.confirm("Are you sure you want to delete the event?");
          if (userConfirmed) {
            deleteEvent();
          }
        }}
        disabled={currentUserId !== eventData.initiatorId || currentUserId !== '105532310443150760976'}
        loading={loading}
        sx={{
          justifyContent: "center",
          alignContent: "center",
          marginTop: "3vw",
          color: "red",
        }}
      >
        Delete Event
      </Button>
    </div>
  );
}

function AddEventDialog({ userId, setEventData, setDialogProps }) {
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState(null);
  const addEvent = () => {
    setLoading(true);
    fetch("/api/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: eventName,
        initiatorId: userId,
      }),
    })
      .then((response) => response.json())
      .then((eventData) => {
        setLoading(false);
        setEventData(eventData);
        setDialogProps(null);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };
  return (
    <div className="DialogBox">
      <div className="dialogHeader">
        <div className="dialogName">Event</div>
        <IoIosClose
          style={{ fontSize: "8vw" }}
          onClick={() => setDialogProps(null)}
        />
      </div>
      <hr />
      <TextField
        id="eventName"
        label="Event Name"
        variant="outlined"
        size="small"
        disabled={loading}
        onChange={(e) => setEventName(e.target.value)}
        sx={{
          marginTop: "2vw",
          "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
          },
        }}
      />
      <Button
        color="rgb(78, 216, 223)"
        size="small"
        onClick={addEvent}
        loading={loading}
        sx={{
          justifyContent: "center",
          alignContent: "center",
          marginTop: "3vw",
        }}
      >
        Add Event
      </Button>
    </div>
  );
}

function AddExpense({ userId, setDialogProps }) {
  const [loading, setLoading] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState(['*']);
  const [allUsers, setAllUsers] = useState({});
  const [expenseAmountError, setExpenseAmountError] = useState(false);
  const [expenseTitleError, setExpenseTitleError] = useState(false);

  
  useEffect(() => {
    setLoading(true);
    fetch('/api/events/users')
      .then((response)=>response.json())
      .then((data) => {
        setLoading(false);
        setAllUsers(data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    if(value[value.length-1] === '*'){
        setSelectedUsers(['*']);
    }else{
        setSelectedUsers(value.filter((item) => item!=='*'));
    }
  }

  const addExpense = () => {
    console.log(expenseAmount+" "+expenseTitle);
    if(expenseTitle === null || expenseTitle.trim().length === 0){
        if(expenseAmount === null || expenseAmount < 1)
            setExpenseAmountError(true);
        setExpenseTitleError(true);
    }else if(expenseAmount===null || expenseAmount < 1){
        setExpenseAmountError(true);
    }else{
        setLoading(true)
        fetch(`/api/users/${userId}/expense`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: expenseAmount,
                description: expenseTitle,
                creditors: selectedUsers,
            }),
        })
        .then(() => {
            setLoading(false);
            setDialogProps(null);
        });
    }
  };
  return (
    <div className="DialogBox">
      <div className="dialogHeader">
        <div className="dialogName">Expense Details</div>
        <IoIosClose
          style={{ fontSize: "8vw" }}
          onClick={() => setDialogProps(null)}
        />
      </div>
      <hr />
      <TextField
        id="expenseTitle"
        label="What did you pay for?"
        variant="outlined"
        size="small"
        defaultValue={expenseTitle}
        disabled={loading}
        error={expenseTitleError}
        onChange={(e) => {
            setExpenseTitleError(false);
            setExpenseTitle(e.target.value)
        }}
        sx={{
          marginTop: "2vw",
          "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
          },
        }}
      />
      <TextField
        id="expenseAmount"
        label="How much did you pay?"
        variant="outlined"
        size="small"
        type="number"
        defaultValue={expenseAmount}
        error={expenseAmountError}
        disabled={loading}
        onChange={(e) => {
            if(e.target.value>0){
                setExpenseAmountError(false);
                setExpenseAmount(e.target.value);
            }
        }}
        sx={{
          marginTop: "2vw",
          "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
          },
        }}
        slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            },
          }}
      />
      <FormControl 
        sx={{
            marginTop: "2vh",
            "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
            "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
            },
        }} size="small">
        <InputLabel id="payee">Split With</InputLabel>
        <Select
          labelId="payee"
          id="pqyee-selector"
          value={selectedUsers}
          label="Split With"
          multiple
          onChange={handleChange}
          renderValue={(selected) => 
            selected.length > 2 
              ? `${selected.slice(0, 2).map((key) => allUsers[key].split(" ")[0]).join(", ")}...`  // Truncate if more than 2 items
              : selected.map((key) => key==='*'? 'Everyone': allUsers[key].split(" ")[0]).join(", ")
          }
        >
            <MenuItem value="*">Everyone</MenuItem>
            {Object.keys(allUsers).map((key) => (
                <MenuItem key={key} value={key}>{allUsers[key].split(" ")[0]}</MenuItem>
            ))}
        </Select>
      </FormControl>
      <Button
        color="rgb(78, 216, 223)"
        size="small"
        onClick={addExpense}
        loading={loading}
        sx={{
          justifyContent: "center",
          alignContent: "center",
          marginTop: "3vw",
        }}
      >
        Add Expense
      </Button>
    </div>
  );
}

function SettleUp({ userId, setDialogProps }) {
  const [loading, setLoading] = useState(true);
  const [expenseAmount, setExpenseAmount] = useState(null);
  const [paidTo, setPaidTo] = useState(null);
  const [allUsers, setAllUsers] = useState({});
  const [settlementList, setSettlementList] = useState({});
  const [expenseAmountError, setExpenseAmountError] = useState(false);

  
  useEffect(() => {
    fetch('/api/events/users')
      .then((response)=>response.json())
      .then((data) => setAllUsers(data))
      .catch((err) => console.log(err.message));
    fetch('/api/users/settlement')
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setSettlementList(data[userId] ? data[userId] : {})
      })
      .catch((err) => console.log(err.message));
  }, []);

  const handleChange = (event) => {
    setPaidTo(event.target.value);
    setExpenseAmount(roundUpToDecimal(settlementList[event.target.value],2));
  }

  const settleUp = () => {
    console.log(expenseAmount+" "+paidTo);
    if(expenseAmount===null || expenseAmount < 1){
        setExpenseAmountError(true);
    }else{
        setLoading(true);
        fetch(`/api/users/${userId}/expense`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: 2*expenseAmount,
                description: SETTLEMENT_DESCRIPTION,
                creditors: [paidTo],
            }),
        })
        .then(() => {
            setLoading(false);
            setDialogProps(null);
        });
    }
  };

  if(Object.keys(settlementList).length === 0){
    return (loading === true) ? 
        (<ClipLoader
          color="rgb(78, 216, 223)"
          size={100}
          cssOverride={{
            display: "grid",
            justifySelf: "center",
          }}/> )
        :
        (<div>
          <div className="allSettledUp">
            <IoIosClose
              style={{ fontSize: "8vw", justifyContent: "end"}}
              onClick={() => setDialogProps(null)}
            />
          </div>
          <img src={SettledExpenses} style={{ width: "100%"}}/>
        </div>);
  }
  return (
    <div className="DialogBox">
      <div className="dialogHeader">
        <div className="dialogName">Expense Details</div>
        <IoIosClose
          style={{ fontSize: "8vw" }}
          onClick={() => setDialogProps(null)}
        />
      </div>
      <hr />
      
      <FormControl 
        sx={{
            marginTop: "2vh",
            "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
            "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
            },
            width: "100%"
        }} size="small">
        <InputLabel id="payTo">Settle With</InputLabel>
        <Select
          labelId="payTo"
          id="payTo-selector"
          label="Settle With"
          loading={loading}
          value={paidTo}
          onChange={handleChange}
        >
            {Object.keys(settlementList).map((key) => (
                <MenuItem key={key} value={key}>{allUsers[key].split(" ")[0]}</MenuItem>
            ))}
        </Select>
      </FormControl>
      <TextField
        id="expenseAmount"
        label="Amount"
        variant="outlined"
        size="small"
        type="number"
        value={expenseAmount}
        error={expenseAmountError}
        disabled={loading}
        onChange={(e) => {
            if(e.target.value>0){
                setExpenseAmountError(false);
                setExpenseAmount(e.target.value);
            }
        }}
        sx={{
          marginTop: "2vw",
          "& label.Mui-focused": { color: "rgb(78, 216, 223)" },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "rgb(78, 216, 223)" }, // Border color when focused
          },
        }}
        slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            },
          }}
      />
      <Button
        color="rgb(78, 216, 223)"
        size="small"
        onClick={settleUp}
        loading={loading}
        sx={{
          justifyContent: "center",
          alignContent: "center",
          marginTop: "3vw",
        }}
      >
        Settle Up
      </Button>
    </div>
  );
}

function roundUpToDecimal(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return (Math.ceil(num * factor) / factor);
}