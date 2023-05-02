import {useState, useContext, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { COLORS } from '../constants/COLORS';
import { StyledButton } from './CreateJob';
import styled from 'styled-components';

const Login = () => {
    const [formData, setFormData] = useState({email: "", password:""});
    const [error, setError] = useState()
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    };

    useEffect(() => {
      if(currentUser && currentUser.role !== "user"){
        navigate(`/dashboard`)
      }else if (currentUser) {
        navigate(`/dashboard/${currentUser.name}`)
      }
    }, [currentUser])

    const handleOnSubmit = (e) => {
        e.preventDefault()
          fetch("/api/login", {
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
               setCurrentUser(data.data)
            } else {
                console.log(data)
                setError(data.message);
            }
        })
        .catch(err => console.log(err))
        }
        

  return (
    <Div>
<h2>Login</h2>
<Form onSubmit={handleOnSubmit}>
    <LabelDiv>
    <label htmlFor='email'>Email:</label>
    <StyledInput name='email' type='email' id='email' onChange={handleOnChange} required/>
    </LabelDiv>
    <LabelDiv>
    <label htmlFor='password'>Password:</label>
    <StyledInput name='password' type='password' id='password' onChange={handleOnChange} required/>
    </LabelDiv>
    <StyledButton type='submit'>Login</StyledButton>
</Form>
{error ? <div>{error}</div> : null }
    </Div>
    
  )
}

const Div = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
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


export default Login