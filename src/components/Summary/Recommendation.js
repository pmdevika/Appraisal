import React, { useState, useEffect } from 'react';
import './Recommendation.css';
import userImage from '../../assets/user_circle.png';
import logoImage from '../../assets/shg.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function Grading() {
  const [tableData, setTableData] = useState([
    { point: 'Suitability for continuing the services of the appraisee', recommendations: '' },
    { point: 'Suitability of the appraisee for higher responsibilities (if applicable)', recommendations: '' },
    { point: 'Suitability of the appraisee for higher pay', recommendations: '' },
  ]);
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
  const [stage, setStage] = useState(0);
  const { uid } = useParams();
  const navigate = useNavigate();

  // Function to handle changes in the recommendation column
  const handleRecommendationChange = (index, value) => {
    if (stage === 3 || stage > 3) {
      const updatedTableData = [...tableData];
      updatedTableData[index].recommendations = value;
      setTableData(updatedTableData);
    }
  };

  useEffect(() => {
    axios.get(`https://appbackend-rala.onrender.com/finalsubmit/stagestatus/${uid}`)
      .then(response => {
        console.log(response.data);
        setStage(response.data.stage);
      })
      .catch(error => {
        console.error('Error fetching stage status:', error);
      });
  }, [uid]);

  // ... (rest of the code remains unchanged)
   const [id, setId] = useState('');


  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isReviewer = role !== 'reviewer';
  const isEd = role==='ed'
  const [newname, setNewName] = useState('');

  useEffect(() => {
    // Retrieve the token, ID, and role from local storage
    const token = localStorage.getItem('token');
    const ID = localStorage.getItem('ID');
    const role = localStorage.getItem('role');

    const userId = uid; // Replace with the actual user ID you want to fetch
    const apiUrl = `https://appbackend-rala.onrender.com/getuname/${userId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log('User Name:', response.data[0].Name);
        setNewName(response.data[0].Name);
      })
      .catch((error) => {
        console.error('Error fetching user name:', error);
      });

    // Set the default Authorization header for Axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setId(ID);

    if (!isReviewer) {
      axios
        .get(`https://appbackend-rala.onrender.com/recommendations/get-recommendations/${uid}`)
        .then((response) => {
          console.log(response);
          const data = response.data.recommendations;

          const newRecommendations = [
            {
              point: 'Suitability for continuing the services of the appraisee',
              recommendations: data.continuingServices,
            },
            {
              point: 'Suitability of the appraisee for higher pay',
              recommendations: data.higherPay,
            },
            {
              point: 'Suitability of the appraisee for higher responsibilities (if applicable)',
              recommendations: data.higherResponsibilities,
            },
          ];

          setTableData(newRecommendations);
        })
        .catch((error) => {
          console.error('Error fetching recommendations:', error);
        });
    }

  }, [isReviewer, setId, uid]);

  // Function to handle form submission
  const handleSubmit = () => {
    // Prepare the data to send to the server
    const recommendationData = {
      appraiseeId: uid,
      continuingServices: tableData[0].recommendations,
      higherResponsibilities: tableData[1].recommendations,
      higherPay: tableData[2].recommendations,
    };

    axios
      .post('https://appbackend-rala.onrender.com/recommendations/submit-recommendation', recommendationData)
      .then((response) => {
        console.log('Recommendations Saved');
        setFormSubmitted(true);
        alert('Data saved successfully');
      
        if (isEd) {
          // Redirect HR to the acceptance page
          navigate('/acceptance');
        }

      
        
      }
      )
      
      .catch((error) => {
        console.error('Error saving recommendations:', error);
      });

      axios.put(`https://appbackend-rala.onrender.com/finalsubmit/final-review-completed/${uid}`,)
      .then((response) => {
        alert('Data finally saved to the database.');
        window.location.href = '/reviewinglist';
      })
      .catch((error) => {
        // Handle any errors (e.g., display an error message)
        console.error('Failed to save data:', error);
      });


  };

  return (
    <div className="main-body">
      <div className="sidebar">
        <img src={logoImage} alt="Example" className="logoimage" style={{ width: "7.5vw" }} />
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
          <h1 className="name" style={{ marginRight: 600, marginTop: 30 }}>
            Recommendation
          </h1>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: '100px' }}>
            <img src={userImage} alt="Example" className="profileimage" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="name">{id}</h3>
              <p className="name" style={{ fontWeight:300, fontSize:16, marginTop: -15 }}>
                {role}
              </p>
            </div>
          </div>
        </div>
        <div className="break"></div>
        <div className="bottom">
          <div className="profile-page">
            <table>
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#212A3E" }}>Point to be considered</th>
                  <th style={{ backgroundColor: "#212A3E" }}>Recommendation of the Performance Appraisal</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((rowData, index) => (
                  <tr key={index}>
                    <th className="sbox2">
                      <td style={{ backgroundColor: "#212A3E", width: "50vw", border: "Transparent" }}>{rowData.point}</td>
                    </th>
                    <td style={{ backgroundColor: "#212A3E" }}>
                      <input
                        className="sbox2"
                        type="text"
                        style={{ backgroundColor: "#212A3E", width: "45vw", color: "white" }}
                        disabled={isReviewer || (stage === 10 || stage > 3)}
                        value={rowData.recommendations}
                        onChange={(e) => handleRecommendationChange(index, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="profile-section">
              {!isReviewer && !formSubmitted && (
                <button type="button" onClick={handleSubmit} className="submit-button" style={{ width: '10vw' }}>
                  Final Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
