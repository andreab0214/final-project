import {useEffect, useState, useContext} from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserContext } from './UserContext';
import {COLORS} from "../constants/COLORS"
import { StyledButton } from './CreateJob';

const Dashboard = () => {
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [error, setError] = useState();
    const navigate = useNavigate();
    const [managerDeleted, setManagerDeleted] = useState(false) //state to track if manager is deleted

    //if manager is deleted re-render page
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
    })},[managerDeleted])

    const handleRemoveManager = (managerId) => {
        fetch(`/api/remove-manager/${managerId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            })
              .then(res => res.json())
              .then(data => {
                if(data.status === 200){
                    //if delete approved, update state
                    setManagerDeleted(!managerDeleted)
                } else if(data.status === 401){
                  setCurrentUser(null)
                    navigate("/login")
                }else {
                  setError(data.message)
                }
                })
              .catch(err => {
                setError(err.message)
            })
    }

   if(!currentUser){
    return <div>...Loading</div>
   }

    return (
        <div>
            {error ? <p>{error} </p> : 
            <Container>
                <H2>{`Hello, ${currentUser.fname? currentUser.fname : currentUser.name}`} </H2> 
                <P>My Users</P>
                <UserContainer>
                    {currentUser?.usersId.map((user) =>{
                        return (<RoundLink key={user._id} to={`/dashboard/${user.name}`} state={user} >
                            <p>{user.name}</p>
                        </RoundLink>)
                    })}
                </UserContainer>
                {currentUser.role === "admin" ? <> <P>My Managers</P>
                <ManagerContainer>
                {currentUser?.managers.length > 0 ? currentUser.managers.map((manager,i) => {
                    return (<ManageDiv key={i}>
                        <h3>{manager.name}</h3>
                        <p>{manager.email}</p>
                        <RemoveManagerButton onClick={()=> handleRemoveManager(manager._id)}>Remove Manager</RemoveManagerButton>
                    </ManageDiv> )
                }) : 
                <p>no managers added</p>}
                </ManagerContainer><AddManagerButton onClick={() => {navigate('/add-manager')}}>Add a Manager</AddManagerButton> </>: null}
                
                
                
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

const ManagerContainer = styled.div`
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
        h3{
            font-size: 1.2rem;
        }
        p{
            font-size: 1rem;
            font-style: italic;
            color: gray;
        }
`

const ManageDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 2px 2px 15px lightgray;
    padding: 1rem;
    border-radius: 5px;
`

const AddManagerButton = styled(StyledButton)`
    width: 10rem;
`
const RemoveManagerButton = styled(StyledButton)`
    background-color: ${COLORS.secondaryBackground}
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