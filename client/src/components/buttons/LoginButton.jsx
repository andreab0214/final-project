
import { NavLink } from "react-router-dom";
import styled from "styled-components";


const LoginButton = () => {
  
  return <LoginLink to={"/login"} >Login</LoginLink>;
};

const LoginLink = styled(NavLink)`
  all: unset;
  background-color: #A44200;
  padding: .5rem 1.2rem;
  border-radius: 4px;
  color: #DDBEA8;

  &:hover {
    background-color: #8EA4D2;
    color: #DDBEA8;
    cursor: pointer;
  }
`

export default LoginButton;
