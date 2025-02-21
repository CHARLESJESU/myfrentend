import React, { useState, useRef } from "react";
import axios from "axios";  // Import axios for API calls
import "./EnquiryForm.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    date: "",
    fatherName: "",
    fatherOccupation: "",
    fatherorganizationName: "",
    motherName: "",
    motherOccupation: "",
    motherorganizationName: "",
    permanentAddress: "",
    community: "OC",
    firstGraduate: "NO",
    emailID: "",
    parentContactNo: "",
    studentContactNo: "",
    choiceOfCourses: "",
    board10: "",
    board10college: "",
    mathsExpected: "",
    mathsActual: "",
    physicsExpected: "",
    physicsActual: "",
    chemistryExpected: "",
    chemistryActual: "",
    cutOffExpected: "",
    cutOffActual: "",
    totalMarkExpected: "",
    totalMarkActual: "",
    board12: "",
    schoolName: "",
    referredBy: "",
    contactNo: "",
    siblings: "",
    socialMedia: "",
    printMedia: "",
    website: "",
    friends: "",
    relatives: "",
    students: "",
    staff: "",
    alumni: "",
    educationFair: "",
    sourceOfInfo: [],
  });
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef();
  const [otherBoardX, setOtherBoardX] = useState("");
  const [otherBoardXII, setOtherBoardXII] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Add number validation for contact fields
    if (name === 'parentContactNo' || name === 'studentContactNo' || name === 'contactNo') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numbersOnly });
      return;
    }

    // Add validation for mark field to accept only numbers and /
    if (name === 'mark') {
      const validInput = value.replace(/[^0-9/]/g, '');
      setFormData({ ...formData, [name]: validInput });
      return;
    }
    
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        sourceOfInfo: checked
          ? [...prevData.sourceOfInfo, name]
          : prevData.sourceOfInfo.filter((item) => item !== name),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Check if the board10 field is being changed
    if (name === "board10") {
        if (value === "Others") {
            setOtherBoardX(""); // Reset otherBoardX when "Others" is selected
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 

    try {
      const response = await axios.post("http://localhost:5000/api/enquiry", formData);

      if (response.status === 201) {
        setMessage("All data is saved successfully!");
      } else {
        setMessage("Data not saved. Please try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("Data not saved. Please try again.");
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
  };
  const handleDownloadPDF = () => {
    const element = previewRef.current;
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
      windowHeight: element.scrollHeight
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
  
      // Add Title to the PDF at the Top-Centered
      pdf.setFontSize(16);
      pdf.text("Enquiry Form", pdfWidth / 2, 8, { align: "center" });
  
      // Adjust position for the first page (leave space for title)
      let position = 10; // Move image down to prevent overlap with title
  
      // Calculate the number of pages needed
      const ratio = pdfWidth / imgWidth;
      const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight);
  
      let heightLeft = imgHeight;
  
      while (heightLeft > 0) {
        if (position > 25) {
          pdf.addPage();
          position = 10; // Reset position for new page
        }
  
        const currentHeight = Math.min(imgHeight - position, pdfHeight / ratio);
        pdf.addImage(
          imgData,
          'PNG',
          0,
          position, // Adjusted position for the image
          pdfWidth,
          imgHeight * ratio,
          '',
          'FAST'
        );
  
        heightLeft -= pdfHeight / ratio;
        position += pdfHeight / ratio;
      }
  
      pdf.save(`enquiry-form-${formData.studentName}.pdf`);
    });
  };
  
  if (showPreview) {
    return (
      <div className="preview-container">
        <h2 className="form-header">PREVIEW DETAILS</h2>
        <div className="preview-content" ref={previewRef} style={{ position: 'relative' }}>
         
          <table style={{ width: '40%', borderCollapse: 'collapse', marginBottom: '20px', float: 'right' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Subject</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Expected Mark</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Actual Mark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Mathematics</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.mathsExpected}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.mathsActual}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Physics</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.physicsExpected}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.physicsActual}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Chemistry</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.chemistryExpected}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.chemistryActual}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Cut off Mark</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.cutOffExpected}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.cutOffActual}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total Mark</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.totalMarkExpected}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formData.totalMarkActual}</td>
              </tr>
            </tbody>
          </table>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Student's Name</p>
  <p>: {formData.studentName}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Date</p>
  <p>: {formData.date}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Father's Name</p>
  <p>: {formData.fatherName}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Father's Occupation</p>
  <p>: {formData.fatherOccupation}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Father's Organization</p>
  <p>: {formData.fatherorganizationName}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Mother's Name</p>
  <p>: {formData.motherName}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Mother's Occupation</p>
  <p>: {formData.motherOccupation}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Mother's Organization</p>
  <p>: {formData.motherorganizationName}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Permanent Address</p>
  <p>: {formData.permanentAddress}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Community</p>
  <p>: {formData.community}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>First Graduate</p>
  <p>: {formData.firstGraduate}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Email ID</p>
  <p>: {formData.emailID}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Parent Contact</p>
  <p>: {formData.parentContactNo}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Student Contact</p>
  <p>: {formData.studentContactNo}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Choice of Courses</p>
  <p>: {formData.choiceOfCourses}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Admission Type</p>
  <p>: {formData.board10college}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Board 10th</p>
  <p>: {formData.board10 === "Others" ? otherBoardX : formData.board10}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>10th Mark</p>
  <p>: {formData.mark}</p>
