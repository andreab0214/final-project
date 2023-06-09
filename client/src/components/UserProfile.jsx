import {useState, useEffect, useContext} from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import CreateUser from './CreateUser';
import { UserContext } from './UserContext';
import styled from 'styled-components';
import LinkButton from './buttons/LinkButton';
import JobCard from './JobCard';

const UserProfile = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const {userName} = useParams();
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true)
    const [myUser, setMyUser] = useState();
    const [errors, setErrors] = useState();
    const user = location.state
    //tracking if its the first time admin creates their users. if it is, let them create the users account. if not, display user info
    const [createUser, setCreateUser] = useState(false)

    useEffect(() => {
        fetch(`/api/user/${userName}`)
        .then(res => {
            return res.json()})
        .then(data => {
            if(data.status === 200) {
                //if user is found save it in myUser state
                setMyUser(data.data)
                setIsLoading(false)
            } else if(data.status === 400){
                //if user is not found, set createUser state to true so client can create the users profile
                setCreateUser(true)
                setIsLoading(false)
            } else if(data.status === 401){
                //if user is not authorized, send them to login
                setCurrentUser(null)
                navigate('/login')
            } 
             else {
                setIsLoading(false)
                setErrors(data.message)
               
            }
        })
        .catch(err => {
            console.log("error", err)})
    },[userName])

    if(isLoading){
        return <div>...Loading</div>
       }

  return (
    <div>
        {/* if no user found, create a user */}
        {createUser ? 
        <CreateUser userId={user?._id} setCreateUser={setCreateUser} myUser={myUser} setMyUser={setMyUser} />
        : 
       <div>
        <DivContainer>
        <h2>{myUser.name}</h2>
        <p>{myUser.email} </p>
        <LinkButton url={`/approvedJobs/${myUser.name}`}>Approved Jobs</LinkButton>
        
        {/* create a new Job only if logged in user is admin/manager */}
        {currentUser.role === "user" ? null : <LinkButton url='/createjob' state={myUser && myUser} >Create New Job</LinkButton>}

        <h3>Current Jobs:</h3>
        
        </DivContainer>
        
        <JobContainer>
            {myUser?.jobs.length > 0 ?
            myUser.jobs.map((job)=>{
                /* only display jobs that have not yet been approved */
                if(!job.approved){
                    return (
                        <JobCard job={job} userName={myUser.name} key={job._id}/>
                    )
                }
                
            })
            : <p>No jobs yet</p>}
            
        </JobContainer>
        {errors ? <p>{errors} </p> : null}
        </div>
    }
        
    </div>
  )
}

const DivContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .5rem;
    h2 {
        font-size:2rem;
        
    }
    p {
        margin-bottom: 1.5rem;
 
    }
    h3 {
        font-size: 1.3rem;
        margin-top: 1.5rem;
        margin-bottom: .5rem;
    }
`

const JobContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
`


export default UserProfile