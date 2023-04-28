
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'


const Homepage = () => {
  
  
      
  return (
    <div>
        <p>This is the homepage</p>
        <Link to={"/packages"}>Buy Account Now</Link>
    </div>
  )
}

export default Homepage