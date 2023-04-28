import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = ({numUsers}) => {
    const [formData, setFormData] = useState({fname: "", lname: "", email: "", password: "", users:numUsers })
    const navigate = useNavigate();
    const [error, setError] = useState();

    const handleOnChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value })
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        fetch("/api/signup",
        {method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData: formData }),
        })
          .then(res => res.json())
          .then(data => {
            if(data.status === 200){
                navigate(`/login`)
            } else {
                setError(data.message)
            }
            })
          .catch(err => console.log(err))
    }

  return (
    <div>
        <form onSubmit={handleOnSubmit}>
            <h2>SignUp Now!</h2>
            <div>
                <label htmlFor='company'>Company Name:</label>
                <input name='company' type="text" id="company" onChange={handleOnChange} required />
            </div>
            <div>
                <label htmlFor='fname'>First Name:</label>
                <input name='fname' type="text" id="fname" onChange={handleOnChange} required/>
            </div>
            <div>
                <label htmlFor='lname'>Last Name:</label>
                <input name='lname' type="text" id="lname" onChange={handleOnChange} required/>
            </div>
            <div>
                <label htmlFor='email'>Email:</label>
                <input name='email' type="email" id="email" onChange={handleOnChange} required/>
            </div>
            <div>
                <label htmlFor='password'>Password:</label>
                <input name='password' type="password" id="password" onChange={handleOnChange} required/>
            </div>
            <button type='submit'>SignUp</button>

        </form>
        {error ? <div> {error} </div> : null}
        </div>
  )
}

export default SignUp