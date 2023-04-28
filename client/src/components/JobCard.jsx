import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const JobCard = ({job, userName}) => {
  return (
    <JobLink key={job._id} to={`/jobs/${userName}/${job.jobId}`} iscompleted={job.completed.toString()} isapproved={job.approved.toString()} >
                       
    <p>Job Id: {job.jobId} </p>
    <p>Type: {job.type} </p>
    <p>Client: {job.client} </p>
    <p>Completed: {job.completed ? "yes" : "no"} </p>
   
</JobLink>
  )
}


const JobLink = styled(Link)`
    all: unset;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 1rem;
  
    background-color: ${props => {
        if(props.isapproved === "true"){
            return "white"
        } else if (props.iscompleted === "true"){
            return "lightgreen"
        } else {
            return "lightblue"
        }
    }};
   
    width: 25vw;
    height: 8rem;
    box-shadow: 2px 2px 15px lightgray;
    transition: all 0.1s ease-in-out;

    p {
        margin-left: 1rem;
    }

    &:hover {
        cursor: pointer;
        transform: scale(1.06);
    }

`

export default JobCard