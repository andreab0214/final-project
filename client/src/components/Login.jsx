import {useState, useContext, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './UserContext';

const Login = () => {
    const [formData, setFormData] = useState({email: "", password:""});
    const [error, setError] = useState()
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    };

    useEffect(() => {
      if(currentUser && currentUser.role !== "user"){
        navigate(`/dashboard`)
      }else if (currentUser) {
        navigate(`/dashboard/${currentUser.name}`)
      }
    }, [currentUser])

    const handleOnSubmit = (e) => {
        e.preventDefault()
          fetch("/api/login", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ formData: formData }),
          })
        .then(res => res.json())
        .then(data => {
            if(data.status === 200){
               setCurrentUser(data.data)
            } else {
                console.log(data)
                setError(data.message);
            }
        })
        .catch(err => console.log(err))
        }
        

  return (
    <div>
<h2>Login</h2>
<form onSubmit={handleOnSubmit}>
    <div>
    <label htmlFor='email'>Email:</label>
    <input name='email' type='email' id='email' onChange={handleOnChange} required/>
    </div>
    <div>
    <label htmlFor='password'>Password:</label>
    <input name='password' type='password' id='password' onChange={handleOnChange} required/>
    </div>
    <button type='submit'>Login</button>
</form>
{error ? <div>{error}</div> : null }
    </div>
    
  )
}

export default Login