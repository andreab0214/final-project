import {useState, useContext} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { StyledButton } from './CreateJob';
import {COLORS} from "../constants/COLORS";
import styled from 'styled-components';

const DisplayForm = ({form}) => {
    const [formData, setFormData] = useState(form)
    const [error, setError] = useState()
    const {userName, jobId} = useParams();
    const navigate = useNavigate()
    const {currentUser, setCurrentUser} = useContext(UserContext);

    const handleOnChange = (e) => {
        const updatedElements = [...formData.elements]
        updatedElements.map((element) => {
            if(element.label === e.target.name) {
                return element.answer = e.target.value
            }
        })
  
        setFormData({...formData, elements: updatedElements})
    }

    const handleOnSubmit =  (e) => {
        setFormData({...formData, isAnswered: true})
        e.preventDefault()
        fetch(`/api/jobs/answerForm/${userName}/${jobId}`,
            {
                method: "PATCH", 
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
            },
            body: JSON.stringify({ formData: formData }),
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === 401){
                     navigate('/login')
                } else if (data.status === 400){
                    setError(data.message)
                }
                })
                .catch(err => console.log(err))
                    }
    
            return (
    <FormContainer>
    <H2>{formData.formName} </H2>
    <Form onSubmit={handleOnSubmit} >
    {formData?.elements.map((element,i)=>{
        return (
            <LabelDiv key={i} >
                <label htmlFor={element.label}>{element.question} </label>
                <StyledInput type={element.type} name={element.label} id={element.id} onChange={handleOnChange} required  defaultValue={formData.isAnswered ? element.answer : ""} disabled={currentUser?.role !== "user" || formData.isAnswered ? true : false}/>
            </LabelDiv>
        )
    })}
    <StyledButton type='submit' disabled={currentUser.role !== "user" || formData.isAnswered ? true : false}>Submit Form</StyledButton>
    </Form>
   
    </FormContainer>
  )
}

const FormContainer = styled.div`
    box-shadow: 2px 2px 15px lightgray;
    padding: 1rem;
    border-radius: 5px;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.8rem;
    margin-top:1rem;
    label{
        text-align: right;
    }
`
const H2 = styled.h2`
    text-align: center;
    font-size: 1.2rem;
`

const LabelDiv = styled.fieldset`
    display:flex;
    justify-content: space-between;
    align-items: center;
`

const StyledInput = styled.input`
    all: unset;
    border: 1px solid lightgrey;
    border-radius: 5px;
    box-sizing: border-box;
    padding: .5rem;
    margin-left: .5rem;
    width: 20rem;
    background-color: ${(props)=> props.disabled ? "#e8e8e860" : "white"}
`

export default DisplayForm