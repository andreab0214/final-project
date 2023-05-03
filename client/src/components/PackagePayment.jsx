import { useLocation, useNavigate } from 'react-router-dom'
import SignUp from './SignUp';
import styled from 'styled-components';


const PackagePayment = () => {

const location = useLocation();
//get data about package chosen from /packages
const {data} = location.state;

if(!data){
  return <div>...Loading</div>
}

  return (
    <Container>
      <InfoContainer>
            <h2>{data.name} </h2>
            <p>Number of users: {data.quantity} </p>
            <p>Price: {data.price} </p>
            <p>Taxes : 15% </p>
            <p>Total Price: ${data.price * 1.15} </p>
            </InfoContainer>
        <SignUp numUsers={data.quantity}/>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
  gap: 3rem;
 padding: 3rem;
 
  h2 {
    font-size: 1.5rem;
  }

`

const InfoContainer = styled.div`
  border-right: 1px solid lightgrey;
  padding-right: 2rem;
  display: flex;
  flex-direction:column;
  gap:1rem;
  align-items:center;
`

export default PackagePayment