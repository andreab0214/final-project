import { Link } from 'react-router-dom';
import styled from 'styled-components'

const LinkButton = ({url, state, children}) => {
    
  return <StyledLink to={url} state={state}>{children} </StyledLink>
  
}

const StyledLink = styled(Link)`
    all: unset;
    background-color: #A44200;
    color: #F3DFC1;
    padding: .4rem .6rem;
    border-radius: 2px;
    transition: all 0.1s ease-in-out;
    
    &:hover {
        background-color: #8EA4D2;
        cursor: pointer;
    }
`

export default LinkButton