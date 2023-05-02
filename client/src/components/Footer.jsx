import styled from "styled-components";
import { Link } from "react-router-dom";
import {COLORS} from "../constants/COLORS";

const Footer = () => {
  return (
    <Container>
      <div>
        <StyledLink to='/'>About</StyledLink>
        <StyledLink to='/'>Support</StyledLink>
        <StyledLink to='/'>FAQs</StyledLink>
        <StyledLink to='/'>Contact</StyledLink>
      </div>
      <TextCopyright>
        Copyright Ⓒ2023 onSite. All right reserved{" "}
      </TextCopyright>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  height: 5rem;
  background-color: ${COLORS.footer};
  position:fixed;
  left:0;
  bottom:0;
  right:0;
`;


const StyledLink = styled(Link)`
  all: unset;
  font-weight: 700;
  margin: 0 2rem;

  :hover {
    text-decoration: underline;
    cursor:pointer
  }

`

const TextCopyright = styled.p`
  font-weight: 700;
`;
