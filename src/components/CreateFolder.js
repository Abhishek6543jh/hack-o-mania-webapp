import React, { useState } from 'react';
import { db } from '../firebase/config';
import { addDoc, collection } from 'firebase/firestore';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateFolder = () => {
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = async () => {
    try {
      // Add the folder to the 'folders' collection in Firestore
      await addDoc(collection(db, 'folders'), {
        name: folderName,
      });

      toast.success(`Folder "${folderName}" created successfully`);
      console.log('Folder created:', folderName);
      // You can add additional logic or UI updates as needed
    } catch (error) {
      toast.error(`Error creating folder: ${error.message}`);
      console.error('Error creating folder:', error.message);
    }
  };

  return (
    <Box
      p={8}
      maxW="md"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="lg"
      mx="auto"
      my="auto"
      bg={useColorModeValue('white', 'gray.800')}
    >
      <FormControl>
        <FormLabel>Folder Name:</FormLabel>
        <Input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          variant="filled"
          color={useColorModeValue('black', 'white')}
        />
      </FormControl>

      <Button mt={4} colorScheme="blue" onClick={handleCreateFolder}>
        Create Folder
      </Button>

      {/* Toast Container for notifications */}
      <ToastContainer position="top-center" autoClose={1000} />
    </Box>
  );
};

export default CreateFolder;
