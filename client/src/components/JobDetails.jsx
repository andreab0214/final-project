import React, { useEffect, useState,useContext } from 'react'
import { useNavigate, useParams,  } from 'react-router-dom'
import AddDrawing from './AddDrawing';
import AddNotes from './AddNotes';
import PdfDisplayer from './PdfDisplayer';
import DisplayForm from './DisplayForm';
import { UserContext } from './UserContext';
import ImageDisplay from './ImageDisplay';


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
        .catch(err => console.log(err))
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
    
   }
})
.catch(err => console.log(err))
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
.catch(err => console.log(err))
}


  return (
    <div>
<p>Job Details:</p>

<p> Type: {jobDetails.type} </p>
<p>Job Id: {jobDetails.jobId} </p>
<p>Client: {jobDetails.client} </p>
<p>Address: {jobDetails.address} </p>

<button onClick={handleShowDrawings}>Show Drawings</button>
{isShow ? jobDetails.drawings.length > 0 ? 
    jobDetails.drawings.map((drawing) => {
        if(drawing.format === "pdf"){
            return <PdfDisplayer pdfUrl={drawing.url}/>
        }
       return <ImageDisplay publicId={drawing.public_id} />
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
    
    return <p key={i}>{note} </p>
 })
 : null}
 <AddNotes setJobDetails={setJobDetails} />
 {/* if currentUser is a "user" allow them click on the "job Completed" button. if the job is already completed, disable it */}
 {currentUser?.role === "user" ? <button onClick={handleJobCompleted} disabled={jobDetails.completed || markCompleted}>Mark Job as Completed</button> : null}

 {/* if currentUser is "admin/manager" allow them click on the "Approve Job" button. if the job is already approved, disable it */}
 {currentUser?.role === "user" ? null : !jobDetails.approved ? <button onClick={handleJobApproval} disabled={jobDetails.approved || jobApproval}>Approve this Job</button> : <p>Approved: Yes </p>  }

{errors ? <p>{errors}</p> : null}
    </div>

  )
}

export default JobDetails