</div>
<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Board 12th</p>
  <p>: {formData.board12 === "Others" ? otherBoardXII : formData.board12}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>School Name</p>
  <p>: {formData.schoolName}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Referred By</p>
  <p>: {formData.referredBy}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Contact No</p>
  <p>: {formData.contactNo}</p>
</div>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <p style={{ minWidth: '200px', fontWeight: 'bold' }}>Siblings</p>
  <p>: {formData.siblings}</p>
</div>


<h3>Source of Information</h3>
<div style={{ display: 'flex', flexWrap: 'wrap' }}>
  {formData.sourceOfInfo.map((source, index) => (
    <div key={index} style={{ marginRight: '10px' }}>{source}</div>
  ))}
</div>
              <div className="signature-section">
            <div className="signature-space"></div>
            <p className="signature-text">Signature of the Candidate/ Parent/ Guardian</p>
          </div>
        </div>
        
        <div className="button-group">
          <button onClick={handleBack} className="print-button">
            Back to Edit
          </button>
          <button onClick={handleDownloadPDF} className="print-button">
            Download PDF
          </button>
          <button onClick={() => { handleSubmit(); handleBack(); }} className="print-button">
            Confirm & Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div>
        <h2 className="form-header">ENQUIRY FORM</h2>
        <div className="form-grid">
          <label>Student's Name: 
            <input 
              type="text" 
              name="studentName"
              className="border p-1 w-full" 
              onChange={handleChange}
              value={formData.studentName}
            />
          </label>
          <label>Date: 
            <input 
              type="date" 
              name="date"
              className="border p-1 w-full"
              onChange={handleChange} 
              value={formData.date}
            />
          </label>
          <label>Father's Name: 
            <input 
              type="text" 
              name="fatherName"
              className="border p-1 w-full" 
              onChange={handleChange}
              value={formData.fatherName}
            />
          </label>
          <label>Father's Occupation & Designation: 
            <input 
              type="text" 
              name="fatherOccupation"
              className="border p-1 w-full" onChange={handleChange} 
              value={formData.fatherOccupation}
            />
          </label>
          <label>Organization Name: 
            <input 
              type="text" 
              name="fatherorganizationName"
              className="border p-1 w-full" 
              onChange={handleChange}
              value={formData.fatherorganizationName}
            />
          </label>
          <label>Mother's Name: 
            <input 
              type="text" 
              name="motherName"
              className="border p-1 w-full" 
              onChange={handleChange}
              value={formData.motherName}
            />
          </label>
          <label>Mother's Occupation & Designation: 
            <input 
              type="text" 
              name="motherOccupation"
              className="border p-1 w-full" 
              onChange={handleChange}
              value={formData.motherOccupation}
            />
          </label>
          <label>Organization Name: 
            <input 
              type="text" 
              name="motherorganizationName"
              className="border p-1 w-full" 
              onChange={handleChange}
              value={formData.motherorganizationName}
            />
          </label>
          <label>Permanent Address: 
            <textarea 
              name="permanentAddress"
              className="border p-1 w-full" 
              onChange={handleChange}
              value={formData.permanentAddress}
            />
          </label>
        </div>
        
        <label>Community:</label>
        <select 
          name="community"
          className="border p-1 w-full"
          onChange={handleChange}
          value={formData.community}
        >
          <option>OC</option>
          <option>BC</option>
          <option>BCM</option>
          <option>MBC</option>
          <option>SC</option>
          <option>ST</option>
        </select>
        <label>First Graduate:</label>
        <select 
          name="firstGraduate"
          className="border p-1 w-full"
          onChange={handleChange}
          value={formData.firstGraduate}
          >
          <option>YES</option>
          <option>NO</option>
        </select>
        
        <label>Email ID: 
          <input 
            type="email" 
            name="emailID"
            className="border p-1 w-full" 
            onChange={handleChange}
            value={formData.emailID}
          />
        </label>
        <label>Parent Contact No.: 
          <input 
            type="text" 
            name="parentContactNo"
            className="border p-1 w-full" 
            onChange={handleChange}
            value={formData.parentContactNo}
            maxLength="10"
            placeholder="Enter 10 digit number"
          />
        </label>
        <label>Student Contact No.: 
          <input 
            type="text" 
            name="studentContactNo"
            className="border p-1 w-full" 
            onChange={handleChange}
            value={formData.studentContactNo}
            maxLength="10"
            placeholder="Enter 10 digit number"
          />
        </label>
      
        <label>Choice of Course(s): 
          <input 
            type="text" 
            name="choiceOfCourses"
            className="border p-1 w-full" 
            onChange={handleChange}
            value={formData.choiceOfCourses}
                />
        </label>
        <div className="radio-group">
          <label><input type="radio" name="board10college" value="Counselling" onChange={handleChange} checked={formData.board10college === "Counselling"} />Counselling</label>
          <label><input type="radio" name="board10college" value="Management" onChange={handleChange} checked={formData.board10college === "Management"} />Management</label>
        </div>
        <h3>Marks Details</h3>
        <div className="marks-table">
          <div>
            <label>Mathematics</label>
            <div className="input-group">
              <input 
                type="number"
                name="mathsExpected" 
                onChange={handleChange}
                value={formData.mathsExpected}
                />
              <span className="slash">/</span>
              <input 
                type="number"
                name="mathsActual" 
                onChange={handleChange}
                value={formData.mathsActual}
                />
            </div>
          </div>
          <div>
            <label>Physics</label>
            <div className="input-group">
              <input 
                type="number"
                name="physicsExpected" 
                onChange={handleChange}
                value={formData.physicsExpected}
                  />
              <span className="slash">/</span>
              <input 
                type="number"
                name="physicsActual" 
                onChange={handleChange}
                value={formData.physicsActual}
                />
            </div>
          </div>
          <div>
            <label>Chemistry</label>
            <div className="input-group">
              <input 
                type="number"
                name="chemistryExpected" 
                onChange={handleChange}
                value={formData.chemistryExpected}
                />
              <span className="slash">/</span>
              <input 
                type="number"
                name="chemistryActual" 
                onChange={handleChange}
                value={formData.chemistryActual}
                  />
            </div>
          </div>
          <div>
            <label>Cut off Mark</label>
            <div className="input-group">
              <input 
                type="number"
                name="cutOffExpected" 
                onChange={handleChange}
                value={formData.cutOffExpected}
                />
              <span className="slash">/</span>
              <input 
                type="number"
                name="cutOffActual" 
                onChange={handleChange}
                value={formData.cutOffActual}
                  />
            </div>
          </div>
          <div>
            <label>Total Mark</label>
            <div className="input-group">
              <input 
                type="number"
                name="totalMarkExpected" 
                onChange={handleChange}
                value={formData.totalMarkExpected}
                  />
              <span className="slash">/</span>
              <input 
                type="number"
                name="totalMarkActual" 
                onChange={handleChange}
                value={formData.totalMarkActual}
                  />
            </div>
          </div>
        </div>
        <h3 className="font-bold mt-4">Board of Study X Std</h3>
        <div className="flex gap-4">
          <label><input type="radio" name="board10" value="State Board" onChange={handleChange} checked={formData.board10 === "State Board"} /> State Board</label>
          <label><input type="radio" name="board10" value="CBSE" onChange={handleChange} checked={formData.board10 === "CBSE"} /> CBSE</label>
          <label><input type="radio" name="board10" value="Matric" onChange={handleChange} checked={formData.board10 === "Matric"} /> Matric</label>
          <label><input type="radio" name="board10" value="Others" onChange={handleChange} checked={formData.board10 === "Others"} /> Others</label>
        </div>
        {formData.board10 === "Others" && (
            <div>
                <label>Specify Other Board for X Std: 
                    <input 
                        type="text" 
                        value={otherBoardX} 
                        onChange={(e) => setOtherBoardX(e.target.value)} 
                        className="border p-1 w-full" 
                    />
                </label>
            </div>
        )}
        <label>10th Mark:(scored/out of marks) 
          <input 
            type="text" 
            name="mark"
            className="border p-1 w-full" 
            onChange={handleChange}
            value={formData.mark || ''}
            placeholder="Example: 95/100"
          />
        </label>
        
        <h3 className="font-bold mt-4">Board of Study XII Std</h3>
        <div className="flex gap-4">
          <label><input type="radio" name="board12" value="State Board" onChange={handleChange}   checked={formData.board12 === "State Board"} /> State Board</label>
          <label><input type="radio" name="board12" value="CBSE" onChange={handleChange} checked={formData.board12 === "CBSE"} /> CBSE</label>
          <label><input type="radio" name="board12" value="Matric" onChange={handleChange}  checked={formData.board12 === "Matric"} /> Matric</label>
          <label><input type="radio" name="board12" value="Others" onChange={handleChange}    checked={formData.board12 === "Others"} /> Others</label>
        </div>
        
        {formData.board12 === "Others" && (
            <div>
                <label>Specify Other Board for XII Std: 
                    <input 
                        type="text" 
                        value={otherBoardXII} 
                        onChange={(e) => setOtherBoardXII(e.target.value)} 
                        className="border p-1 w-full" 
                    />
                </label>
            </div>
        )}
        
        <div className="grid grid-cols-3 gap-2">
        <label>Name of the School & Address: 
          <input 
            type="text" 
            name="schoolName"
            className="border p-1 w-full" 
            onChange={handleChange}
            value={formData.schoolName}
            />
        </label>
        <label>Referred by: 
          <input 
            type="text" 
            name="referredBy"
            className="border p-1 w-full" 
            onChange={handleChange}
            value={formData.referredBy}
            />
        </label>
        <label>Contact No.: 
          <input 
            type="text" 
            name="contactNo"
            className="border p-1 w-full" 
            onChange={handleChange}
            value={formData.contactNo}
            maxLength="10"
            placeholder="Enter 10 digit number"
          />
        </label>
        
        <label>Details of siblings already studying in this college: 
          <input 
            type="text" 
            name="siblings"
            className="border p-1 w-full" 
            onChange={handleChange}
            value={formData.siblings}
              />
        </label>
        <h3 className="font-bold mt-4">Source of information about the college:</h3>
          <label><input type="checkbox" name="socialMedia" onChange={handleChange} checked={formData.sourceOfInfo.includes('socialMedia')} /> Social Media</label>
          <label><input type="checkbox" name="printMedia" onChange={handleChange} checked={formData.sourceOfInfo.includes('printMedia')} /> Print Media</label>
          <label><input type="checkbox" name="website" onChange={handleChange} checked={formData.sourceOfInfo.includes('website')} /> Website</label>
          <label><input type="checkbox" name="friends" onChange={handleChange} checked={formData.sourceOfInfo.includes('friends')} /> Friends</label>
          <label><input type="checkbox" name="relatives" onChange={handleChange} checked={formData.sourceOfInfo.includes('relatives')} /> Relatives</label>
          <label><input type="checkbox" name="students" onChange={handleChange} checked={formData.sourceOfInfo.includes('students')} /> Students</label>
          <label><input type="checkbox" name="staff" onChange={handleChange} checked={formData.sourceOfInfo.includes('staff')} /> Staff</label>
          <label><input type="checkbox" name="alumni" onChange={handleChange} checked={formData.sourceOfInfo.includes('alumni')} /> Alumni</label>
          <label><input type="checkbox" name="educationFair" onChange={handleChange} checked={formData.sourceOfInfo.includes('educationFair')} /> Education Fair</label>
        </div>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="button-group">
        <button type="button" className="print-button" onClick={handlePreview}>
          Preview & Download
        </button>
        <button type="submit" className="print-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default EnquiryForm;

