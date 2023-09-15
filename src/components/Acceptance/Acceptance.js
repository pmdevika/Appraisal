import React, { useState, useEffect } from 'react';
import './Acceptance.css';
import userImage from '../../assets/user_circle.png'; // Import the image
import logoImage from '../../assets/shg.png';
import axios from 'axios';

export default function Grading() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [date, setDate] = useState('');
  const [period, setPeriod] = useState('');
  const [review, setReview] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [tableData, setTableData] = useState([
    {
      point: 'Suitability for continuing the services of the appraisee',
      recommendation: '',
      accepted: '',
      actionTaken: '',
    },
    {
      point:
        'Suitability of the appraisee for higher responsibilities (if applicable)',
      recommendation: '',
      accepted: '',
      actionTaken: '',
    },
    {
      point: 'Suitability of the appraisee for higher pay',
      recommendation: '',
      accepted: '',
      actionTaken: '',
    },
  ]);
  

  

  const [id, setId] = useState('');
  const [recommendations, setRecommendations] = useState([]); // State to store recommendations

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const nothr = role !== 'hr';

  useEffect(() => {
    // Retrieve the token, ID, and role from local storage
    const token = localStorage.getItem('token');
    const ID = localStorage.getItem('ID');
    const role = localStorage.getItem('role');

    // Set the default Authorization header for Axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setId(ID);
    fetchKnowledgeQuestions();
  },[]);
  const fetchKnowledgeQuestions = async () => {
    try {
      const response = await axios.get(`https://appbackend-rala.onrender.com/performanceappraisal/save-acceptance-and-action/${"64fd8e3b9a14a681cba43ad3"}`);
      const questions = response.data.questions;
  
      // Map questions to tableData
      const newTableData = questions.map((question) => ({
        point: question.parameter,
        recommendation: question.recommendation,
        accepted: '',
        actionTaken: '',
      }));
  
      setTableData(newTableData);
    } catch (error) {
      console.error('Error fetching knowledge questions:', error);
    }
  };
  
    // Fetch recommendations data based on appraiseeId
    // if (nothr) {
  //     axios
  //       .get(`https://appbackend-rala.onrender.com/recommendations/get-recommendations/${"64fd8e3b9a14a681cba43ad3"}`) // Replace with your API endpoint
  //       .then((response) => {
  //         const data = response.data;
  //         setRecommendations(data);
  //         console.log('Recommendations:', data);
  //         const recommendationsArray = [
  //           {
  //             point: 'Suitability for continuing the services of the appraisee',
  //             details: data.continuingServices,
  //           },
  //           {
  //             point: 'Suitability of the appraisee for higher responsibilities (if applicable)',
  //             details: data.higherResponsibilities,
  //           },
  //           {
  //             point: 'Suitability of the appraisee for higher pay',
  //             details: data.higherPay,
  //           },
  //           // Add more entries for other points if needed
  //         ];
  
  //         setRecommendations(recommendationsArray);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching recommendations:', error);
  //       });
  //   }
  // }, [nothr, setId]);

  // Function to handle changes in HR's input for "Accepted/Not Accepted"
  const handleAcceptedChange = (index, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].accepted = value;
    setTableData(updatedTableData);
  };

  // Function to handle changes in HR's input for "If not accepted, what action is to be taken"
  const handleActionTakenChange = (index, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].actionTaken = value;
    setTableData(updatedTableData);
  };

  // const handleSubmit = async () => {
  //   try {
  //     if (nothr) {
  //       // Show an alert if the user is not an HR
  //       alert('Only HR can submit this form.');
  //       return;
  //     }

  //     // Extract the relevant data (accepted and actionTaken) from tableData
  //     const hrData = tableData.map((rowData) => ({
  //       accepted: rowData.accepted,
  //       actionTaken: rowData.actionTaken,
  //     }));

  //     // Make a POST request to send the HR input data to the server
  //     const response = await axios.post(
  //       'http://localhost:3005/hrRouter/submit-hr-data',
  //       {
  //         appraiseeId: id, // You can include the appraiseeId if needed
  //         hrData, // Send the HR input data
  //       }
  //     );

  //     console.log('HR Input Saved');
  //     // Handle success, e.g., show a success message to the user
  //   } catch (error) {
  //     console.error('Error saving HR input:', error);
  //     // Handle errors, e.g., show an error message to the user
  //   }
  // };

  return (
    <div className="main-body">
      <div className="sidebar">
        {/* Sidebar content */}
        <img src={logoImage} alt="Example" className="logoimage" />
        {/* ... (rest of your sidebar) ... */}
      </div>

      <div className="right">
        <div className="top">
          {/* Display the image */}
          <h1 className="name" style={{ marginRight: 600, marginTop: 30 }}>
            Acceptance
          </h1>
          {/* ... (rest of your top section) ... */}
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
                      <input
                        className="smallbox-input"
                        type="text"
                        value={rowData.accepted}
                        disabled={nothr}
                        onChange={(e) =>
                          handleAcceptedChange(index, e.target.value)
                        }
                      />
                    </td>
                    <td className="smallbox">
                      <input
                        className="smallbox-input"
                        type="text"
                        disabled={nothr}
                        value={rowData.actionTaken}
                        onChange={(e) =>
                          handleActionTakenChange(index, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              {/* Your other content */}
            </div>

            <div className="profile-section">
              <button type="submit">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

