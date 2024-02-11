import React, { useState } from 'react';
 
import { useToast } from '@chakra-ui/react'; // Keep Chakra UI's useToast for consistency
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [regions, setRegions] = useState('');
  const [crops, setCrops] = useState('');

  const exampleRegions = ['Midwest', 'Northeast', 'South', 'West'];
  const exampleCrops = ['Corn', 'Soybeans', 'Wheat', 'Rice'];

  const toast = useToast(); // Keep Chakra UI's useToast for consistency
  const navigate = useNavigate();

  const handleRegistration = async () => {
    try {
      if (!email || !password || !displayName || !regions || !crops) {
        throw new Error('Please fill in all the required fields.');
      }

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

      toast({
        title: 'Registration Successful',
        description: `${displayName} is registered as a farmer.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      // Redirect to the main page after successful registration
      navigate('/');

      // Reset form (optional)
      setEmail('');
      setPassword('');
      setDisplayName('');
      setRegions('');
      setCrops('');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div className="container mx-auto p-8"> {/* Main container for spacing */}
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-center">
        <div className="md:w-1/2 mb-6 md:mb-0"> 
          <img
            src="/images/imge1.jpg"
            alt="Farm Background"
            className="rounded-lg object-cover h-34 w-full" 
          />
        </div>

        <div className="md:w-1/2 md:ml-8"> {/* Form section */}
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Farmer Registration
          </h2>
          <div className="space-y-4">
            {/* Individual Input Fields */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border border-gray-300 px-4 py-2 focus:outline-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-700 mb-2">password</label>
              <input
                type="password"
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md border border-gray-300 px-4 py-2 focus:outline-blue-500"
              />
            </div>
            <div className="flex flex-col">
    <label htmlFor="displayName" className="text-gray-700 mb-2">Display Name</label>
    <input
        type="text" 
        id="displayName" 
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="rounded-md border border-gray-300 px-4 py-2 focus:outline-blue-500"
    />
</div>

            {/* Select Inputs */}
            <div className="flex flex-col">
              <label htmlFor="regions" className="text-gray-700 mb-2">Regions</label>
              <select
                id="regions"
                className="rounded-md border border-gray-300 px-4 py-2 focus:outline-blue-500"
                required
                value={regions}
                onChange={(e) => setRegions(e.target.value)}
              >
                <option value="" disabled>
                  Select Region
                </option>
                {exampleRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Input for Crops */}
            <div className="flex flex-col">
              <label htmlFor="crops" className="text-gray-700 mb-2">Crops</label>
              <select
                id="crops"
                className="rounded-md border border-gray-300 px-4 py-2 focus:outline-blue-500"
                required
                value={crops}
                onChange={(e) => setCrops(e.target.value)}
              >
                <option value="" disabled>
                  Select Crop
                </option>
                {exampleCrops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
              onClick={handleRegistration}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default Register;



