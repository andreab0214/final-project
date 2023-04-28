import {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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
    <button onClick={handleShowDrawing}>Add Drawing</button>
 {showDrawing ?  <form onSubmit={handleOnSubmit}>

            <div>
                <label htmlFor='drawings'>Drawings:</label>
                <input name='drawings' type="file" accept='image/' multiple="multiple" onChange={handleDrawingUpload}/>
            </div>
           <button type='submit'>Make Changes</button>
        </form>  : null}
        </>
  )
}

export default AddDrawing