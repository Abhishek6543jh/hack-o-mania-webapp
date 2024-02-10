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
    <div className="container mx-auto p-6"> {/* Example container for layout */}
      <h2>All Folders</h2>
      {isLoading && <p>Loading folders...</p>}
      {errorStatus && <p className="error-message">{errorStatus}</p>}

      {!isLoading && !errorStatus && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">  {/* Responsive grid */}
          {allFolders.map((folder) => (
            <li
              key={folder.id}
              className="border border-gray-200 p-4 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => handleFolderClick(folder.id)}
            >
              <h3 className="text-lg font-medium">{folder.name}</h3>

              {selectedFolder === folder.id && (
                <div className="mt-3"> {/* Content shown on click */}
                  <p className="text-gray-500">
                    {folder.description || 'No description available'}
                  </p>

                  <ul className="mt-2">
                    {folder.uploads && folder.uploads.length > 0 ? (
                      folder.uploads.map((upload) => (
                        <li key={upload.fileName}>
                          <img
                            src={upload.downloadURL}
                            alt={upload.fileName}
                            style={{ maxWidth: '200px' }}
                          />
                        </li>
                      ))
                    ) : (
                      <li>No uploaded files</li>
                    )}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllFolders;
