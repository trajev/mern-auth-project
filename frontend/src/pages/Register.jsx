import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast'

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch( "http://localhost:3000/user/register", { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify({name: formData.name, email: formData.email, password: formData.password}) } )
    const resData = await res.json();

    if( resData.success ){
      toast.success( resData.message );
      setFormData({name: "", email: "", password: ""});
      navigate("/login")
    } else {
      if( resData.error ){
        toast.error( resData.error );
      } else {
        toast.error( resData.message );
      }
    }

  }

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center gap-6 bg-zinc-100 dark:bg-zinc-900 dark:text-white'>


      <h1 className='text-3xl font-semibold'>Registration Page</h1>

      <form onSubmit={handleSubmit} autoComplete='off' className='w-2/3 lg:w-1/3 flex flex-col gap-4'>
        <div className='flex flex-col gap-2 items-start'>
          <label htmlFor="name" className='text-2xl'>Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder='Enter name here' className='w-full dark:bg-zinc-700 border dark:border-none focus:outline-none text-xl p-2 rounded ' />
        </div>
        <div className='flex flex-col gap-2 items-start'>
          <label htmlFor="email" className='text-2xl'>Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder='Enter email here' className='w-full dark:bg-zinc-700 border dark:border-none focus:outline-none text-xl p-2 rounded ' />
        </div>
        <div className='flex flex-col gap-2 items-start'>
          <label htmlFor="password" className='text-2xl'>Password</label>
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder='Enter password here' className='w-full dark:bg-zinc-700 border dark:border-none focus:outline-none text-xl p-2 rounded ' />
        </div>
        <button type='submit' className='w-full text-xl bg-zinc-800 p-2 rounded hover:bg-zinc-600 text-white'>Register</button>
      </form>


    </div>
  )
}

export default Register