import React, { useState, useEffect } from 'react';
import './Summary_qgrading.css';
import logoImage from '../../assets/shg.png';
import userImage from '../../assets/user_circle.png'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function Grading() {
  const [tableData, setTableData] = useState({
    knowledgeParameters: { maxScore: '', selfScore: '', evaluatorScore: '', reviewerScore: '', finalScore: '', comments: '' },
    professionalIntegrity: { maxScore: '', selfScore: '', evaluatorScore: '', reviewerScore: '', finalScore: '', comments: '' },
    responsibilityFulfillment: { maxScore: '', selfScore: '', evaluatorScore: '', reviewerScore: '', finalScore: '', comments: '' },
  });
    const { uid } = useParams();
    const [newname, setNewName] = useState('');
    
  const [id, setId] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => {
    // Retrieve the token and ID from local storage
    const token = localStorage.getItem('token');
    const ID = localStorage.getItem('ID');
    const role = localStorage.getItem('role');

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    ;
    setId(ID);

    const userId = uid; // Replace with the actual user ID you want to fetch
    const apiUrl = `https://appbackend-rala.onrender.com/getuname/${userId}`;
    
    axios.get(apiUrl)
      .then(response => {
        // Handle the successful response here
        console.log('hi');
        console.log('User Name:', response.data[0].Name);
        setNewName(response.data[0].Name)
        
        console.log('hii');
      })
      .catch(error => {
        // Handle errors here
        console.error('Error fetching user name:', error);
      });
    
    // Set the default Authorization header for Axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch recommendations data based on appraiseeId
    if (role=== 'reviewer') {
      axios
        .get(`https://appbackend-rala.onrender.com/summary/get-table-data/${uid}`)
        .then((response) => {
          const data = response.data;

          // Update the state with the fetched data for each category
          setTableData((prevTableData) => ({
            ...prevTableData,
            knowledgeParameters: data.knowledgeParameters,
            professionalIntegrity: data.professionalIntegrity,
            responsibilityFulfillment: data.responsibilityFulfillment,
          }));

          console.log('Fetched Data:', data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, []);
  const navigate = useNavigate();
  
  const handleSubmit = () => {
    // Implement your submission logic here
    // You can send the data to your backend or perform any other necessary actions
    console.log('Submit button clicked');
    window.location.href = `/feedback/${uid}`
  };

  // Function to handle the "Next" button click
  

  // Function to handle input changes in the "comments" field
  const handleCommentsChange = (category, value) => {
    setTableData((prevTableData) => ({
      ...prevTableData,
      [category]: {
        ...prevTableData[category],
        comments: value,
      },
    }));
  };


  return (
    <div className="main-body">
      <div className="sidebar">
      {/* Sidebar content */}
      <img src={logoImage} alt="Example" className='logoimage' style={{width:"7.5vw"}}/>
      <div className="sidebar-item" style={{ marginTop: 50 }}>
        <i className="material-icons"></i>
        <span>Dashboard</span>
      </div>
      <div className="sidebar-item">
        <i className="material-icons"></i>
        <span>Self Appraisal</span>
      </div>
      <div className="sidebar-item">
        <i className="material-icons"></i>
        <span>Team</span>
      </div>
    </div>

      <div className="right">
        <div className="top">
          {/* Display the image */}
          <h1 className="name" style={{ marginRight: 600, marginTop: 30 }}>
            Summary
          </h1>
          {/* ... (rest of your top section) ... */}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: '100px' }}>
          <img src={userImage} alt="Example" className='profileimage' />

          {/* Display the name and id */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className='name'>{id}</h3>
            <p className='name' style={{ fontWeight: 300, fontSize: 16, marginTop: -15 }}>{role}</p>
          </div>
        </div>
        </div>
        <div className="break"></div>
        <div className="bottom">
          <div className="profile-page">
            <table>
              <thead>
                <tr>
                  <th className="smallbox2">Category</th>
                  <th className="smallbox2">Maximum Score</th>
                  <th className="smallbox2">Self Score</th>
                  <th className="smallbox2">Evaluator Score</th>
                  <th className="smallbox2">Reviewer Score</th>
                  <th className="smallbox2">Final Score</th>
                 
                </tr>
              </thead>
              <tbody>
                {Object.keys(tableData).map((category) => (
                  <tr key={category}>
                    <td className="smallbox">{category}</td>
                    <td className="smallbox">{tableData[category].maxScore}</td>
                    <td className="smallbox">{tableData[category].selfScore}</td>
                    <td className="smallbox">{tableData[category].evaluatorScore}</td>
                    <td className="smallbox">{tableData[category].reviewerScore}</td>
                    <td className="smallbox">{tableData[category].finalScore}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              {/* Your other content */}
            </div>

            <div className="profile-section">
            <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
