
import {useContext} from 'react'
import { NavLink} from 'react-router-dom';
import styled from 'styled-components';
import LoginButton from './buttons/LoginButton';
import LogoutButton from './buttons/LogoutButton';
import { UserContext } from './UserContext';
import logo from '../assets/logo.png'
import {COLORS} from '../constants/COLORS'


const Header = () => {
  const {currentUser, setCurrentUser} = useContext(UserContext);

  return (

    <ContainerHeader>
        <NavLink to={"/"}> <Logo src={logo} /> </NavLink>
        {currentUser ? null : <StyledLink to={"/packages"}>Packages</StyledLink>}
      
        {currentUser && <Div><StyledLink to={currentUser?.role === "user" ? `/dashboard/${currentUser.name}` : "/dashboard"}>Dashboard</StyledLink></Div> } 
        
        
        {!currentUser ? <div>
          <LoginButton to={"/login"} /> 
        </div> : <LogoutButton />
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
  background-color: ${COLORS.background};
  padding: 0 3rem;
  position: fixed;
  z-index: 100;
  width: 100%;
`;

const Logo = styled.img`
  height: 1.5rem;

`
const Div = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`
const StyledLink = styled(NavLink)`
  all: unset;
  :hover {
    cursor: pointer;
    color: ${COLORS.hoverColor};
  }
`


export default Header