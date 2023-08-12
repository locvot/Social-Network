import { useEffect } from "react"
import {io} from "socket.io-client"

export default function Chat() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL)
    socket.on("connect", () => {
      console.log(socket.id)
    })
    socket.on("disconnect", () => {
      console.log(socket.id) // undefined
    })
    return () => {
      socket.disconnect()
    }
  },[])
  return (
    <div>Chat</div>
  )
}
