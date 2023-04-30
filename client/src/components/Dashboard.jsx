import {useEffect, useState, useContext} from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserContext } from './UserContext';

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
            <div>
                <h2>{`Hello, ${currentUser.fname}`} </h2> 
                <p>My Users</p>
                <UserContainer>
                    {currentUser.usersId.map((user) =>{
                        return (<RoundLink key={user._id} to={`/dashboard/${user.name}`} state={user}>
                            <p>{user.name}</p>
                        </RoundLink>)
                    })}
                </UserContainer>
            </div>
            }
        </div>
    )
}
const UserContainer = styled.div`
    display: flex;
    gap: 4rem;
    flex-wrap: wrap;
    margin-top: 3rem;
`

const RoundLink = styled(Link)`
all: unset;
    background-color: #A44200;
    height: 10rem;
    width: 10rem;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
        font-size: 1.5rem;
        color: #DDBEA8;
    }

    :hover{
        cursor: pointer;
        opacity: 0.8;
    }
`

export default Dashboard