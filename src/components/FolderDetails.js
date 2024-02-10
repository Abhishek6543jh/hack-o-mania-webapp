// FolderDetails.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const FolderDetails = ({ folderId }) => {
  const [folderData, setFolderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const fetchFolderDetails = async () => {
      setIsLoading(true);
      setErrorStatus(null);

      try {
        const folderDocRef = doc(db, 'folders', folderId);
        const folderSnapshot = await getDoc(folderDocRef);

        if (folderSnapshot.exists()) {
          setFolderData({ id: folderSnapshot.id, ...folderSnapshot.data() });
        } else {
          setErrorStatus('Folder document does not exist.');
        }
      } catch (error) {
        setErrorStatus('Error fetching folder details: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolderDetails();
  }, [folderId]);

  return (
    <div>
      <h2>Folder Details</h2>
      {isLoading && <p>Loading folder details...</p>}
      {errorStatus && <p className="error-message">{errorStatus}</p>}

      {!isLoading && !errorStatus && folderData && (
        <div>
          <h3>{folderData.name}</h3>
          <p>Description: {folderData.description || 'No description available'}</p>

          <h4>Assigned Farmers:</h4>
          <ul>
            {folderData.assignedFarmers && folderData.assignedFarmers.length > 0 ? (
              folderData.assignedFarmers.map((farmer) => (
                <li key={farmer.id}>{farmer.displayName || farmer.email}</li>
              ))
            ) : (
              <li>No assigned farmers</li>
            )}
          </ul>

          <h4>Uploaded Images:</h4>
          <ul>
            {folderData.images && folderData.images.length > 0 ? (
              folderData.images.map((image) => (
                <li key={image.fileName}>
                  <img src={image.imageUrl} alt={image.fileName} style={{ maxWidth: '200px' }} />
                </li>
              ))
            ) : (
              <li>No uploaded images</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FolderDetails;
