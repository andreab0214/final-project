import { Link } from 'react-router-dom';
import styled from 'styled-components'
import {COLORS} from '../../constants/COLORS'

const LinkButton = ({url, state, children}) => {
    
  return <StyledLink to={url} state={state}>{children} </StyledLink>
  
}

const StyledLink = styled(Link)`
    all: unset;
    background-color: ${COLORS.linkBackground};
    padding: .6rem 1rem;
    text-align: center;
    width: 10rem;
    border-radius: 2px;
    transition: all 0.1s ease-in-out;
    
    &:hover {
      background-color: ${COLORS.hoverBackground};
      color: ${COLORS.hoverColor};
        cursor: pointer;
    }
`

export default LinkButton