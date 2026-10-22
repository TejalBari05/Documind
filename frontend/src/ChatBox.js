import React,{useState,useRef,useEffect} from "react"

function ChatBox(){

  const [question,setQuestion] = useState("")
  const [messages,setMessages] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)

  const chatEndRef = useRef(null)

  useEffect(()=>{
    chatEndRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages,loading])

  const sendQuestion = async()=>{

    if(!question.trim() || loading) return

    const userText = question

    setMessages(prev=>[
      ...prev,
      {role:"user",text:userText}
    ])

    setQuestion("")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/chat?query=${encodeURIComponent(userText)}`,
        {method:"POST"}
      )

      if(!response.ok) throw new Error("Server error")

      const data = await response.json()

      setMessages(prev=>[
        ...prev,
        {role:"bot",text:data.answer}
      ])
    } catch(err) {
      setError("Could not reach the server. Make sure the backend is running.")
    }

    setLoading(false)
  }

  const clearChat = ()=>{
    setMessages([])
    setError(null)
  }

  const handleKeyPress = (e)=>{
    if(e.key==="Enter" && !e.shiftKey){
      e.preventDefault()
      sendQuestion()
    }
  }

  return(
    <>
      <div className="chat-header">
        <h2>Chat</h2>
        <button className="clear-btn" onClick={clearChat}>
          🗑️ Clear
        </button>
      </div>

      <div className="chat-window">

        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <p>Ask anything about your PDFs</p>
            <span>Upload a document and start chatting</span>
          </div>
        )}

        {messages.map((msg,i)=>(

          <div
            key={i}
            className={`message ${msg.role==="user"?"user":"bot"}`}
          >
            <div className="msg-content">
              <div className={`avatar ${msg.role==="user"?"user-avatar":"bot-avatar"}`}>
                {msg.role==="user" ? "👤" : "🤖"}
              </div>
              <span
                className={`bubble ${msg.role==="user"?"user-bubble":"bot-bubble"}`}
              >
                {msg.text}
              </span>
            </div>
          </div>

        ))}

        {loading && (
          <div className="typing-wrapper">
            <div className="avatar bot-avatar">🤖</div>
            <div className="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div ref={chatEndRef}></div>

      </div>

      <div className="input-area">
        <input
          value={question}
          onChange={(e)=>setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about the PDF..."
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={sendQuestion}
          disabled={loading || !question.trim()}
        >
          Send ➤
        </button>
      </div>
    </>
  )
}

export default ChatBox