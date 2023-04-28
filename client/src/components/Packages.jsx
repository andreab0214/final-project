import React from 'react'
import PackageCard from './PackageCard'
import { BRONZE_PRICE, BRONZE_QUANTITY, SILVER_PRICE, SILVER_QUANTITY, GOLD_PRICE, GOLD_QUANTITY } from '../constants/packageConstants'

const Packages = () => {

  return (
    <div>
    <PackageCard name={"Bronze Package"} quantity={BRONZE_QUANTITY} price={BRONZE_PRICE} />
    <PackageCard name={"Silver Package"} quantity={SILVER_QUANTITY} price={SILVER_PRICE} />
    <PackageCard name={"Gold Package"} quantity={GOLD_QUANTITY} price={GOLD_PRICE} />
 </div>
  )
}

export default Packages