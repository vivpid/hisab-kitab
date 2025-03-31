import './ProfileView.css';
import ProfileBox from './ProfileBox.js';
export default function ProfileView(props) {
    const {userInfo, onSignOut} = props;
    //console.log(userInfo);
    return (
    <div className="ProfileView">
        <ProfileBox 
          userInfo={userInfo}
          onSignOut={onSignOut}/>
    </div>
    );
}