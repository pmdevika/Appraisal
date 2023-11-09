import React, { useState,useEffect } from 'react';
import './Recommendation.css';
import userImage from '../../assets/user_circle.png'; // Import the image
import logoImage from '../../assets/shg.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function Grading() {
  const [tableData, setTableData] = useState([
    { point: 'Areas of strength of the appraisee that need nurturing', feedback: '' },
    { point: 'Areas where the appraisee needs to take action for improvements, and suggested steps', feedback: '' },
   
  ]);
  
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission

  // Function to handle changes in the recommendation column
  const handleFeedbackChange = (index, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].feedback = value;
    setTableData(updatedTableData);
  };
  const [id, setId] = useState('');
  const { uid } = useParams();
  const navigate = useNavigate();
  const [newname, setNewName] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isReviewer = role !== 'reviewer';
  
  useEffect(() => {
    // Retrieve the token, ID, and role from local storage
    const token = localStorage.getItem('token');
    const ID = localStorage.getItem('ID');
    const role = localStorage.getItem('role');

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
    setId(ID);
  }, []);

  if (!isReviewer) {
    axios
      .get(`https://appbackend-rala.onrender.com/feedback/getfeedback/${uid}`)
      .then((response) => {
          const feedbackData = response.data;

          // Assuming feedbackData has fields for strengths and improvements
          // Update the tableData with feedback values
          setTableData([
            { point: 'Areas of strength of the appraisee that need nurturing', feedback: feedbackData.strengths },
            { point: 'Areas where the appraisee needs to take action for improvements, and suggested steps', feedback: feedbackData.improvements },
          ]);
        })
      .catch((error) => {
        console.error('Error fetching feedbacks:', error);
      });
  }
  
  // Function to handle form submission
  const handleSubmit = () => {
    // Prepare the data to send to the server
    const feedbackData = {
      appraiseeId: uid,
      strengths: tableData[0].feedback,
      improvements: tableData[1].feedback,
      
    };
    console.log('feedback Data:', feedbackData);
    // Send a POST request to your server to save the recommendations
    axios
      .post('https://appbackend-rala.onrender.com/feedbackRouter/submit-feedback',feedbackData)
      .then((response) => {
        console.log('server response:',response)
        console.log('feedback Saved');
        // Navigate to the next page (if needed)
        window.location.href = `/recommendation/${uid}`;
      })
      .catch((error) => {
        console.error('Error saving feedbacks:', error);
      });
  };
  
  const handlechange = () => {
    // Handle saving the data here (you can send a request to your API)
    // For example, you can send a POST request to your server to save the feedback.
    // You can also include strengthInput1 and strengthInput2 in the request body.
    
    console.log('');
    
    window.location.href = `/recommendation/${uid}`;
  };

  return (
    <div className="main-body">
      {/* ... (rest of your code) ... */}
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
          <h1 className='name' style={{ marginRight: 600, marginTop: 30 }}>Feedback</h1>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: '100px' }}>
            <img src={userImage} alt="Example" className='profileimage' />

            {/* Display the name and id */}
           <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="name">{id}</h3>
              <p className="name" style={{ fontWeight: 300, fontSize: 16, marginTop: -15 }}>
                {role}
              </p>
            </div>
          </div>
        </div>
        <div className="break"></div>
        <div className="bottom">
          <div className="profile-page">
            {/* Insert the table here */}
            <table className='table1' st>
              <thead>
                <tr>
                  <th className='ssbox2' style={{backgroundColor:"#212A3E"}}>Point to be considered</th>
                  <th className='ssbox2'style={{backgroundColor:"#212A3E",width:"50vw"}}>Feedback to the Performance Appraisal</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((rowData, index) => (
                  <tr style={{border:"none"}} key={index} >
                  <th className='ssbox2' style={{backgroundColor:"#212A3E"}}>
                    <td style={{border:"none",backgroundColor:"#212A3E"}}>{rowData.point}</td>
                  </th>
                    <td style={{backgroundColor:"#212A3E"}}>
                       <input className='ssbox2'
                        type="text"
                        style={{ backgroundColor: "white", width: "45vw" }}
                        disabled={isReviewer}
                        value={rowData.feedback}
                        onChange={(e) => handleFeedbackChange(index, e.target.value)}
                        placeholder={index === 0 ? 'Assessment of the reviewing authority to be recorded here' : 'Assessment of the reviewing authority to be recorded here'}
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
      <button type="button" onClick={handleSubmit} className="submit-button" style={{ width: '10vw'}} disabled={isReviewer}>
            Submit
          </button>
          <button type="button" onClick={handlechange} className="next-button"  style={{ width: '10vw' }}>
            Next
          </button>
      </div>
    </div>
    </div>
    </div>
   
    </div>
  );
}
