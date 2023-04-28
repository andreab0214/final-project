import {useState, useContext} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

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
                element.answer = e.target.value
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
    <div>
    <h2>{formData.formName} </h2>
    <form onSubmit={handleOnSubmit} >
    {formData?.elements.map((element,i)=>{
        return (
            <fieldset key={i} disabled={currentUser.role !== "user" || formData.isAnswered ? true : false}>
                <label htmlFor={element.label}>{element.question} </label>
                <input type={element.type} name={element.label} id={element.id} onChange={handleOnChange} required  defaultValue={formData.isAnswered ? element.answer : ""}/>
            </fieldset>
        )
    })}
    <button type='submit' disabled={currentUser.role !== "user" || formData.isAnswered ? true : false}>Submit Form</button>
    </form>
   
    </div>
  )
}

export default DisplayForm