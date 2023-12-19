import React, { useState, useEffect, useRef } from 'react';

function ListUsers() {
  // This await fetch the data from the server that has Users
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3010/users');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  // Returns the data, otherwise will return null
  return data;
}

export default function View_ManageUsers() {
  const viewRef = useRef(null);
  const [refVisible, setRefVisible] = useState(false)
  const [availableWidthHeight, setAvailableWidthHeight] = useState([null, null]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  // State to hold the data to be sent
  const [userData, setUserData] = useState({
    id: null,
    name: null,
  });


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
      console.log('POST request successful. Response:', data);

      // Clear the input fields after handling
      setUserId('');
      setUserName('');

    } catch (error) {
      console.error('Error during POST request:', error.message);
    }
  }

  const handleIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleAddUserClick = () => {
    // Do something with the user input (e.g., send to server, update state)
    console.log('ID:', userId);
    console.log('Name:', userName);

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
  
    // Clear the input fields after handling
    setUserId('');
    setUserName('');
  };

  useEffect(() => {
    // Check if userData has changed
    if (userData.id !== null && userData.name !== null) {
      // Perform the POST request
      handleAddUserRequest(userData);
  
      // Clear the input fields after handling
      setUserId('');
      setUserName('');
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
  let listUsers = ListUsers();
  let ids = [];
  let names = [];
  if (listUsers !== null) {
    // Order the users by ID
    listUsers.sort((a, b) => a.id - b.id);

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
      <tr key={index}>
        <td style={{ width: '50%', textAlign: 'center', border: '1px solid #000' }}>{id}</td>
        <td style={{ width: '50%', textAlign: 'center', border: '1px solid #000' }}>{name}</td>
      </tr>
    );
  }

  let div_list_users = (
      <table>
        <thead>
          <tr >
            <th style={{ textAlign: 'center', border: '1px solid #000' }}>User ID</th>
            <th style={{ textAlign: 'center', border: '1px solid #000' }}>User Name</th>
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
      style={{ width: availableWidthHeight[0] + 'px', height: availableWidthHeight[1] + 'px', border: '1px solid #000'}} >
        {availableWidthHeight[0] && (
          <div>
            <div>
              <label>
                ID:
                <input type="text" value={userId} onChange={handleIdChange} />
              </label>
              <br />
              <label>
                Name:
                <input type="text" value={userName} onChange={handleNameChange} />
              </label>
              <br />
              <button style={{ p: '2px' }} onClick={handleRemoveUserClick}>Remove user</button>
              <button style={{ p: '2px' }} onClick={handleAddUserClick}>Add user</button>
            </div>
            <p>Users list</p>
            {div_list_users}
          </div>)}
    </div>
  );
};
