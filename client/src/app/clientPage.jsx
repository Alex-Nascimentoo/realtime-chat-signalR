'use client'

import React, { useState, useEffect, useCallback } from "react"
import { HttpTransportType, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr"



export default function ClientPage() {
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [data, setData] = useState([])

  const wsUrl = "https://localhost:7158/chat"

  const connection = new HubConnectionBuilder()
    .withUrl(wsUrl)
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  async function start() {
    try {
      if(connection.state !== "Connected") {
        await connection.start().then(() => {
          setTimeout(() => {}, 1000)
        }).catch(err => console.log(err.message))
        console.log("SignalR connected.")
      }
    } catch (err) {
      console.assert(connection.state === HubConnectionState.Disconnected)
      console.log("erru")
      console.log(err)
      setTimeout(() => start(), 5000)
    }
  }

  start()
  
  connection.on("ReceiveMessage", async (user, message) => {
    console.log("message sent")
    setData(data => [...data, `${user} said ${message}`])
  })

  async function handleSendMsg() {
    try {
      await connection.invoke("SendMessage", username, message)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="container mx-auto flex flex-col gap-12 min-h-screen items-center justify-center p-24">
      <div className="flex flex-col gap-7 text-xl w-1/2">
        <div>
          <label className="block">User</label>
          <input
            className="text-black w-full"
            type="text"
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block">Message</label>
          <input
            className="text-black w-full"
            type="text"
            onChange={e => setMessage(e.target.value)}  
          />
        </div>

        <button className="bg-sky-600 rounded-lg py-2 font-semibold" onClick={async() => await handleSendMsg()}>Send Message</button>
      </div>

      <div>
        <ul className="text-xl">
          {
            data.map((msg, index) => (
              <li key={index}>{ msg }</li>
            ))
          }
        </ul>
      </div>
    </main>
  )
}
