import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase/config';
import { collection, doc, getDocs, getDoc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FarmerDashboard = () => {
  const [assignedFolders, setAssignedFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const fetchAssignedFolders = async () => {
      setIsLoading(true);
      setErrorStatus(null);

      try {
        const user = auth.currentUser;

        if (user) {
          console.log("Current user is authenticated:", user);
          console.log("Current user's UID:", user?.uid);

          // Use email for checking documents
          const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            console.log("User document found:", userData);

            const assignedFoldersArray = userData.assignedFolders || [];
            console.log("Assigned folders array:", assignedFoldersArray);

            const folderPromises = assignedFoldersArray.map((folderId) => {
              return getDoc(doc(db, 'folders', folderId))
                .then((folderSnapshot) => {
                  if (folderSnapshot.exists()) {
                    return { id: folderSnapshot.id, ...folderSnapshot.data() };
                  } else {
                    console.warn(`Folder document with ID ${folderId} does not exist`);
                    return null;
                  }
                });
            });

            const folders = await Promise.all(folderPromises);
            setAssignedFolders(folders.filter((folder) => folder !== null));
          } else {
            setErrorStatus('User document does not exist.');
          }
        } else {
          setErrorStatus('No user is currently logged in.');
        }
      } catch (error) {
        setErrorStatus('Error fetching assigned folders: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignedFolders();
  }, []); 

  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.value);
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFolder || !uploadFile) {
        console.error('Selected folder or file is not valid');
        return;
      }

      const folderRef = ref(storage, `folder_uploads/${selectedFolder}/${uploadFile.name}`);
      await uploadBytes(folderRef, uploadFile);

      const downloadURL = await getDownloadURL(folderRef);

      const folderDocRef = doc(db, 'folders', selectedFolder);
      await updateDoc(folderDocRef, {
        uploads: arrayUnion({ fileName: uploadFile.name, downloadURL }),
      });

      setSelectedFolder('');
      setUploadFile(null);
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };

  return (
    <div>
      <h2>Farmer Dashboard</h2>
      {isLoading && <p>Loading assigned folders...</p>}
      {errorStatus && <p className="error-message">{errorStatus}</p>}

      {!isLoading && !errorStatus && (
        <>
          <label>Select Assigned Folder:</label>
          <select value={selectedFolder} onChange={handleFolderChange}> 
            <option value="" disabled>Select Folder</option>
            {assignedFolders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name} 
              </option>
            ))}
          </select> 
          <label>Upload File:</label>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </>
      )}
    </div>
  );
};

export default FarmerDashboard;
