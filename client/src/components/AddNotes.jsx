import React, { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AddNotes = ({setJobDetails}) => {
    const [notes, setNotes] = useState()
    const [error, setError] = useState()
    const {userName, jobId} = useParams();
    const navigate = useNavigate()

    const handleOnChange = (e) => {
        setNotes(e.target.value)
    }

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
        fetch(`/api/jobDetails/${userName}/${jobId}`)
        .then(res => res.json())
        .then(data => {
            if(data.status === 200){
                setJobDetails(data.data)
                setNotes("")
            }
            else if(data.status === 401){
                navigate('/login')
           } else if (data.status === 400){
               setError(data.message)
           }
        })
        .catch(err => console.log(err))
    }
    else if(data.status === 401){
        navigate('/login')
    } else{
        console.log(data.message)
        //setErrors(data.message)
    }
})
.catch(err => console.log(err))
    }

    return (
        <>
       
        <form onSubmit={handleOnSubmit}>
        <div>
                <label htmlFor='notes'>Additional Info:</label>
                <textarea name='notes' type="text" id='notes' onChange={handleOnChange} value={notes}/>
            </div>
            <button type='submit'>Add Note</button>
            </form> 
            {error ? <p>{error}</p> : null}
            </>
    )
}

export default AddNotes