import "./App.css";
import {useState} from "react";
import UploadPDF from "./UploadPDF";
import ChatBox from "./ChatBox";

function App(){

  const [files,setFiles] = useState([])

  const addFile = (name)=>{
    setFiles(prev=>[...prev,name])
  }

  return(
    <div className="app-layout">

      <div className="sidebar">

        <div className="logo">
          🤖 Documind
        </div>

        <div className="sidebar-section-title">Uploaded Files</div>

        <div className="files-list">
          {files.length === 0 && (
            <div className="no-files">
              No PDFs uploaded yet.<br/>Upload one to get started.
            </div>
          )}
          {files.map((file,i)=>(
            <div key={i} className="file-item">
              <span className="file-icon">📄</span>
              <span className="file-name">{file}</span>
            </div>
          ))}
        </div>

        <div className="upload-box">
          <UploadPDF addFile={addFile}/>
        </div>

      </div>

      <div className="main">
        <ChatBox/>
      </div>

    </div>
  )
}

export default App