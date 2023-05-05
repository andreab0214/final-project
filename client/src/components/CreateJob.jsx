import React, { useState,useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from './UserContext';
import {COLORS} from "../constants/COLORS";
import styled from 'styled-components';

const CreateJob = () => {
    const location = useLocation();
    const myUser = location.state;  //get myUser info from previous state 
    const navigate = useNavigate()
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [templates, setTemplates] = useState(); //state to store templates fetched from database
    const [errors, setErrors] = useState(null);
    const [formData, setFormData] = useState(
        {
            type: "",
            jobId: "",
            clientName: "",
            address: "",
            drawings: [],
            forms: [],
            notes: [],
        }
    );
    

    //fetch form templates from database and store them in state
    useEffect(() => {
        fetch('/api/templates')
        .then(res => res.json())
        .then(data => {
            if(data.status === 200){
                setTemplates(data.data)
            } else {
                setErrors(data.message)
            }
        })
        .catch(err => setErrors(err.message))
    },[])


        //upload files and transform them
    const handleDrawingUpload = (e) => {
        const files = e.target.files;
        transformFile(files)
        
    }
    //transform image url into base64
    const transformFile = (files) => {
        const tempFileArray = []
       for (let i = 0; i < files.length; i++){
           const file = files[i]
           const reader = new FileReader();
           reader.readAsDataURL(file);
           reader.onloadend = () => {
            tempFileArray.push(reader.result)
        setFormData({...formData, drawings: tempFileArray})
        }
          
       }
    }

    const handleOnChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    //create a note object  
    const handleNotes = (e) => {
        if(e.target.value !== ""){
            const newNote = {
                note: e.target.value,
                by: currentUser.fname,
            }
            setFormData({...formData, notes: newNote})
        }
        
    }

        //if form is checked, add it to form data, if it is unchecked, remove the form
    const handleForms = (e) => {
        const formName = e.target.name;
        const isChecked = e.target.checked;

        //find form data in templates 
       const form = templates.find((template) => template.formName === formName)

       //copy of formData form
       const copyFormData = [...formData.forms]
        
       if(isChecked){
        //add form to forms data
        copyFormData.push(form)
       } else {
        //remove form from forms data
        const formIndex = copyFormData.findIndex((f) => f.formName === formName)
        if(formIndex !== -1){
            copyFormData.splice(formIndex, 1)
        }
       }
        
        setFormData({...formData, forms: copyFormData})
    }
   
    //add job to user 
    const handleOnSubmit = (e) => {
        e.preventDefault()
        fetch(`/api/create-job/${myUser._id}`,{
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ formData: formData }),
            })
        .then(res => res.json())
        .then(data => {
            //if approved, navigate to that users profile
            if(data.status === 200){
                navigate(`/dashboard/${myUser.name}`)
            }
            else if(data.status === 401){
                navigate("/login")
            }else{
                setErrors(data.message)
            }
        })
        .catch(err => setErrors(data.message))
    }

    if(!templates){
        return <div>...Loading</div>
    }

  return (
    <div>
        {/* only allow users with admin or manager roles */}
    {currentUser.role !== "user" ? 
    <div>
        
        <h2>Create New Job</h2>
        <Form onSubmit={handleOnSubmit}>
        
        <LabelDiv>
                <label htmlFor='service'>Service</label>
                <input name='type' type='radio' id='service' value='Service' onChange={handleOnChange} />
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='installation'>Installation</label>
                <input name='type' type='radio' id='installation' value='Installation' onChange={handleOnChange} />
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='removal'>Removal</label>
                <input name='type' type='radio' id='removal' value='removal' onChange={handleOnChange} />
            </LabelDiv>
            
            <LabelDiv>
                <label htmlFor='jobId'>Job ID:</label>
                <StyledInput name='jobId' type='text' id='jobId' onChange={handleOnChange} required/>
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='clientName'>Client:</label>
                <StyledInput name='clientName' type='text' id='clientName' onChange={handleOnChange} />
            </LabelDiv>
            <LabelDiv>
                <label htmlFor='address'>Address:</label>
                <StyledInput name='address' type="address" id='address' onChange={handleOnChange} />
            </LabelDiv>
            <LabelAreaDiv>
                <label htmlFor='notes'>Additional Info:</label>
                <StyledTextArea name='notes' type="text" id='notes' onChange={handleNotes}/>
            </LabelAreaDiv>
            <LabelDiv>
                <label htmlFor='drawings'>Drawings:</label>
                <FileInput name='drawings' type="file" accept='image/' multiple="multiple" onChange={handleDrawingUpload}/>
                
            </LabelDiv>
            <p>Add Forms:</p>
            {templates.map((template) => {
                return <div key={template._id}>
                    <input type='checkbox' name={template.formName} id={`${template.formName}`} onChange={handleForms} />
                    <label htmlFor={`${template.formName}`}> {template.formName} </label>
                     </div>
            }) }
           <StyledButton type='submit'>Create Job</StyledButton>
        </Form>
        {errors ? <div>
            <p>{errors} </p>
        </div> : null }
    </div>
    : <p>You do not have permission for this</p>}
    </div>
  )
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 40vw;
    gap: 0.5rem;
    margin-top: 1rem;
    label{
        text-align: right;
    }
   
`

const LabelDiv = styled.div`
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
`

const LabelAreaDiv = styled.div`
    display:flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .7rem;
`

const StyledTextArea = styled.textarea`
    all: unset;
    font-size: 1rem;
    border: 1px solid lightgrey;
    border-radius: 5px;
    box-sizing: border-box;
    padding: .5rem;
    width: 100%;
`

const FileInput = styled.input.attrs({type: 'file'})`
margin-left: .5rem;
padding: .5rem;
  &::-webkit-file-upload-button {
    all:unset;
    background-color: ${COLORS.secondaryBackground};
    padding: 1em;
    border-radius: 3px;
    margin-right: 1rem;
        &:hover{
            cursor: pointer;
            background-color: ${COLORS.hoverBackground};
            color: ${COLORS.hoverColor};
        }
    
  }
 
`

export const StyledButton = styled.button`
    font-size: 1rem;
    padding: .7rem;
    border: none;
    border-radius: 3px;
    background-color: ${COLORS.linkBackground};
        &:hover{
            background-color: ${COLORS.hoverBackground};
            color: ${COLORS.hoverColor};
            cursor: pointer;
        }
`

export default CreateJob