
import styled from 'styled-components';


const PdfDisplayer = ({pdfUrl}) => {
  //display if file type is PDF
  return (
    <div>
       <StyledEmbed src={pdfUrl} type={"application/pdf"}  /> 
      </div>

  )
}

const StyledEmbed = styled.embed`
height: 70vh; 
width: 80vw;
`

export default PdfDisplayer