import {useEffect, useState, useContext} from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserContext } from './UserContext';
import {COLORS} from "../constants/COLORS"

const Dashboard = () => {
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [error, setError] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/user`)
        .then(res => {
            return res.json()})
        .then(data => {
            if(data.status === 200) {
                setCurrentUser(data.data)
            } else if(data.status === 401){
                setCurrentUser(null)
                navigate("/login")
            } else { 
                setError(data.message)
            }

        })
        .catch(err => {
            setError(err.message)
    })},[])

   if(!currentUser){
    return <div>...Loading</div>
   }

    return (
        <div>
            {error ? <p>{error} </p> : 
            <Container>
                <H2>{`Hello, ${currentUser.fname}`} </H2> 
                <P>My Users</P>
                <UserContainer>
                    {currentUser.usersId.map((user) =>{
                        return (<RoundLink key={user._id} to={`/dashboard/${user.name}`} state={user} >
                            <p>{user.name}</p>
                        </RoundLink>)
                    })}
                </UserContainer>
            </Container>
            }
        </div>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    
`

const P = styled.p`
    font-style: italic;
    font-size: 1.5rem;
`

const UserContainer = styled.div`
    display: flex;
    gap: 4rem;
    flex-wrap: wrap;
`

const H2 = styled.h2`
    font-size: 1.5rem;
`

const RoundLink = styled(Link)`
    all: unset;
    background-color: ${COLORS.linkBackground};
    height: 12rem;
    width: 12rem;
    box-sizing: border-box;
    padding: 1rem;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    p {
        font-size: 1.5rem;
        
    }

    &:hover{
        cursor: pointer;
        background-color: ${COLORS.hoverBackground};
        color: ${COLORS.hoverColor};
    }
`

export default Dashboard