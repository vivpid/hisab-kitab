import React, { createContext, useContext, useState } from 'react';

const InviteKeyContext = createContext(null);

export const useInviteKey = () => useContext(InviteKeyContext);

export const InviteKeyProvider = ({ children }) => {
  const [inviteKey, setInviteKey] = useState(null);
  return (
    <InviteKeyContext.Provider value={{ inviteKey, setInviteKey }}>
      {children}
    </InviteKeyContext.Provider>
  );
};
