import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ChatPage = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => {
        setCount(prev => prev + 1);
        if(count === 11){
          toast.success(`enough already , you have clicked it ${count} times`)
        }
        toast.success(`Clicked ${count} times.`)
      }}>Click Me</button>
    </div>
  )
}

export default ChatPage