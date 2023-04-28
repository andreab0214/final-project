
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './buttons/LoginButton';

const PackageCard = ({name, quantity, price}) => {

  const [isClicked, setIsClicked] = useState(false)
  const packageData = {name: name, quantity: quantity, price: price}

  

  return (
    <div>
        <h2>{name}</h2>
        <p>Number of users: {quantity}</p>
        <p>{`Price: $${price}/month`} </p>
        
        <Link to={`/purchase/${name}`} state={{data: packageData}}>Buy Now</Link>
        
    </div>
  )
}

export default PackageCard