
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS } from '../constants/COLORS';

const PackageCard = ({name, quantity, price}) => {
  const packageData = {name: name, quantity: quantity, price: price}

  return (
    <Container>
        <h2>{name}</h2>
        <span>this package includes...</span>
        <p>Number of users: {quantity}</p>
        <p>{`Price: $${price}/month`} </p>
        
        <StyledLink to={`/purchase/${name}`} state={{data: packageData}}>Buy Now</StyledLink>
        
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 0 3px 10px lightgrey;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
  }

  span {
    font-style: italic;
  }

`

const StyledLink = styled(Link)`
  all: unset;
  background-color: ${COLORS.linkBackground};
  padding: .5rem 2rem;
  border-radius: 3px;
    &:hover {
      background-color: ${COLORS.hoverBackground};
      color: ${COLORS.hoverColor};
      cursor: pointer;
    }
`

export default PackageCard