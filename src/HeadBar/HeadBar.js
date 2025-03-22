import logo from '../logo.png';
import './HeadBar.css';
import { CgProfile } from "react-icons/cg";

function HeadBar({isAuthenticated, onSignOut, viewProfile, setViewProfile}) {
    const displayProfileView = () => {
        if(!viewProfile)
          setViewProfile(true);
    };
    return (
        <div className='HeaderBar'>
            <div className='Logo'>
              <img src={logo}/>
              <h2>Hisab Kitab</h2>
            </div>
            {
              isAuthenticated ?
              <CgProfile onClick={displayProfileView} style={{ fontSize: '13vw', marginRight: '2vw' }}/> : <div/>
            }
        </div>
    );
}

export default HeadBar;