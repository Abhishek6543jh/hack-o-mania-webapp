import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/config';
import { collection, doc, getDocs, updateDoc, arrayUnion, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FarmerDashboard = ({ farmerId }) => {
  const [assignedFolders, setAssignedFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const fetchAssignedFolders = async () => {
      try {
        const farmerRef = doc(db, 'users', farmerId);
        const farmerSnapshot = await getDocs(farmerRef); 

        if (farmerSnapshot.exists()) { 
          const data = farmerSnapshot.data();
          setAssignedFolders(data.assignedFolders || []);
        }
      } catch (error) {
        console.error('Error fetching assigned folders:', error.message);
      }
    };

    fetchAssignedFolders();
  }, [farmerId]);

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
      <label>Select Assigned Folder:</label>
      <select value={selectedFolder} onChange={handleFolderChange}>
        <option value="" disabled>Select Folder</option>
        {assignedFolders.map((folderId) => (
          <option key={folderId} value={folderId}>
            {folderId}
          </option>
        ))}
      </select>
      <label>Upload File:</label>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FarmerDashboard;
