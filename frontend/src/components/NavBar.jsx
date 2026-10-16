import React from 'react'
import './NavBar.css'
import { useNavigate } from 'react-router-dom';
function NavBar() {
    const navigate = useNavigate();
    function handleLogout() {
        localStorage.removeItem('token')

        navigate('/login')
    }
  return (
    <div className='nav-bar'>
        <ul>
            <div className="left"></div>
            <div className="right">
                <button onClick={()=>navigate('/dashboard')}>Dashboard</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </ul>
    </div>
  )
}

export default NavBar