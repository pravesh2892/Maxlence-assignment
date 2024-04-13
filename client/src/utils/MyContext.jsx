import React, { createContext, useState } from 'react';

const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [data, setData] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [email, setEmail] = useState();

  return (
    <MyContext.Provider value={{ data, setData, name, setName, surname, setSurname, email, setEmail }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContextProvider as default, MyContext };