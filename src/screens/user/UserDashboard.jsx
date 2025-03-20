import React from 'react'
import Navbar from '../../componants/Navbar'

const UserDashboard = () => {
  return (
    <div>
      <Navbar />
      <center>
        <h2>User Dashboard</h2>
        View past orders <br />
        Track ongoing orders <br />
        Wishlist & saved shops <br />
        Manage profile
      </center>
    </div>
  );
}

export default UserDashboard
