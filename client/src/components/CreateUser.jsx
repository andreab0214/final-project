import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const CreateUser = ({userId, setCreateUser, setMyUser}) => {
//adds user to mongoDB 

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({name: "", email: "", password: ""})
  

const handleOnChange = (e) => {
  setFormData({...formData, [e.target.name]: e.target.value})
 }

 const handleOnSubmit = (e) => {
  e.preventDefault()
  fetch(`/api/create-user/${userId}`, {
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
              console.log(data)
              setMyUser(data.data)
              setCreateUser(false)
              navigate(`/dashboard/${myUser?.name}`)
          } if(data.status === 401){
              navigate("/login")
          }else {
              console.log(data)
          }
          })
        .catch(err => console.log(err))
 }

  return (
    <div>
            <p>Please create your user</p>
            <form onSubmit={handleOnSubmit}>
                <div>
                    <label htmlFor='name'>Username:</label>
                    <input name='name' type="text" id='name' onChange={handleOnChange}/>
                </div>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input name='email' type="email" id='email'onChange={handleOnChange}/>
                </div>
                <div>
                    <label htmlFor='password'>Users Password:</label>
                    <input name='password' type="password" id='password'onChange={handleOnChange}/>
                </div>
                <button type='submit'>Create User</button>
            </form>
        </div>
  )
}

export default CreateUser