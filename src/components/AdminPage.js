import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateFolder from './CreateFolder';
import AssignFolder from './AssignFolder';
import FolderDetails from './FolderDetails';
import Register from './reg';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

const AdminPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('folderDetails');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDocRef = doc(db, 'users', user.email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
            console.log(userData.email)
          if (userData && userData.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            console.log("User is not admin, redirecting...");
            navigate('/');
          }
        } else {
          // Handle non-existent document errors here
          console.error("Firestore user document not found!");
          // ... (e.g., redirect to login or handle appropriately)
        }
      } else {
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, [navigate]);

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
        return null;
    }
  };

  return (
    <div>
      {/* Tailwind styled navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Welcome, Admin!</h1>
        <ul className="flex space-x-6">
          <li>
            <button 
              className="px-4 py-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => setSelectedTab('folderDetails')}
            >
              Folder Details
            </button>
          </li>
          <li>
            <button 
              className="px-4 py-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => setSelectedTab('createFolder')}
            >
              Create Folder
            </button>
          </li>
          <li>
            <button 
              className="px-4 py-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => setSelectedTab('assignFolder')}
            >
              Assign Folder
            </button>
          </li>
          <li>
            <button 
              className="px-4 py-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => setSelectedTab('reg')}
            >
              Register New Farmer
            </button>
          </li>
        </ul>
      </nav>

      {/* Content area for selected components */}
      <div className="content-area p-6"> 
        {renderSelectedComponent()} 
      </div>
    </div>
  );
};

export default AdminPage;
