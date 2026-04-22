import React, { createContext, useState, useEffect, useContext } from 'react';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    const storedUser = localStorage.getItem('userInfo');
    if (storedToken) {
      setUserToken(storedToken);
      setUserInfo(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  const loginUser = (token, user) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    setUserToken(token);
    setUserInfo(user);
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setUserToken(null);
    setUserInfo(null);
  };

  const isUserLoggedIn = !!userToken;

  return (
    <UserAuthContext.Provider value={{ userToken, userInfo, loginUser, logoutUser, isUserLoggedIn }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
