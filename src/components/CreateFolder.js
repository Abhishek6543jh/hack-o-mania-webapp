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
    <Box p={4} maxW="md" borderWidth="1px" borderRadius="md" boxShadow="md">
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

      <Button
        mt={4}
        colorScheme="blue"
        onClick={handleCreateFolder}
      >
        Create Folder
      </Button>
    </Box>
  );
};

export default CreateFolder;
