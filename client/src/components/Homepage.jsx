
import constructionImg from "../assets/constructionImg.jpg"
import styled from 'styled-components'
import Packages from './Packages'


const Homepage = () => {
  
  return (
    <>
    <Img src={constructionImg}/>
    <Container>
          <H2>Welcome to onSite!</H2>
          <Para>Organize all your workers and site inspections in one place</Para>
          <p>Choose a package to get started</p>
          <Packages />
        
        {/* <Link to={"/packages"}>Buy Account Now</Link> */}
    </Container>
    </>
  )
}

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: .5rem;
    p {
      margin-top: 1rem;
    }
`

const Img = styled.img`
  width: 100vw;
  margin-left: -2rem;
`
const H2 = styled.h2`
  font-size: 2.5rem;
`
const Para = styled.p`
  font-size: 1.5rem;
`

export default Homepage

