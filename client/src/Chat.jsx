import { useEffect, useState } from "react"
import socket from "./socket"
import axios from "axios"
import InfiniteScroll from 'react-infinite-scroll-component'

const profile = JSON.parse(localStorage.getItem('profile'))
const usernames = [
  {
    name: 'user1',
    value: 'user64a4fb6f16f16ebe0ea1afee'
  },
  {
    name: 'user2',
    value: 'user64b78f898a0bfc8d3fe3b9e9'
  } 
]

const LIMIT = 10
const PAGE = 1

export default function Chat() {
  const [value, setValue] = useState("")
  const [conversations, setConversations] = useState([])
  const [receiver, setReceiver] = useState("")
  const [pagination, setPagination] = useState({
    page: PAGE,
    total_page: 0
  })
  const getProfile = (username) => {
    axios.get(`/users/${username}`,{
      baseURL: import.meta.env.VITE_API_BASE_URL
    }).then((res)=>{
      setReceiver(res.data.result._id)
      alert(`You are chatting with ${res.data.result.name}`)
    })
  }
  useEffect(() => {
    socket.on("receive_message", data => {
      const {payload} = data
      setConversations(conversations => [
        ...conversations, 
        payload
    ])
    })

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    })

    socket.on("disconnect", (reason) => {
      console.log(`disconnect due to ${reason}`);
    })

    return () => {
      socket.disconnect()
    }
  },[])

  useEffect(() => {
    if (receiver){
      axios.get(`/conversations/receiver/${receiver}`,{
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers:{
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        params:{
          limit: LIMIT,
          page: PAGE
        }
      }).then(res=> {
        const { conversations, page, total_page } = res.data.result
        setConversations((prev) => [...prev, ...conversations])
        setPagination({
          page,
          total_page
        })
      })
    }
    
  },[receiver])

  const fetchMoreConversations = () => {
    if (receiver && pagination.page < pagination.total_page){
      axios.get(`/conversations/receiver/${receiver}`,{
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers:{
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        params:{
          limit: LIMIT,
          page: pagination.page + 1
        }
      }).then(res=> {
        const { conversations, page, total_page } = res.data.result
        setConversations(conversations)
        setPagination({
          page,
          total_page
        })
      })
    }
  }

  const send = (e) => {
    e.preventDefault()
    setValue("")
    const conversation = {
      content: value,
      sender_id: profile._id,
      receiver_id: receiver
    }
    socket.emit("send_message", {
      payload: conversation
    })
    setConversations(conversations => [
      {
        ...conversation,
        _id: new Date().getTime()
      },
      ...conversations
    ])
  }
  return (
  <div>
    <h1>Chat</h1>
    <div>
      {usernames.map((username) => (
        <div key={username.name}>
        <button onClick={() => getProfile(username.value)} > {username.name} </button>
        </div>
      ))}
    </div>
    <div
    id="scrollableDiv"
    style={{
      height: 300,
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column-reverse',
    }}
    >
    {/*Put the scroll bar always on the bottom*/}
    <InfiniteScroll
      dataLength={conversations.length}
      next={fetchMoreConversations}
      style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
      inverse={true} //
      hasMore={pagination.page < pagination.total_page}
      loader={<h4>Loading...</h4>}
      scrollableTarget="scrollableDiv"
    >
      {conversations.map((conversation) => (
        <div key={conversation._id}>
          <div className="message-container">
            <div className={'message ' + (conversation.sender_id === profile._id ? "message-right conversation" : "")}>{conversation.content}</div>
          </div>
        </div>
      ))} 
    </InfiniteScroll>
    </div>
    <form onSubmit={send}>
      <input 
        type="text" 
        onChange={e => setValue(e.target.value)}
        value={value}
      />
      <button type="submit">Send</button>
    </form>
  </div>
  )
}
