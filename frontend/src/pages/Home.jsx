import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {useNavigate} from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState();

  useEffect(() => {

    async function getProfile() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/user/profile", { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } })
      const resData = await res.json();
      setUser(resData.data)
    }

    try {
      getProfile();
    } catch (err) {
      toast.error(err.message)
    }

  }, [])

  async function handleDelete(){
    try{
      const res = await fetch("http://localhost:3000/user/logout", {method: "POST"}  )
      const resData = await res.json();
      toast.success( resData.message );
      localStorage.removeItem("token");
      navigate("/login");
    } catch(err){
      toast.error( err.message );
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col gap-12 items-center justify-center dark:bg-zinc-900 dark:text-white px-4">
      <h1 className="text-5xl font-semibold">Welcome to Home Page</h1>

      <div className="w-full max-w-md p-6 mt-8 bg-white dark:bg-zinc-800 rounded-xl shadow-lg">
        {user ? (
          <div>
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-xl text-center text-gray-600 dark:text-gray-300">{user.email}</p>
          </div>
        ) : (
          <p className="text-center text-lg text-red-500">No user found</p>
        )}
      </div>

      <button onClick={handleDelete} className="px-6 py-2 mt-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300">
        Log Out
      </button>

    </div>
  )
}

export default Home