
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {COLORS} from "../../constants/COLORS"


const LoginButton = () => {
  
  return <LoginLink to={"/login"} >Login</LoginLink>;
};

const LoginLink = styled(NavLink)`
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

export default LoginButton;
