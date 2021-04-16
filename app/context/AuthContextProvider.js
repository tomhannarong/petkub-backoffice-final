import React, { createContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ME } from '../apollo/queries';

const initialState = {
  loggedInUser: null,
  setAuthUser: () => {},
};

export const AuthContext = createContext(initialState);

const AuthContextProvider = ({ children }) => {
  const { loading, error, data } = useQuery(ME);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    if (data) setLoggedInUser(data.me);
  }, [data]);

  useEffect(() => {
    const syncSignout = (e) => {
      if (e.key === 'signout') {
        // Log user out
        setLoggedInUser(null);

        // Push user to home page
        window.location.href = '/';
      }
    };

    window.addEventListener('storage', syncSignout);

    return () => window.removeEventListener('storage', syncSignout);
  }, []);


  const setAuthUser = (user) => setLoggedInUser(user);

  // console.log(loggedInUser)
  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
