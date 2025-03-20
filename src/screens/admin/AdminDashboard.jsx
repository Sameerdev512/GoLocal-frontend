import React from 'react'
import Navbar from '../../componants/Navbar';

const AdminDashboard = () => {
  return (
    <div>
      <Navbar />
      <center>
        <h2>Admin Dashboard</h2>
        Manage user accounts <br />
        Verify shop listings <br />
        Remove fraudulent listings <br />
        View analytics & reports
      </center>
    </div>
  );
}

export default AdminDashboard
