import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {COLORS} from "../constants/COLORS"

const SignUp = ({numUsers}) => {
    const [formData, setFormData] = useState({fname: "", lname: "", email: "", password: "", users:numUsers, creditCard: "", expiry: "" })
    const navigate = useNavigate();
    const [error, setError] = useState();

    const handleOnChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value })
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        fetch("/api/signup",
        {method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData: formData }),
        })
          .then(res => res.json())
          .then(data => {
            if(data.status === 200){
                navigate(`/login`)
            } else {
                setError(data.message)
            }
            })
          .catch(err => console.log(err))
    }

  return (
    <div>
        <Form onSubmit={handleOnSubmit}>
            <LabelDiv>
                <label htmlFor='company'>Company Name:</label>
                <StyledInput name='company' type="text" id="company" onChange={handleOnChange} required />
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='fname'>First Name:</label>
                <StyledInput name='fname' type="text" id="fname" onChange={handleOnChange} required/>
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='lname'>Last Name:</label>
                <StyledInput name='lname' type="text" id="lname" onChange={handleOnChange} required/>
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='email'>Email:</label>
                <StyledInput name='email' type="email" id="email" onChange={handleOnChange} required/>
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='password'>Password:</label>
                <StyledInput name='password' type="password" id="password" onChange={handleOnChange} required/>
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='creditCard'>Credit Card Number:</label>
                <StyledInput name='creditCard' type="text" id="creditCard" placeholder='XXXX XXXX XXXX XXXX' onChange={handleOnChange} required/>
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='expiry'>Expiry:</label>
                <StyledInput name='expiry' type="text" id="expiry" placeholder='MMYY' onChange={handleOnChange} required/>
            </LabelDiv>
            <StyledButton type='submit'>Purchase Now</StyledButton>

        </Form>
        {error ? <div> {error} </div> : null}
        </div>
  )
}

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

export default SignUp