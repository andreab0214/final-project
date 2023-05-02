import React, { useEffect, useState,useContext } from 'react'
import { useNavigate, useParams,  } from 'react-router-dom'
import AddDrawing from './AddDrawing';
import AddNotes from './AddNotes';
import PdfDisplayer from './PdfDisplayer';
import DisplayForm from './DisplayForm';
import { UserContext } from './UserContext';
import ImageDisplay from './ImageDisplay';
import {COLORS} from "../constants/COLORS";
import styled from 'styled-components';

//TODO: ADD TIME FOR NOTES 

const JobDetails = () => {
    const {userName, jobId} = useParams();
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [jobDetails, setJobDetails] = useState()
    const [errors, setErrors] = useState(null)
    const [isShow, setIsShow] = useState(false)
    const [jobApproval, setJobApproval] = useState(false)
    const [addedDrawings, setAddedDrawings] = useState(false)
    const [markCompleted, setMarkCompleted]= useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        //retrieve job information 
        fetch(`/api/jobDetails/${userName}/${jobId}`)
        .then(res => res.json())
        .then(data => {
            if(data.status === 200){
                setJobDetails(data.data)
            }
            else if(data.status === 401){
                navigate('/login')
            } else{
                setErrors(data.message)
            }
        })
        .catch(err => setErrors(err))
    },[addedDrawings])

    const handleShowDrawings = () => {
        setIsShow(!isShow)
    }

    if(!jobDetails){
        return <div>...Loading</div>
    }

const handleJobApproval = (e) => {
    setJobApproval(true)
    e.preventDefault()
    fetch(`/api/jobs/approval/${userName}/${jobId}`,
    {method: "PATCH",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobApproval: true }),
    })
.then(res => res.json())
.then(data => {
   if(data.status === 200){
    navigate(`/dashboard/${userName}`)
   }
})
.catch(err => setErrors(err))
}

const handleJobCompleted = (e) => {
    setMarkCompleted(true)
    e.preventDefault()
    fetch(`/api/jobs/completed/${userName}/${jobId}`,
    {method: "PATCH",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobCompleted: true }),
    })
.then(res => res.json())
.then(data => {
   setMarkCompleted(true)
})
.catch(err => setErrors(err))
}


  return (
    <Container>
<H2>Job Details:</H2>

<p> Type: <Bold>{jobDetails.type}</Bold></p>
<p>Job Id: <Bold>{jobDetails.jobId}</Bold></p>
<p>Client: <Bold>{jobDetails.client}</Bold></p>
<p>Address: <Bold>{jobDetails.address}</Bold> </p>

<StyledButton onClick={handleShowDrawings}>Show Drawings</StyledButton>
{isShow ? jobDetails.drawings.length > 0 ? 
    jobDetails.drawings.map((drawing) => {
        if(drawing.format === "pdf"){
            return <PdfDisplayer pdfUrl={drawing.url} key={drawing.public_id}/>
        }
       return <ImageDisplay publicId={drawing.public_id}key={drawing.public_id} />
    }) 
    : <p>No drawings attached</p>
 : null }
<AddDrawing setAddedDrawings={setAddedDrawings} />
 <p>Forms:</p>
 {jobDetails.forms.length > 0 ?
    jobDetails.forms.map((form)=>{
        return <DisplayForm key={form._id} form={form} />
    })
 : null}
 <p>Notes:</p>
 
 {jobDetails.notes.length > 0 ? 
 jobDetails.notes.map((note, i) => {
    return <NoteContainer key={i}>
        <p>{note.note}</p>
        <ByTimeContainer>
        <p>By: {note.by}</p>
        <p>{note.timestamp}</p>
        </ByTimeContainer>
        
        </NoteContainer>
 })
 : null}
 <AddNotes setJobDetails={setJobDetails} />
 {/* if currentUser is a "user" allow them click on the "job Completed" button. if the job is already completed, disable it */}
 {currentUser?.role === "user" ? <ImportantButton onClick={handleJobCompleted} disabled={jobDetails.completed || markCompleted}>Mark Job as Completed</ImportantButton> : null}

 {/* if currentUser is "admin/manager" allow them click on the "Approve Job" button. if the job is already approved, disable it */}
 {currentUser?.role === "user" ? null : !jobDetails.approved ? <ImportantButton onClick={handleJobApproval} disabled={jobDetails.approved || jobApproval}>Approve this Job</ImportantButton> : <p>Approved: Yes </p>  }

{errors ? <p>{errors}</p> : null}
    </Container>

  )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 3rem;
`
const H2 = styled.h2`
    font-size: 1.5rem;
`
const Bold = styled.span`
    font-weight: bold;
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

const NoteContainer = styled.div`
    box-shadow: 2px 2px 15px lightgray;
    padding: 1rem;
    border-radius: 5px;
    text-align: left;
       
`

const ByTimeContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    
     p{
            font-size: 0.9rem;
            font-style: italic;
            color: gray;
            margin-right: 1rem;
        }
`

const ImportantButton = styled.button`
    font-size: 1rem;
    padding: .8rem;
    font-weight: bold;
    margin-top: 2rem;
    border: none;
    border-radius: 3px;
    background-color: ${COLORS.importantBackground};
        &:hover{
            background-color: ${COLORS.hoverBackground};
            color: ${COLORS.hoverColor};
            cursor: pointer;
        }
`


export default JobDetails