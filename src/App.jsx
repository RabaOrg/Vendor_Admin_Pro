import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Button } from 'flowbite-react'
import { ToastContainer, toast } from 'react-toastify';
import viteLogo from '/vite.svg'
import './App.css'
import { Link } from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <button onClick={notify}>Notify!</button>
        <ToastContainer />
      </div>
    </>
  )
}

export default App
