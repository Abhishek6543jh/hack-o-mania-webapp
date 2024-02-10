// CreateFolder.js
import React, { useState } from 'react';
import { db } from '../firebase/config';
import { addDoc, collection } from 'firebase/firestore';

const CreateFolder = () => {
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = async () => {
    try {
      // Add the folder to the 'folders' collection in Firestore
      await addDoc(collection(db, 'folders'), {
        name: folderName,
      });

      console.log('Folder created:', folderName);
      // You can add additional logic or UI updates as needed
    } catch (error) {
      console.error('Error creating folder:', error.message);
    }
  };

  return (
    <div>
      <h2>Create Folder</h2>
      <label>Folder Name:</label>
      <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
      <button onClick={handleCreateFolder}>Create Folder</button>
    </div>
  );
};

export default CreateFolder;
