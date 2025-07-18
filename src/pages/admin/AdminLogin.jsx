import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('adminToken', data.token)
        alert('Login successful')
        navigate('/admin/dashboard')
      } else {
        alert(data.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      alert('Something went wrong')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 px-4 py-2 w-full border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-6 px-4 py-2 w-full border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
