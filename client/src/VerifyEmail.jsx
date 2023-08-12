import { useEffect, useState } from "react"
import useQueryParams from "./useQueryParams"
import axios from "axios"

export default function VerifyEmail() {
  const [message, setMessage] = useState()
  const {token} = useQueryParams()
  useEffect(() => {
    const controller = new AbortController()
    if (token){
        axios.post("/users/verify-email", // Your API endpoint here
        {email_verify_token: token},
        {
          baseURL: import.meta.env.VITE_API_BASE_URL,
          signal: controller.signal
        }
        ).then((res)=>{
            setMessage(res.data.message)
            if (res.data.results){
              const {access_token, refresh_token} = res.data.results
              localStorage.setItem("access_token", access_token)
              localStorage.setItem("refresh_token", refresh_token)
            }
        }).catch((err)=>{
          setMessage(err.response.data.message)
        })
    }
    return () => {
      controller.abort()
    }
  },[token])
  return <div>{message}</div>
}