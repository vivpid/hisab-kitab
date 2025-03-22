import './ProfileView.css';

export default function ProfileBox({ userInfo, onSignOut }){
  return (
  <div className="ProfileBox">
    <div className="InfoBox">
        <div>{userInfo.name}</div>
    </div>
    <div className="InfoBox">
        <div>{userInfo.email}</div>
    </div>
    <button onClick={onSignOut} value='Sg'>LOGOUT</button>
  </div>)
}