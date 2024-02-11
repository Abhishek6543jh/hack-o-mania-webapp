import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [regions, setRegions] = useState('');
  const [crops, setCrops] = useState('');

  const exampleRegions = ['Midwest', 'Northeast', 'South', 'West'];
  const exampleCrops = ['Corn', 'Soybeans', 'Wheat', 'Rice'];

  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.email);

      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        role: 'farmer',
        displayName: displayName,
        assignedRegions: regions.split(',').map((r) => r.trim()),
        cropExpertise: crops.split(',').map((c) => c.trim()),
      });

      console.log(
        'User registered and data stored in Firestore:',
        user,
        userDocRef
      );

      // Reset form (optional)
      setEmail('');
      setPassword('');
      setDisplayName('');
      setRegions('');
      setCrops('');
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <Box
      p={4}
      maxW={{ base: '100%', md: '400px' }}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      mx="auto"
      bg="gray.800" // Dark background color
      color="white" // Text color
    >
      <Stack spacing={3}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            bg="gray.700" // Dark background color
            color="white" // Text color
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            bg="gray.700" // Dark background color
            color="white" // Text color
          />
        </FormControl>

        <FormControl>
          <FormLabel>Display Name</FormLabel>
          <Input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            bg="gray.700" // Dark background color
            color="white" // Text color
          />
        </FormControl>

        <FormControl>
          <FormLabel>Regions</FormLabel>
          <Select
            value={regions}
            onChange={(e) => setRegions(e.target.value)}
            bg="gray.700" // Dark background color
            color="white" // Text color
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

        <FormControl>
          <FormLabel>Crops</FormLabel>
          <Select
            value={crops}
            onChange={(e) => setCrops(e.target.value)}
            bg="gray.700" // Dark background color
            color="white" // Text color
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

        <Button colorScheme="blue" onClick={handleRegistration}>
          Register
        </Button>
      </Stack>
    </Box>
  );
};

export default Register;
