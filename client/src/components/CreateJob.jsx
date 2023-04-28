import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const CreateJob = () => {
    const location = useLocation();
    const myUser = location.state;
    const navigate = useNavigate()
    const [drawings, setDrawings] = useState();
    const [templates, setTemplates] = useState();
    const [errors, setErrors] = useState(null);
    const [formData, setFormData] = useState(
        {
            type: "",
            jobId: "",
            clientName: "",
            address: "",
            drawings: [],
            forms: [],
            notes: []
        }
    );

    //fetch form templates from database
    useEffect(() => {
        fetch('/api/templates')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.status === 200){
                setTemplates(data.data)
            }
        })
        .catch(err => console.log(err))
    },[])

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
        setFormData({...formData, drawings: tempFileArray})
        }
          
       }
    }

    const handleOnChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleNotes = (e) => {
        const tempNotesArr = [];
        tempNotesArr.push(e.target.value);
        setFormData({...formData, notes: tempNotesArr})
    }

    const handleForms = (e) => {
        const formName = e.target.name;
        const isChecked = e.target.checked;

        //find form data in templates 
       const form = templates.find((template) => template.formName === formName)

       //copy of formData form
       const copyFormData = [...formData.forms]
        
       if(isChecked){
        copyFormData.push(form)
       } else {
        //remove form from forms data
        const formIndex = copyFormData.findIndex((f) => f.formName === formName)
        if(formIndex !== -1){
            copyFormData.splice(formIndex, 1)
        }
       }
        
        setFormData({...formData, forms: copyFormData})
    }
   
    const handleOnSubmit = (e) => {
e.preventDefault()

        fetch(`/api/create-job/${myUser._id}`,{
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ formData: formData }),
            })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.status === 200){
                navigate(`/dashboard/${myUser.name}`)
            }
            if(data.status === 401){
                navigate("/login")
            }else{
                setErrors(data.message)
            }
        })
        .catch(err => console.log(err))
    }

    if(!templates){
        return <div>...Loading</div>
    }

  return (
    <div>
        <h2>Create New Job</h2>
        <form onSubmit={handleOnSubmit}>
        
        <div>
                <label htmlFor='service'>Service</label>
                <input name='type' type='radio' id='service' value='Service' onChange={handleOnChange} />
            </div>
            <div>
                <label htmlFor='installation'>Installation</label>
                <input name='type' type='radio' id='installation' value='Installation' onChange={handleOnChange} />
            </div>
            <div>
                <label htmlFor='removal'>Removal</label>
                <input name='type' type='radio' id='Removal' value='removal' onChange={handleOnChange} />
            </div>
            
            <div>
                <label htmlFor='jobId'>Job ID:</label>
                <input name='jobId' type='text' id='jobId' onChange={handleOnChange} required/>
            </div>
            <div>
                <label htmlFor='clientName'>Client:</label>
                <input name='clientName' type='text' id='clientName' onChange={handleOnChange} />
            </div>
            <div>
                <label htmlFor='address'>Address:</label>
                <input name='address' type="address" id='address' onChange={handleOnChange} />
            </div>
            <div>
                <label htmlFor='drawings'>Drawings:</label>
                <input name='drawings' type="file" accept='image/' multiple="multiple" onChange={handleDrawingUpload}/>
            </div>
            <div>
                <label htmlFor='notes'>Additional Info:</label>
                <textarea name='notes' type="text" id='notes' onChange={handleNotes}/>
            </div>
            <p>Add Forms:</p>
            {templates.map((template) => {
                return <div key={template._id}>
                    <input type='checkbox' name={template.formName} id='forms' onChange={handleForms} />
                    <label htmlFor='forms'> {template.formName} </label>
                     </div>
            }) }
           <button type='submit'>Create Job</button>
        </form>
        {errors ? <div>
            <p>{errors} </p>
        </div> : null }
    </div>
  )
}

export default CreateJob