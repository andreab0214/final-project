import {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { COLORS } from '../constants/COLORS';
import styled from 'styled-components';

const CreateUser = ({userId, setCreateUser, myUser,setMyUser}) => {
//adds user to mongoDB 
    const navigate = useNavigate();
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [formData, setFormData] = useState({name: "", email: "", password: ""})
    const [error, setError] = useState()

    //navigate the user to their dashboard once the myUser state has changed from POST
    useEffect(() => {
        if(myUser ){
          navigate(`/dashboard/${myUser.name}`)}
      }, [myUser])

const handleOnChange = (e) => {
  setFormData({...formData, [e.target.name]: e.target.value})
 }

 const handleOnSubmit = (e) => {
  e.preventDefault()
  fetch(`/api/create-user/${userId}`, {
      method: "POST",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData: formData }),
      })
        .then(res => res.json())
        .then(data => {
          if(data.status === 200){
              setMyUser(data.data)
              setCreateUser(false)
          } if(data.status === 401){
            setCurrentUser(null)
              navigate("/login")
          }else {
            setError(data.message)
          }
          })
        .catch(err => setError(data.message))
 }

  return (
    <Div>
            <p>Please create your user</p>
            <Form onSubmit={handleOnSubmit}>
                <LabelDiv>
                    <label htmlFor='name'>Username:</label>
                    <StyledInput name='name' type="text" id='name' onChange={handleOnChange}/>
                </LabelDiv>
                <LabelDiv>
                    <label htmlFor='email'>Email:</label>
                    <StyledInput name='email' type="email" id='email'onChange={handleOnChange}/>
                </LabelDiv>
                <LabelDiv>
                    <label htmlFor='password'>Users Password:</label>
                    <StyledInput name='password' type="password" id='password'onChange={handleOnChange}/>
                </LabelDiv>
                <StyledButton type='submit'>Create User</StyledButton>
            </Form>
            {error? <p>{error}</p> : null}
        </Div>
  )
}

const Div = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

    p{
        font-size: 1.5rem;
    }
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    div{
        display: flex;
        align-items: center;
    }

    label{
        text-align: right;
    }
   
`

const LabelDiv = styled.div`
    display:flex;
    justify-content: space-between;
`

const StyledInput = styled.input`
    all: unset;
    border: 1px solid lightgrey;
    border-radius: 5px;
    box-sizing: border-box;
    padding: .5rem;
    margin-left: .5rem;
    width: 20rem;
`
const StyledButton = styled.button`
    font-size: 1rem;
    padding: .5rem;
    border: none;
    border-radius: 3px;
    background-color: ${COLORS.linkBackground};
        &:hover{
            background-color: ${COLORS.hoverBackground};
            color: ${COLORS.hoverColor};
            cursor: pointer;
        }
    
`

export default CreateUser