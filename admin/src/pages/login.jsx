import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Login = () => {


  const [state, setState] = useState('admin')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState('')

  const { setAtoken, baseUrl } = useContext(AdminContext)
  const navigate = useNavigate()
  const submitHand = async (e) => {
    e.preventDefault()
    try {


      if (state === 'admin') {
        const { data } = await axios.post(baseUrl + "/api/v1/admin/login", { email, password })
        localStorage.setItem("atoken", data.token)
        setAtoken(data.token)
        console.log(data)

      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={submitHand}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 capitalize">
          {state} Login
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            value={email}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            value={password}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
        >
          Login
        </button>

        {state === 'admin' ? (
          <p className="text-sm text-gray-600 mt-4 text-center">
            Doctor login?{" "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              onClick={() => setState('Doctor')}
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-600 mt-4 text-center">
            Admin login?{" "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              onClick={() => setState('admin')}
            >
              Click here
            </span>
          </p>
        )}
      </form>
    </div>
  )
}

export default Login
