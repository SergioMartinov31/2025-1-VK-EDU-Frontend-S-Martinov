import { useState } from 'react'
import './App.css'
import {List} from "./components/List"

function App() {
  const [chatsLisy, setChatList] = useState({})
  const [activeChat, setActiveChat] = useState({})
  return (
    <div>
      <div>
        <List list={[{id: 1},{id: 2}]}/>
      </div>
      <div>active</div>
    </div>
  )
}

export default App
