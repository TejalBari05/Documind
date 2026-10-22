import {useState,useRef} from "react"

function UploadPDF({addFile}){

  const [uploading,setUploading] = useState(false)
  const [status,setStatus] = useState(null)
  const inputRef = useRef(null)

  const uploadFile = async (event)=>{

    const file = event.target.files[0]
    if(!file) return

    setUploading(true)
    setStatus(null)

    const formData = new FormData()
    formData.append("file",file)

    try {
      const res = await fetch("http://127.0.0.1:8000/upload-pdf",{
        method:"POST",
        body:formData
      })

      if(!res.ok) throw new Error("Upload failed")

      addFile(file.name)
      setStatus({type:"success",text:`✓ ${file.name} uploaded`})
    } catch(err) {
      setStatus({type:"error",text:"Upload failed. Check backend."})
    }

    setUploading(false)
    if(inputRef.current) inputRef.current.value = ""
  }

  return(
    <div>
      <label className={`upload-label ${uploading ? "uploading" : ""}`}>
        <span className="upload-icon">📎</span>
        {uploading ? "Uploading..." : "Upload PDF"}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={uploadFile}
          className="upload-hidden"
        />
      </label>

      {status && (
        <div className={`upload-status ${status.type}`}>
          {status.text}
        </div>
      )}
    </div>
  )
}

export default UploadPDF