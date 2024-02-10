import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, doc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';

const AssignFolder = () => {
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null); // Initialize as null
  const [folders, setFolders] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [areFarmersLoaded, setAreFarmersLoaded] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const foldersQuery = collection(db, 'folders');
        const foldersSnapshot = await getDocs(foldersQuery);
        setFolders(foldersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })));
      } catch (error) {
        console.error('Error fetching folders:', error.message);
      }
    };

    const fetchFarmers = async () => {
      try {
        const farmersQuery = query(collection(db, 'users'), where('role', '==', 'farmer'));
        const farmersSnapshot = await getDocs(farmersQuery);
        setFarmers(farmersSnapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          ...doc.data(),
        })));
        setAreFarmersLoaded(true); // Farmers data is fetched
      } catch (error) {
        console.error('Error fetching farmers:', error.message);
      }
    };

    fetchFolders();
    fetchFarmers();
  }, []);

  const handleAssignFolder = async () => {
    try {
      if (!selectedFolder || !selectedFarmer) {
        console.error('Selected folder or farmer is not valid');
        return;
      }

      const farmerRef = doc(db, 'users', selectedFarmer);
      await updateDoc(farmerRef, {
        assignedFolders: arrayUnion(selectedFolder),
      });

      setSelectedFolder('');
      setSelectedFarmer(null); // Reset selection after assignment
    } catch (error) {
      console.error('Error assigning folder:', error.message);
    }
  };

  return (
    <div>
      <h2>Assign Folder to Farmer</h2>
      <label>Select Folder:</label>
      <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
        <option value="" disabled>Select Folder</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
      <label>Select Farmer:</label>
      <select value={selectedFarmer || ''} onChange={(e) => setSelectedFarmer(e.target.value)}> 
        <option value="" disabled>Select Farmer</option> 
        {areFarmersLoaded ? (
          farmers.map((farmer) => (
            <option key={farmer.id} value={farmer.id}>
              {farmer.email}
            </option>
          ))
        ) : (
          <option disabled>Loading farmers...</option> 
        )}
      </select>
      <button onClick={handleAssignFolder} disabled={!areFarmersLoaded}>Assign Folder</button>
    </div>
  );
};

export default AssignFolder;
