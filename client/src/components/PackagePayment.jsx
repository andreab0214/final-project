import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import SignUp from './SignUp';


const PackagePayment = () => {

const [users, setUsers] = useState([])
const location = useLocation();
//get data about package chosen from /packages
const {data} = location.state;


console.log(data)
const handleChange = (e) => {
   setFormData({ ...formData, [e.target.name]: e.target.value})
}

if(!data){
  return <div>...Loading</div>
}

  return (
    <div>
      
        <div>
            <p>{data.name} </p>
            <p>Number of users: {data.quantity} </p>
            <p>Price: {data.price} </p>
            <p>Taxes : 15% </p>
            <p>Total Price: {data.price * 1.15} </p>
        </div>
        <SignUp numUsers={data.quantity}/>
    </div>
  )
}

export default PackagePayment