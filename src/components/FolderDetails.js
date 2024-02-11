import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const AllFolders = () => {
  const [allFolders, setAllFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    const fetchAllFolders = async () => {
      setIsLoading(true);
      setErrorStatus(null);

      try {
        const foldersCollection = collection(db, 'folders');
        const foldersSnapshot = await getDocs(foldersCollection);

        const foldersData = foldersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllFolders(foldersData);
      } catch (error) {
        setErrorStatus('Error fetching all folders: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFolders();
  }, []);

  const handleFolderClick = (folderId) => {
    setSelectedFolder((prevSelected) =>
      prevSelected === folderId ? null : folderId
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Folders</h2>
      {isLoading && <p className="text-gray-600">Loading folders...</p>}
      {errorStatus && <p className="text-red-500">{errorStatus}</p>}

      {!isLoading && !errorStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Folder List */}
          <ul>
            {allFolders.map((folder) => (
              <li
                key={folder.id}
                className={`flex flex-col items-start border border-gray-200 bg-yellow-100 p-4 rounded-md shadow-md hover:bg-yellow-200 cursor-pointer ${
                  selectedFolder === folder.id ? 'expanded' : ''
                }`}
                onClick={() => handleFolderClick(folder.id)}
              >
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium">{folder.name}</h3>
                </div>
              </li>
            ))}
          </ul>

          {/* Selected Folder Content */}
          <div className="col-span-2">
            {selectedFolder && (
              <div>
                <h2 className="text-xl font-bold mb-2">Selected Folder</h2>
                <div className="border border-gray-200 p-2 rounded-md shadow-md">
                  
                  <p className="text-gray-500">
                    {allFolders
                      .find((folder) => folder.id === selectedFolder)
                      ?.uploads?.length > 0 ? (
                        allFolders
                          .find((folder) => folder.id === selectedFolder)
                          ?.uploads.map((upload) => (
                            <div key={upload.fileName} className="mb-2">
                              <img
                                src={upload.downloadURL}
                                alt={upload.fileName}
                                className="max-w-full h-auto shadow-md"
                              />
                              <p className="mt-2">
                                {upload.description
                                  ? upload.description
                                  : 'No description available'}
                              </p>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-500">No uploaded files</p>
                        
                      )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFolders;
