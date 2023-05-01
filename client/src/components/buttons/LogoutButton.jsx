
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from '../UserContext';
import {COLORS} from "../../constants/COLORS"

const LogoutButton = () => {
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    
      e.preventDefault()
    fetch("/api/logout")
    .then(res => res.json())
    .then(data => {
      if(data.status === 200 || 401){
        navigate('/')
        setCurrentUser(null)
      }
     
    })
    .catch(err => console.log(err))
  }
  
  return <LogoutLink to={"/login"} onClick={handleLogout} >Logout</LogoutLink>;
};

const LogoutLink = styled(NavLink)`
  all: unset;
  background-color: ${COLORS.linkBackground};
  padding: .5rem 1.2rem;
  border-radius: 4px;

  &:hover {
    background-color: ${COLORS.hoverBackground};
    color: ${COLORS.hoverColor};
    cursor: pointer;
  }
`

export default LogoutButton;
