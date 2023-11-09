import React, { useState, useEffect } from 'react';
import './Acceptance.css';
import userImage from '../../assets/user_circle.png'; // Import the image
import logoImage from '../../assets/shg.png';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Grading() {
  const [name, setName] = useState('');
  const [newname, setNewName] = useState('');
  const [position, setPosition] = useState('');
  const [date, setDate] = useState('');
  const [period, setPeriod] = useState('');
  const [review, setReview] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const { uid } = useParams();
  const [selectedOption, setSelectedOption] = useState(false);

  const [tableData, setTableData] = useState([
    { point: 'Suitability for continuing the services of the appraisee', accepted: 'true', actionTaken: '' },
    { point: 'Suitability of the appraisee for higher responsibilities (if applicable)', accepted: 'true', actionTaken: '' },
    { point: 'Suitability of the appraisee for higher pay', accepted: 'true', actionTaken: '' },
  ]);

  const [id, setId] = useState('');
  const [recommendations, setRecommendations] = useState([]); // State to store recommendations

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const nothr = role === 'reviewer';
  const points = tableData.map((item) => item.point);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Retrieve the token, ID, and role from local storage
    const token = localStorage.getItem('token');
    const ID = localStorage.getItem('ID');
    const role = localStorage.getItem('role');

    // Set the default Authorization header for Axios
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

    // Fetch recommendations data based on appraiseeId
    if (nothr) {
      axios
      axios.get(`https://appbackend-rala.onrender.com/recommendations/get-recommendations/${uid}`)
      // Replace with your API endpoint
        .then((response) => {
          console.log(response);
          const data = response.data.recommendations;
          setRecommendations(data);
          console.log('Recommendations:', data);
          
        
          
          const recommendations = [
            {
              point: 'Suitability for continuing the services of the appraisee',
              details: data.continuingServices,
            },
            {
              point: 'Suitability of the appraisee for higher pay',
              details: data.higherPay,
            },
            {
              point: 'Suitability of the appraisee for higher responsibilities (if applicable)',
              details: data.higherResponsibilities,
            },
          
            // Add more entries for other points if needed
          ];
  
          setRecommendations(recommendations);
          console.log("after",recommendations);
        })
        .catch((error) => {
          console.error('Error fetching recommendations:', error);
        });
    }
  }, [nothr, setId]);

  // Function to handle changes in HR's input for "Accepted/Not Accepted"
  const handleAcceptedChange = (index, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].accepted = value;
    setTableData(updatedTableData);
    // Reset the error when the user changes the value
    setIsError(false);
  };

  // Function to handle changes in HR's input for "If not accepted, what action is to be taken"
  const handleActionTakenChange = (index, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].actionTaken = value;
    setTableData(updatedTableData);
  };

  const handleSubmit = async () => {
    try {
      if (!nothr) {
        // Show an alert if the user is not an HR
        alert('Only HR can submit this form.');
        return;
      }
  
      // Check if the 3rd column is true and the 4th column is empty for any row
      const isMandatoryFieldEmpty = tableData.some((rowData) => rowData.accepted === 'false' && !rowData.actionTaken);
  
      if (isMandatoryFieldEmpty) {
        // Set the error state to true to display the error message
        setIsError(true);
        return;
      }
  
      // Extract the relevant data (accepted and actionTaken) from tableData
      const data = tableData.map((rowData, index) => ({
        pointToConsider: rowData.point,
        recommendation: recommendations[index]?.details,
        accepted: rowData.accepted,
        actionIfNotAccepted: rowData.actionTaken,
      }));
      
      console.log(data);
      // Make a POST request to send the HR input data to the server
      axios.post(
        `https://appbackend-rala.onrender.com/performanceappraisal/save-acceptance-and-action/${uid}`,
        {
          data, // Send the HR input data
        }
      );
      
  
      console.log('HR Input Saved');
      // Handle success, e.g., show a success message to the user
    } catch (error) {
      console.error('Error saving HR input:', error);
      // Handle errors, e.g., show an error message to the user
    }
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
       <div>
        <h2>{newname}</h2>
       </div>
        <h1 className='name' style={{ marginRight: 600, marginTop: 30 }}>Acceptance</h1>
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
            {/* Insert the table here */}
            <table>
              <thead>
                <tr>
                  <th className="smallbox2">Point to be considered</th>
                  <th className="smallbox2">
                    Recommendation of the Performance Appraisal
                  </th>
                  <th className="smallbox2">Accepted/Not Accepted</th>
                  <th className="smallbox1">
                    If not accepted, what action is to be taken
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((rowData, index) => (
                  <tr key={index}>
                    <td className="smallbox">{rowData.point}</td>
                    <td className="smallboxn">{recommendations[index]?.details}</td>
                    <td className="smallbox">
                      <select value={rowData.accepted} onChange={(e) => handleAcceptedChange(index, e.target.value)} className="smallbox-input" style={{ color: "white" }}>
                        <option value="true" style={{ color: "black" }}>true</option>
                        <option value="false" style={{ color: "black" }}>false</option>
                      </select>
                    </td>
                    <td className="smallbox">
                      <input
                        className="smallbox-input"
                        type="text"
                        style={{ color: "white" }}
                        disabled={rowData.accepted === 'true'} // Disable when accepted is true
                        value={rowData.actionTaken}
                        onChange={(e) => handleActionTakenChange(index, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isError && (
              <div className="error-message">Please fill in the 4th column for rows where the 3rd column is 'false'.</div>
            )}
            <div className="profile-section">
              <button type="submit" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
