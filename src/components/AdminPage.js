// AdminPage.js
import React from 'react';
import CreateFolder from './CreateFolder';
import AssignFolder from './AssignFolder';

const AdminPage = () => {
  return (
    <div>
      <h1>Welcome, Admin!</h1>
      <CreateFolder />
      <AssignFolder />
    </div>
  );
};

export default AdminPage;
