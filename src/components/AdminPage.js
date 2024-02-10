// AdminPage.js
import React from 'react';
import CreateFolder from './CreateFolder';
import AssignFolder from './AssignFolder';
import FolderDetails from './FolderDetails';

const AdminPage = () => {
  return (
    <div>
      <h1>Welcome, Admin!</h1>
      <CreateFolder />
      <AssignFolder />
      <FolderDetails />
    </div>
  );
};

export default AdminPage;
