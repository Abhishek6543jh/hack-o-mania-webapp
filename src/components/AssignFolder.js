import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignFolder = () => {
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [folders, setFolders] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [notification, setNotification] = useState(null);

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

          const [regionSnapshot, cropSnapshot] = await Promise.all([
            getDocs(regionQuery),
            getDocs(cropQuery),
          ]);

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

          console.log('Region Data:', regionData);
          console.log('Crop Data:', cropData);

          // Find common farmers based on both region and crop criteria
          farmersData = regionData.filter((regionFarmer) =>
            cropData.some((cropFarmer) => cropFarmer.id === regionFarmer.id)
          );
        }

        console.log('Farmers Data:', farmersData);

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
        console.log('Assigning folder to farmer:', farmer);
        const farmerRef = doc(db, 'users', farmer.id);
        await updateDoc(farmerRef, {
          assignedFolders: arrayUnion(selectedFolder),
        });
      }

      setSelectedFolder('');
      setSelectedRegion('');
      setSelectedCrop('');
      setNotification({
        status: 'success',
        message: 'Folder assigned successfully',
      });
    } catch (error) {
      console.error('Error assigning folder:', error.message);
      setNotification({
        status: 'error',
        message: `Error assigning folder: ${error.message}`,
      });
    }
  };

  return (
    <Box
      p={6}
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      mx="auto"
      my="auto"
      bg="white"
    >
      <Stack spacing={4} align="center">
        {notification && (
          <Alert
            status={notification.status}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {notification.status === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        <FormControl>
          <FormLabel>Select Folder:</FormLabel>
          <Select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            placeholder="Select Folder"
            borderRadius="md"
          >
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
            placeholder="Select Crop"
            borderRadius="md"
          >
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
            placeholder="Select Region"
            borderRadius="md"
          >
            {exampleRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button
          colorScheme="teal"
          variant="solid"
          onClick={handleAssignFolder}
          borderRadius="md"
          w="100%"
        >
          Assign Folder
        </Button>
      </Stack>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Box>
  );
};

export default AssignFolder;
