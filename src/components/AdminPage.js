import React, { useState } from 'react';
import CreateFolder from './CreateFolder';
import AssignFolder from './AssignFolder';
import FolderDetails from './FolderDetails';
import Register from './reg'; // Assuming you have this component

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('folderDetails');

  const renderSelectedComponent = () => {
    switch (selectedTab) {
      case 'folderDetails':
        return <FolderDetails />;
      case 'createFolder':
        return <CreateFolder />;
      case 'assignFolder':
        return <AssignFolder />;
      case 'reg':
         return <Register />;
      default:
        return null; // Or a default component
    }
  };

  return (
    <div>
      <h1>Welcome, Admin!</h1>

      <nav>
        <ul>
        <li>
            <button onClick={() => setSelectedTab('folderDetails')}>
              Folder Details
            </button>
            </li>
          <li>
            <button onClick={() => setSelectedTab('createFolder')}>
              Create Folder
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab('assignFolder')}>
              Assign Folder
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab('reg')}>
              Register New User
            </button>
          </li>
        </ul>
      </nav>

      <div className="content-area">
        {renderSelectedComponent()} 
      </div>
    </div>
  );
};

export default AdminPage;
