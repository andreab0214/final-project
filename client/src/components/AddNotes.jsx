import React, { useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import styled from 'styled-components';
import {StyledButton} from "./CreateJob"

const AddNotes = ({setJobDetails}) => {
    const [notes, setNotes] = useState() //state to store note
    const [noteDisplay, setNoteDisplay] = useState() //state to store what to display in input defaultValue
    const [error, setError] = useState()
    const {userName, jobId} = useParams();
    const navigate = useNavigate();
    const {currentUser, setCurrentUser} = useContext(UserContext);

    //update the note state with the value of the note and what user wrote it
    //change the state of noteDisplay to the value entered 
    const handleOnChange = (e) => {
        const newNote = {
            note: e.target.value,
            by: currentUser.fname ? currentUser.fname : currentUser.name  ,
        }
        setNotes(newNote)
        setNoteDisplay(e.target.value)
    }

        //add note to job
    const handleOnSubmit = (e) => {
        e.preventDefault()
        fetch(`/api/jobs/addNote/${userName}/${jobId}`,
    {method: "PATCH",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes: notes }),
    })
.then(res => res.json())
.then(data => {
    if(data.status === 200){
        //fetch again to update the screen with new note
        fetch(`/api/jobDetails/${userName}/${jobId}`)
        .then(res => res.json())
        .then(data => {
            if(data.status === 200){
                setJobDetails(data.data)
                setNoteDisplay("")
            }
            else if(data.status === 401){
                navigate('/login')
           } else if (data.status === 400){
               setError(data.message)
           }
        })
        .catch(err => setError(err))
    }
    else if(data.status === 401){
        navigate('/login')
    } else{
        setError(data.message)
    }
})
.catch(err => setError(err))
    }

    return (
        <>
       
        <form onSubmit={handleOnSubmit}>
        <LabelTextContainer>
                <label htmlFor='notes'>Additional Info:</label>
                <StyledTextArea name='notes' type="text" id='notes' onChange={handleOnChange} value={noteDisplay}/>
            </LabelTextContainer>
            <StyledButton type='submit'>Add Note</StyledButton>
            </form> 
            {error ? <p>{error}</p> : null}
            </>
    )
}

const LabelTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 0.8rem;
`

const StyledTextArea = styled.textarea`
    all: unset;
    font-size: 1rem;
    height: 6rem;
    border: 1px solid lightgrey;
    border-radius: 5px;
    box-sizing: border-box;
    padding: .5rem;
    width: 60vw;
`



export default AddNotes