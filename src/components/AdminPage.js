import React, { useState } from 'react';
import { useEffect } from 'react';
import CreateFolder from './CreateFolder';
import AssignFolder from './AssignFolder';
import FolderDetails from './FolderDetails';
import Register from './reg'; // Import your Register component
import { auth ,db} from '../firebase/config'; // Import auth reference
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc,doc } from 'firebase/firestore';

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('folderDetails'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        // Additional Firestore check for 'admin' role (modify as needed)
        const checkAdminRole = async () => {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef); 
          setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');
        }; 
        checkAdminRole(); 
      } else {
        setIsAdmin(false); 
      }
    });

    return unsubscribe; 
  }, []);




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
              Register New User
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
