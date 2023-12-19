import React, { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function View_ManageUsers() {
  const viewRef = useRef(null);
  const [listUsers, setListUsers] = useState(null);
  const [listUsersUpdated, setListUsersUpdated] = useState(false);
  const [refVisible, setRefVisible] = useState(false)
  const [availableWidthHeight, setAvailableWidthHeight] = useState([null, null]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [showPopupAddUser, setShowPopupAddUser] = useState(false);
  const [showPopupRemoveUser, setShowPopupRemoveUser] = useState(false);

  // const handleExportClick = () => {
  //   if (viewRef.current) {
  //     htmlToImage.toPng(viewRef.current)
  //       .then((dataUrl) => {
  //         // Create a temporary link element and trigger a download
  //         const link = document.createElement('a');
  //         link.href = dataUrl;
  //         link.download = 'exported_map.png';
  //         link.click();
  //       })
  //       .catch((error) => {
  //         console.error('Error exporting map:', error);
  //       });
  //   }
  // };

  // State to hold the data to be sent
  const [userData, setUserData] = useState({
    id: null,
    name: null,
  });

  const closePopupAddUser = () => {
    setListUsersUpdated(false);
    setListUsers(null);
    setUserId('');
    setUserName('');

    // Close the popup
    setShowPopupAddUser(false);
  };

  const closePopupRemoveUser = () => {
    setListUsersUpdated(false);
    setListUsers(null);
    setUserId('');
    setUserName('');
    
    // Close the popup
    setShowPopupRemoveUser(false);
  };

  // Function to handle the POST request
  async function handleAddUserRequest(postData) {
    try {
      const response = await fetch('http://localhost:3010/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setShowPopupAddUser(true);

    } catch (error) {
      console.error('Error during POST request:', error.message);
    }
  }

  const handleIdChange = (e) => {
    
    let value = e.target.value;

    // Check if the input value is an integer
    if (!isNaN(value) && Number.isInteger(parseFloat(value))) {
      setUserId(value);
    }
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleAddUserClick = () => {
    // Do something with the user input (e.g., send to server, update state)
    console.log('ID:', userId);
    console.log('Name:', userName);

    if (userId === '' || userName === '') {
      return;
    }

    setUserData({id: userId, name: userName})
  };

  const handleDeleteRequest = async (userIdToDelete) => {
    try {
      const response = await fetch(`http://localhost:3010/users/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('DELETE request successful.');

      setShowPopupRemoveUser(true);

    } catch (error) {
      console.error('Error during DELETE request:', error.message);
    }
  };

  const handleRemoveUserClick = () => {
    // Do something with the user input (e.g., send to server, update state)
    console.log('ID:', userId);
    console.log('Name:', userName);
  
    // Perform the DELETE request with the specified user ID
    handleDeleteRequest(userId);
  
  };

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3010/users');
        const result = await response.json();
  
        if (isMounted) {
          setListUsers(result);
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Check if userData has changed
    if (userData.id !== null && userData.name !== null) {
      // Perform the POST request
      handleAddUserRequest(userData);

    }
  }, [userData]);
  
  useEffect(() => {
    if (!refVisible) { 
      return
    }

    if (viewRef.current) {
      const parentWidth = viewRef.current.offsetWidth;
      const parentOffsetLeft = viewRef.current.offsetLeft;
      const newAvailableWidth = window.innerWidth - parentOffsetLeft - parentWidth;

      const parentHeight = viewRef.current.parentElement.offsetHeight;
      const parentOffsetTop = viewRef.current.parentElement.offsetTop;
      const newAvailableHeight = window.innerHeight - parentOffsetTop - parentHeight;
      setAvailableWidthHeight([newAvailableWidth, newAvailableHeight]);
    }
  }, [refVisible]); // Run when refVisible changes

  // Get the list of users
  let ids = [];
  let names = [];

  if (!listUsersUpdated && listUsers) {
    setListUsersUpdated(true);

    // Order the users by ID
    listUsers.sort((a, b) => a.id - b.id);

    for (const user of listUsers) {
      ids.push(user.id)
      names.push(user.name)
    }


  } else if (listUsersUpdated) {
    for (const user of listUsers) {
      ids.push(user.id)
      names.push(user.name)
    }
  }

  // Created table rows with the users data
  const rows_users = [];
  for (let index = 0; index < ids.length; index++) {
    const id = ids[index];
    const name = names[index];
    rows_users.push(
      <tr key={index} >
        <td style={{ width: '50%', textAlign: 'center', border: '1px solid #000' }}>{id}</td>
        <td style={{ width: '50%', textAlign: 'center', border: '1px solid #000' }}>{name}</td>
      </tr>
    );
  }

  let users_list = (
    <table style={{ marginLeft: '0', width: '100%' }}>
      <thead >
        <tr >
          <th style={{ textAlign: 'center', border: '1px solid #000', width: '50%' }}>User ID</th>
          <th style={{ textAlign: 'center', border: '1px solid #000', width: '50%' }}>User Name</th>
        </tr>
      </thead>
      <tbody>
        {rows_users}
      </tbody>
    </table>
  );

  return (
    <div
      ref={el => { viewRef.current = el; setRefVisible(true); }}
      style={{ width: availableWidthHeight[0] + 'px', height: availableWidthHeight[1] + 'px'}} >

      {availableWidthHeight[0] && (

        <div style={{ width: '300px', textAlign: 'left', margin: '4px', paddingLeft: '4px', paddingTop: '4px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', margin: '2px', width: '100%' }}>
            <span style={{ marginLeft: '0', fontWeight: 'bold' }}>ID:</span>
            <input type="text" placeholder="a numeric integer" value={userId} onChange={handleIdChange} style={{ marginLeft: '10px', width: '75%', boxSizing: 'border-box', textAlign: 'right' }} />
          </label>

          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', margin: '2px', width: '100%' }}>
            <span style={{ marginLeft: '0', fontWeight: 'bold' }}>Name:</span>
            <input type="text" placeholder="user name" value={userName} onChange={handleNameChange} style={{ marginLeft: '10px', width: '75%', boxSizing: 'border-box', textAlign: 'right' }} />
          </label>

          <div style={{ display: 'flex', justifyContent: 'right', textAlign: 'left', marginTop: '6px', width: '100%' }}>
            <button disabled={userId === ''} style={{ padding: '4px' }} onClick={handleRemoveUserClick}>Remove user</button>
            
            {/* To add a bit of space between the buttons */}
            <span style={{ marginRight: '6px' }}></span>

            <button disabled={userId === '' || userName === ''} style={{ padding: '4px' }} onClick={handleAddUserClick}>Add user</button>
          </div>

          <div style={{ width: '300px', textAlign: 'left', paddingTop: '30px'}}>
            <span style={{fontWeight: 'bold'}} >Users list:</span>
            {users_list}
          </div>

          <Dialog open={showPopupAddUser} onClose={closePopupAddUser} >
            <DialogTitle>User added</DialogTitle>
            <DialogContent>
              <DialogContentText>
                User added successfully! Refresh the page.
              </DialogContentText>
            </DialogContent>
          </Dialog>

          <Dialog open={showPopupRemoveUser} onClose={closePopupRemoveUser} >
            <DialogTitle>User removed</DialogTitle>
            <DialogContent>
              <DialogContentText>
                User removed successfully! Refresh the page.
              </DialogContentText>
            </DialogContent>
          </Dialog>

        </div>
      )}
    </div>
  );
};
