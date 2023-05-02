import {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {COLORS} from "../constants/COLORS";
import styled from 'styled-components';

const AddDrawing = ({setAddedDrawings}) => {
    const [drawings, setDrawings] = useState()
    const [showDrawing, setShowDrawing] = useState(false)
    const {userName, jobId} = useParams();
    const navigate = useNavigate()
    
    const handleShowDrawing = () => {
        setShowDrawing(!showDrawing)
    }

    const handleDrawingUpload = (e) => {
        const files = e.target.files;
        transformFile(files)
    }

    const transformFile = (files) => {
        const tempFileArray = []
       for (let i = 0; i < files.length; i++){
           const file = files[i]
           const reader = new FileReader();
           reader.readAsDataURL(file);
           reader.onloadend = () => {
            tempFileArray.push(reader.result)
            setDrawings(tempFileArray)
        }
          
       }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        fetch(`/api/jobs/addDrawing/${userName}/${jobId}`,
    {method: "PATCH",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ drawings: drawings }),
    })
.then(res => res.json())
.then(data => {
    if(data.status === 200){
        setShowDrawing(!showDrawing)
        //change state of AddedDrawings so jobDetails will re-render
        setAddedDrawings(data.data)
    }
    else if(data.status === 401){
        navigate('/login')
    } else{
        console.log(data.message)
        //setErrors(data.message)
    }
})
.catch(err => console.log(err))
    }
    
  return (
    <>
    {!showDrawing ? <StyledButton onClick={handleShowDrawing}>Add Drawing</StyledButton> : null }
    
 {showDrawing ?  <form onSubmit={handleOnSubmit}>

            <div>
                <label htmlFor='drawings'>Drawings:</label>
                <FileInput name='drawings' type="file" accept='image/' multiple="multiple" onChange={handleDrawingUpload}/>
            </div>
           <StyledButton type='submit'>Add Drawings</StyledButton>
        </form>  : null}
        </>
  )
}

const StyledButton = styled.button`
    font-size: 1rem;
    padding: .5rem;
    border: none;
    border-radius: 3px;
    background-color: ${COLORS.linkBackground};
        &:hover{
            background-color: ${COLORS.hoverBackground};
            color: ${COLORS.hoverColor};
            cursor: pointer;
        }
`
const FileInput = styled.input.attrs({type: 'file'})`
margin-left: .5rem;
padding: .5rem;
  &::-webkit-file-upload-button {
    all:unset;
    background-color: ${COLORS.secondaryBackground};
    padding: 1em;
    border-radius: 3px;
    margin-right: 1rem;
        &:hover{
            cursor: pointer;
            background-color: ${COLORS.hoverBackground};
            color: ${COLORS.hoverColor};
        }
    
  }
 
`

export default AddDrawing