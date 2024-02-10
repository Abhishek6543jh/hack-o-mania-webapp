import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
} from '@chakra-ui/react';

const AssignFolder = () => {
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [folders, setFolders] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const exampleRegions = ['Midwest', 'Northeast', 'South', 'West'];
  const exampleCrops = ['Corn', 'Soybeans', 'Wheat', 'Rice'];

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const foldersQuery = collection(db, 'folders');
        const foldersSnapshot = await getDocs(foldersQuery);
        const foldersData = foldersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFolders(foldersData);
      } catch (error) {
        console.error('Error fetching folders:', error.message);
      }
    };

    const fetchFarmers = async () => {
        try {
          let farmersData = [];
      
          if (selectedRegion && selectedCrop) {
            // Perform two separate queries and merge the results
            const regionQuery = query(
              collection(db, 'users'),
              where('role', '==', 'farmer'),
              where('assignedRegions', 'array-contains', selectedRegion)
            );
      
            const cropQuery = query(
              collection(db, 'users'),
              where('role', '==', 'farmer'),
              where('cropExpertise', 'array-contains', selectedCrop)
            );
      
            const regionSnapshot = await getDocs(regionQuery);
            const cropSnapshot = await getDocs(cropQuery);
      
            const regionData = regionSnapshot.docs.map((doc) => ({
              id: doc.id,
              email: doc.data().email,
              ...doc.data(),
            }));
      
            const cropData = cropSnapshot.docs.map((doc) => ({
              id: doc.id,
              email: doc.data().email,
              ...doc.data(),
            }));
      
            // Merge results while ensuring unique entries
            farmersData = Array.from(new Set([...regionData, ...cropData]));
          }
      
          setFarmers(farmersData);
        } catch (error) {
          console.error('Error fetching farmers:', error.message);
        }
      };

    fetchFolders();
    fetchFarmers();
  }, [selectedRegion, selectedCrop]);

  const handleAssignFolder = async () => {
    try {
      for (const farmer of farmers) {
        const farmerRef = doc(db, 'users', farmer.id);
        await updateDoc(farmerRef, {
          assignedFolders: arrayUnion(selectedFolder),
        });
      }

      setSelectedFolder('');
      setSelectedRegion('');
      setSelectedCrop('');
    } catch (error) {
      console.error('Error assigning folder:', error.message);
    }
  };

  return (
    <Box p={4} maxW="md" borderWidth="1px" borderRadius="md" boxShadow="md">
      <Stack spacing={3}>
        <FormControl>
          <FormLabel>Select Folder:</FormLabel>
          <Select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            <option value="" disabled>
              Select Folder
            </option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Select Crop:</FormLabel>
          <Select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="" disabled>
              Select Crop
            </option>
            {exampleCrops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Select Region:</FormLabel>
          <Select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="" disabled>
              Select Region
            </option>
            {exampleRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button colorScheme="blue" onClick={handleAssignFolder}>
          Assign Folder
        </Button>
      </Stack>
    </Box>
  );
};

export default AssignFolder;
