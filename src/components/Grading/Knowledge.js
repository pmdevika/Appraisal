import React, { useEffect, useState } from 'react';
import './Knowledge.css';

import axios from 'axios'; 
import userImage from '../../assets/user_circle.png'; // Import the image
import logoImage from '../../assets/shg.png';
export default function Knowledge() {
  const [name, setName] = useState('');
  const [role1, setRole1] = useState('');
  const [id, setId] = useState('');
  const [position, setPosition] = useState('');
  const [date, setDate] = useState('');
  const [period,setPeriod]=useState('');
  const [review,setReview]=useState('');
  const [evaluation,setEvaluation]=useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isEvaluator = role === 'evaluator';
  const isSelf=role=='self';
  const isReviewer=role=='reviewer';
  const [selfScore,setSelfScore]=useState('');
  const [evaluateScore,setEvaluateScore]=useState('');
  const [reviewScore,setReviewScore]=useState('');
  const [tableData, setTableData] = useState([
    { parameter: '', selfScore: '' },
  ]);

  useEffect(() => {
    // Retrieve the token, ID, and role from local storage
    const token = localStorage.getItem('token');
    const ID = localStorage.getItem('ID');
    const role = localStorage.getItem('role');

    // Set the default Authorization header for Axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setId(ID);
    setRole1(role);
    fetchKnowledgeQuestions(role);

  }, []);

  const fetchKnowledgeQuestions = async (role) => {
    try {
      const response = await axios.get('https://appbackend-rala.onrender.com/self/get-position-based-questions');
      const questions = response.data.questions; 
      console.log(questions)
      // Set the questions in the tableData state 
      const newTableData = questions.map((question) => ({
        parameter: question,
        selfScore: '', // You can initialize this as needed
      }));
      setTableData(newTableData);
    } catch (error) {
      console.error('Error fetching knowledge questions:', error);
    }
  };
  const handleEvalScoreChange = (index, event) => {
    const { value } = event.target;
    console.log(value)
    // Create a copy of the tableData array
    const updatedTableData = [...tableData];
    // Update the evalScore for the specified row
    updatedTableData[index].selfScore = value;
    // Update the state with the new data
    setTableData(updatedTableData);
  };
  const handleSave = async () => {
    //e.preventDefault(); 
    try { 
      // const questions = {   text: responsibility,
      //   selfAppraisal:  self,
      const data = {
        responses: tableData.map((row) => ({
          text: row.parameter,
          score: row.selfScore,
        }))
      };
            
      await axios.post('https://appbackend-rala.onrender.com/self/evaluate-position-based', data)
      .then((response) => {
        alert('Data added to the database.');
        window.location.href = '/responsibility';
      })
      .catch((error) => {
        // Handle any errors (e.g., display an error message)
        console.error('Failed to save data:', error);
      });
  } catch (error) {
    console.error('Error adding user:', error);
  }
       
  }; 
  // Function to add a new row
   
    return (
      <div className="main-body">
        <div className="sidebar">
          {/* Sidebar content */}
            <img src={logoImage} alt="Example" className='logoimage' />
            <div className="sidebar-item" style={{marginTop:50}}>
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
            <h1 className='name' style={{marginRight:600,marginTop:30}}>3. Grading against performance parameters</h1>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: '100px' }}>
                <img src={userImage} alt="Example" className='profileimage' />

                {/* Display the name and id */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className='name'>{id}</h3>
                    <p className='name' style={{ fontWeight: 300, fontSize: 16 ,marginTop:-15}}>{role1}</p>
                </div>
            </div>

          </div>
          <div className="break"></div>
          <div className="bottom">
             
              
            <div className="profile-page">
            <table>
                <thead>
                <tr>
                    <th className='smallbox'>Nature of performance assessment</th>
                    <th className='smallbox'>Outstanding</th>
                    <th className='smallbox'>Excellent</th>
                    <th className='smallbox'>Good</th>
                    <th className='smallbox'>Average</th>
                    <th className='smallbox'>Poor</th>
                    
                </tr>
                <tr>
                    <th className='smallbox'>Points to be awarded</th>
                    <th className='smallbox'>10</th>
                    <th className='smallbox'>8</th>
                    <th className='smallbox'>6</th>
                    <th className='smallbox'>4</th>
                    <th className='smallbox'>2</th>
                    
                </tr>
                </thead>
            </table>
            <div>
      <h1 className='name' style={{ fontWeight: 400, fontSize: 16 ,marginTop:15}}>3.2 Knowledge Parameters</h1>
      {/* <button onClick={addRow}>Add Row</button> */}
      {/* table */}
      <table>
        <thead>
          <tr>
            <th className='boxbig'>Parameter</th>
            <th className='sbox'>Applicability</th>
            <th className='boxbig'>Points Awarded
                <th className='box'>Self</th>
                <th className='box'>Evaluation</th>
                <th className='box'>Review</th>
            </th>
          </tr>
        </thead>

        {/* <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td className='box'><input className='box' style={{width:"35vw"}} type="text" value={row.subject} disabled={isEvaluator || isReviewer || isSelf} /></td>
              <td className='sbox'></td>
              <td className='box'>
                <div className="score-subdivision">
                  <input className='box' type="text" value={selfScore}  disabled={isEvaluator || isReviewer  }  onChange={(e) => setSelfScore(e.target.value)}/>
                  <input className='box' type="text" value={evaluateScore} disabled={ isReviewer || isSelf}/>
                  <input className='box' type="text" value={reviewScore} disabled={isEvaluator  || isSelf}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody> */}
        <tbody>
                  {tableData.length > 0 ? (tableData.map((row, index) => (
                    <tr key={index}>
                      <td className='box'><input className='box' style={{ width: "35vw" }} type="text" value={row.parameter} disabled={isEvaluator || isReviewer || isSelf} /></td>
                      <td className='sbox'></td>
                      <td className='box'>
                        <div className="score-subdivision">
                          <input className='box' type="text" value={row.selfScore} disabled={isEvaluator || isReviewer} onChange={(e) => handleEvalScoreChange(index, e)} />
                          <input className='box' type="text" value={evaluateScore} disabled={isReviewer || isSelf} />
                          <input className='box' type="text" value={reviewScore} disabled={isEvaluator || isSelf} />
                        </div>
                      </td>
                    </tr>
                  ))) : (
                    <p>Loading predefined questions...</p>
                  )}
        </tbody>
         
          {/* <tr>
            <th className='box' style={{width:10}}>Total</th>
            <th className='tbox'>10</th>
            <th className='tbox'>10</th>
            <th className='tbox'>6</th> 
          </tr> */}
         
      </table>
    </div>
               

              <div className="profile-section">
                <button type="submit"  onClick={() => {
                  handleSave(); // Call the handleSave function
                  // Redirect to the desired page
                }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
       
    );
  }
  