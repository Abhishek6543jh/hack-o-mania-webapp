import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase/config';
import { collection, doc, getDocs, getDoc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [assignedFolders, setAssignedFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const fetchAssignedFolders = async () => {
      setIsLoading(true);
      setErrorStatus(null);

      try {
        const user = auth.currentUser;

        if (!user) {
          navigate('/');
          return;
        }

        const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const assignedFoldersArray = userData.assignedFolders || [];

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
          navigate('/');
        }
      } catch (error) {
        setErrorStatus('Error fetching assigned folders: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignedFolders();
  }, [navigate]);

  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.value);
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFolder || !uploadFile || !description) {
        console.error('Selected folder, file, or description is not valid');
        return;
      }

      const folderRef = ref(storage, `folder_uploads/${selectedFolder}/${uploadFile.name}`);
      await uploadBytes(folderRef, uploadFile);

      const downloadURL = await getDownloadURL(folderRef);

      const folderDocRef = doc(db, 'folders', selectedFolder);
      await updateDoc(folderDocRef, {
        uploads: arrayUnion({ fileName: uploadFile.name, downloadURL, description }),
      });

      setSelectedFolder(null);
      setUploadFile(null);
      setDescription('');

      // Display a success toast notification
      toast.success('File uploaded successfully!', { position: 'top-right' });
    } catch (error) {
      console.error('Error uploading file:', error.message);

      // Display an error toast notification
      toast.error(`Error uploading file: ${error.message}`, { position: 'top-right' });
    }
  };

  const findFolderName = (folderId) => {
    const selectedFolder = assignedFolders.find((folder) => folder.id === folderId);
    return selectedFolder ? selectedFolder.name : '';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Farmer Dashboard</h2>
      {isLoading && <p>Loading assigned folders...</p>}
      {errorStatus && <p className="error-message">{errorStatus}</p>}

      {!isLoading && !errorStatus && (
        <div style={styles.formContainer}>
          <div style={styles.fileExplorer}>
            <div style={styles.folderList}>
              <h3>Folders:</h3>
              {assignedFolders.map((folder) => (
                <div
                  key={folder.id}
                  style={selectedFolder === folder.id ? { ...styles.folderItem, ...styles.selectedFolderItem } : styles.folderItem}
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <span>{folder.name}</span>
                </div>
              ))}
            </div>
            {selectedFolder && (
              <div style={styles.folderDetails}>
                <label style={styles.label}>Selected Folder:</label>
                <div style={styles.selectedFolder}>{selectedFolder && findFolderName(selectedFolder)}</div>
                <label style={styles.label}>Upload File:</label>
                <input type="file" onChange={handleFileChange} style={styles.fileInput} />
                <label style={styles.label}>Description:</label>
                <textarea value={description} onChange={handleDescriptionChange} style={styles.textArea} />
                <button onClick={handleUpload} style={styles.uploadButton}>
                  Upload
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};


const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    color: '#555',
  },
  select: {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  fileExplorer: {
    display: 'flex',
  },
  folderList: {
    flex: '1',
    marginRight: '20px',
  },
  folderItem: {
    marginBottom: '8px',
    cursor: 'pointer',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  folderDetails: {
    flex: '2',
  },
  selectedFolderItem: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  selectedFolder: {
    marginBottom: '16px',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  textArea: {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    resize: 'vertical',
  },
};

export default FarmerDashboard;
