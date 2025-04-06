import './ProfileView.css';
import ProfileBox from './ProfileBox.js';
export default function ProfileView(props) {
    const {userInfo, onSignOut, setViewProfile} = props;
    //console.log(userInfo);
    return (
    <div className="ProfileView">
        <ProfileBox 
          userInfo={userInfo}
          onSignOut={onSignOut}
          setViewProfile={setViewProfile}/>
    </div>
    );
}