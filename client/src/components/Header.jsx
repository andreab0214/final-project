
import {useEffect, useContext} from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LoginButton from './buttons/LoginButton';
import LogoutButton from './buttons/LogoutButton';
import SignUpButton from './buttons/SignUpButton';
import { UserContext } from './UserContext';


const Header = () => {
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

  return (

    <ContainerHeader>
        <NavLink to={"/"}>Logo</NavLink>
        <Div>
        <StyledLink to={"/packages"}>Packages</StyledLink>
        </Div>
        {currentUser && <Div><StyledLink to={currentUser?.role === "user" ? `/dashboard/${currentUser.name}` : "/dashboard"}>Dashboard</StyledLink></Div> } 
        
        
        {!currentUser ? <div>
          <LoginButton to={"/login"}> Login </LoginButton>
        </div> : <button onClick={handleLogout}>Logout</button>
         }
        
       
    </ContainerHeader>
  )
}

const ContainerHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  box-shadow: 0 2px 5px -5px rgb(0, 0, 0 );
  background-color: #f7e9d5;
  padding: 0 3rem;
  position: fixed;
  z-index: 100;
  width: 100%;
`;

const Div = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`
const StyledLink = styled(NavLink)`
  all: unset;
  :hover {
    cursor: pointer;
    color: #197BBD;
  }
`


export default Header