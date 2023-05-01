import {useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom'
import JobCard from './JobCard'
import styled from 'styled-components'
import { UserContext } from './UserContext'

const ApprovedJobs = () => {
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const {userName} = useParams()
    const [user, setUser] = useState()

    useEffect(()=> {
        fetch(`/api/user/${userName}`)
        .then(res => res.json())
        .then(data => {
            setUser(data.data)
        })
        .catch(err => console.log(err))
    },[])

    if(!user){
        return <div>...Loading</div>
    }

  return (
    <div>
        <h3>Approved Jobs:</h3>
       {user.jobs.length > 0 ?
        <JobContainer>
        {user.jobs.map((job) => {
            if(job.approved){
                return <JobCard job={job} userName={userName} key={job._id} />
            }
        })}</JobContainer> : <P>No Jobs Approved</P>}
        
    </div>
  )
}

const JobContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
`

const P = styled.p`
    margin-top: 2rem;
`

export default ApprovedJobs