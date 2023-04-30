import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    fetch(`/api/user`)
    .then(res => {
        return res.json()})
    .then(data => {
        if(data.status === 200) {
            setCurrentUser(data.data)
        } 
         else {
            setCurrentUser(undefined)
        }
    })
    .catch(err => {
    console.log("error")
        console.log("error", err)})
},[])
  

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
