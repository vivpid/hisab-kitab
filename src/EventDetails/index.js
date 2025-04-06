import { useEffect, useState } from "react";
import './EventDetails.css';
import { MdDeleteForever } from "react-icons/md";

const SETTLEMENT_DESCRIPTION = '__SettlementKey__';

export default function EventDetails({ userId }){
    const [expenseList, setExpenseList] = useState([]);
    const [settlementList, setSettlementList] = useState({});
    const [viewExpenseList, setViewExpenseList] = useState(true);
    const [userIdMapping, setUserIdMapping] = useState({});

    useEffect(() => {
        fetch(`/api/users/${userId}/event`)
          .then((response) => response.json())
          .then((data) => setExpenseList(data.expenses))
          .catch((err) => console.log(err.message));

        fetch('/api/users/settlement')
          .then((response) => response.json())
          .then((data) => setSettlementList(data))
          .catch((err) => console.log(err.message));
        fetch('/api/events/users')
          .then((response)=>response.json())
          .then((data) => setUserIdMapping(data))
          .catch((err) => console.log(err.message));
    }, []);

    return (
      <div className="eventDetailsView">
        <div className="eventOptionsMenu">
          <div 
            className="eventOptionsViewToggle"
            onClick={() => setViewExpenseList(!viewExpenseList)}>{viewExpenseList ? "Settlement" : "Expense List"} > 
          </div>
        </div>
        {
          viewExpenseList ? 
            <ExpenseListView expenseList={expenseList} userIdMapping={userIdMapping} setExpenseList={setExpenseList}/> :
            <SettlementListView currentUserId={userId} settlementList={settlementList} userIdMapping={userIdMapping}/>
        }
      </div>
    );
}


function SettlementListView({ currentUserId, settlementList, userIdMapping }){

  if(Object.keys(settlementList).length===0 || Object.keys(userIdMapping).length===0){
    return (<div>No Settlement Required</div>)
  }
  return (
    <div className="settlementView">
      <div className="ListHeader">Settlement View</div>
      <div className="ListView">
      {Object.keys(settlementList).map((key) => 
          Object.keys(settlementList[key]).map((itemkey) =>
          (
          <div className="ListItem" key={key+1}>
            <div className="userName">{currentUserId===key ? "You" : userIdMapping[key].split(" ")[0]}</div>
            <div className="userDetail" key={itemkey+100}>&nbsp;{currentUserId === key ? "owe" : "owes"} ₹{roundUpToDecimal(settlementList[key][itemkey],2)} to {currentUserId === itemkey ? "You" : userIdMapping[itemkey].split(" ")[0]}</div>
          </div>
          )
          )
      )}
      </div>
    </div>
  )
}

function roundUpToDecimal(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return (Math.ceil(num * factor) / factor);
}

function ExpenseListView({ currentUserId, expenseList, userIdMapping, setExpenseList }){
  
  const deleteExpense = (expenseId) => {
    fetch(`/api/expense/${expenseId}`, {
      method: 'DELETE',
    })
    .then((response) => {
      if(response.ok)
        return response.json();
      throw new Error();
    })
    .then((data) => {
      console.log(data);
      setExpenseList(data)
    })
    .catch((err) => console.log(err.message));
  };

  return (
    <div className="expenseListView">
      <div className="ListHeader">Expenses List</div>
      <div className="ListView">
      {expenseList ? expenseList.sort((a,b) => a.expenseId - b.expenseId).map((item, index) => (item.description === SETTLEMENT_DESCRIPTION) ? 
        (
          <div className="ListItem settlement" key={index}>
            <div className="userName">{item.userName.split(" ")[0]}</div>
            <div className="userDetail">&nbsp;settled ₹{item.amount/2} with {userIdMapping[item.creditors[0]].split(" ")[0]}</div>
            {
              item.userId === currentUserId ?
              <MdDeleteForever 
                onClick={() => deleteExpense(item.expenseId)}
                size={35} 
                style={{ marginRight: '1vh', color: 'rgba(251, 0, 0, 0.43)' }}/>
              : (<></>)
            }
          </div>
        )
        :(
          <div className="ListItem expense" key={index}>
            <div>
              <div className="userName">{item.userName.split(" ")[0]}</div>
              <div className="userDetail">&nbsp;paid ₹{item.amount} for {item.description}</div>
            </div>
            {
              item.userId === currentUserId ?
              <MdDeleteForever 
                onClick={() => deleteExpense(item.expenseId)}
                size={35} 
                style={{ marginRight: '1vh', color: 'rgba(251, 0, 0, 0.43)' }}/>
              : (<></>)
            }
          </div>
        )
      ) : <></>}
      </div>
    </div>
  )
}