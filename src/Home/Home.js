import HeadBar from '../HeadBar/HeadBar';
import BaseView from '../BaseView';
import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import ProfileView from '../ProfileView';
import '../BaseView/BaseView.css';
import { useInviteKey } from './InviteKeyProvider';
import { setIn } from 'immutable';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setuserInfo] = useState(null);
  const [viewProfile, setViewProfile] = useState(false);
  const { inviteKey, setInviteKey } = useInviteKey();
  console.log(inviteKey);

  useEffect(() => {
    const tokenValid = checkTokenExpiration();
    setIsAuthenticated(tokenValid);
  }, []);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("googleAuthToken");
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      if(expirationTime > currentTime){
        setuserInfo(decodedToken);
        return true;
      }
    } catch (error) {
      console.error("Error decoding token", error);
    }
    return false;
  };

  const handleLoginSuccess = (response) => {
    console.log("Login successful:", response);
    const decodedData = jwtDecode(response.credential);
    setuserInfo(decodedData);
    console.log(userInfo);
    fetch('/users', {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: decodedData.sub,
        name: decodedData.name,
        email: decodedData.email,
      }),
    });
    if(inviteKey){
      fetch(`/events/addUser/${userInfo.sub}`, {
        method: 'POST'
      })
      .then(() => setIsAuthenticated(true));
      setInviteKey(null);
    }else{
      setIsAuthenticated(true);
    }
    localStorage.setItem("googleAuthToken", response.credential);
  };

  const handleLoginFailure = (error) => {
    console.error("Login failed:", error);
  };

  const handleLogout = () => {
    localStorage.removeItem("googleAuthToken");
    setViewProfile(false);
    setIsAuthenticated(false);
    setuserInfo(null);
  };
  
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GAUTH_CLIENT_ID}>
      <HeadBar
        viewProfile={viewProfile}
        setViewProfile={setViewProfile}
        isAuthenticated={isAuthenticated}
        onSignOut={handleLogout}/>

      <div className="BaseView">
        {isAuthenticated ? (
          <BaseView userInfo={userInfo} onSignOut={handleLogout} />
        ) : (
          <div className="LoginScreen">
            <h1>Login</h1>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
            />
          </div>
        )}
        {viewProfile ? (
          <ProfileView userInfo={userInfo} onSignOut={handleLogout}/>
        ): <div/>}
      </div>
    </GoogleOAuthProvider>
  );
}

export default Home;
