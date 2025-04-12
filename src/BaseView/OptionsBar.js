import { useState } from 'react';
import './BaseView.css';
export default function OptionsBar({ userId, showEventOptions, setDialogProps, setEventData }){
    return (<div>
      <hr/>
        {showEventOptions ? 
        <EditExpense userId={userId} setDialogProps={setDialogProps}/> : 
        <AddEvent userId={userId} setDialogProps={setDialogProps} setEventData={setEventData}/>}
        </div>);
}


function EditExpense({userId, setDialogProps, setEventData}){
    const [addExpenseBGC, setAddExpenseBGC] = useState("#ffffff");
    const [settleUpBGC, setSettleUpBGC] = useState("#ffffff");
    return (
    <div className='editExpense'>
        <div className='addExpense'
          style={{ backgroundColor: addExpenseBGC }}
          onTouchStart={() => setAddExpenseBGC("#0000001c")}
          onTouchEnd={() => setAddExpenseBGC("#ffffff")}
          onMouseDown={() => setAddExpenseBGC("#0000001c")}
          onMouseUp={() => setAddExpenseBGC("#ffffff")}
          onClick={() => setDialogProps({
            dialogType: 'AddExpense',
            userId: userId,
            setDialogProps: setDialogProps,
            setEventData: setEventData,
          })}>
          Add Expense
        </div>
        <div className='settleUp'
          style={{ backgroundColor: settleUpBGC }}
          onTouchEnd={() => setSettleUpBGC("#ffffff")}
          onTouchStart={() => setSettleUpBGC("#0000001c")}
          onMouseUp={() => setSettleUpBGC("#ffffff")}
          onMouseDown={() => setSettleUpBGC("#0000001c")}
          onClick={() => setDialogProps({
            dialogType: 'SettleUp',
            userId: userId,
            setDialogProps: setDialogProps,
            setEventData: setEventData,
          })}>
          Settle Up
        </div>
    </div>);
}

function AddEvent({ userId, setDialogProps, setEventData}){
  const [addEventBGC, setAddEventBGC] = useState("#ffffff");
  return (
    <div className='addEvent'
      style={{ backgroundColor: addEventBGC }}
      onTouchStart={() => setAddEventBGC("#0000001c")}
      onTouchEnd={() => setAddEventBGC("#ffffff")}
      onMouseDown={() => setAddEventBGC("#0000001c")}
      onMouseUp={() => setAddEventBGC("#ffffff")}
      onClick={() => setDialogProps({
        dialogType: 'AddEvent',
        userId: userId,
        setDialogProps: setDialogProps,
        setEventData: setEventData,
      })}
    >
      Add Event
    </div>
  );
}