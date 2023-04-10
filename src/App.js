import React, {  useState } from "react";
import './PersonalDetailsForm.css';
import { signUpRequest, userAddress } from "./services/webServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress} from "@mui/material";
import { Day, months } from "./DobComponent";



function App() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    day: "",
    month: "",
    year: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [addressLines, setAddressLines] = useState([
    { line1: '', line2: '', line3: '' },
  ]);
  const [requiredFields, setRequiredFields] = useState(false);


  const handleLineChange = (index, field, value) => {
    setAddressLines((lines) =>
      lines.map((line, i) =>
        i === index ? { ...line, [field]: value } : line
      )
    );
  };

  const handleAddAddress = () => {
    setAddressLines((lines) => [
      ...lines,
      { line1: '', line2: '', line3: '' },
    ]);
  };

  const handleRemoveAddress = () => {
    setAddressLines((lines) => {
      if (lines.length === 1) return lines;
      return lines.slice(0, lines.length - 1);
    });
  };

  

  // genrate year for date of birth
  const dyear = [];
  for (let i = 2022; i >= 1910; i--) {
    dyear.push(i);
  }

  // browser details
  const browser = (function () {
    const userAgent = window.navigator.userAgent;
    const isIE = userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
    const isEdge = userAgent.indexOf("Edge/") > -1;
    const isChrome = userAgent.indexOf("Chrome/") > -1 && !isEdge;
    const isFirefox = userAgent.indexOf("Firefox/") > -1;
    const isSafari = userAgent.indexOf("Safari/") > -1 && !isChrome;

    if (isIE) {
      return "Internet Explorer";
    } else if (isEdge) {
      return "Microsoft Edge";
    } else if (isChrome) {
      return "Google Chrome";
    } else if (isFirefox) {
      return "Mozilla Firefox";
    } else if (isSafari) {
      return "Apple Safari";
    } else {
      return "Unknown";
    }
  })();


  // device type
  const userAgent = window.navigator.userAgent;
  let deviceType;

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    deviceType = 'iOS';
  } else if (/Android/.test(userAgent)) {
    deviceType = 'Android';
  } else if (/Windows NT/.test(userAgent)) {
    deviceType = 'Windows Laptop';
  } else if (/Macintosh/.test(userAgent)) {
    deviceType = 'Mac Laptop';
  } else if (/Tablet/.test(userAgent)) {
    deviceType = 'Tablet';
  } else if (/Mobile/.test(userAgent)) {
    deviceType = 'Mobile';
  } else {
    deviceType = 'Unknown';
  }


  // ip address
  function getLocalIPAddress() {
    return new Promise((resolve, reject) => {
      const pc = new RTCPeerConnection();
      pc.createDataChannel('');
      pc.createOffer()
        .then((offer) => {
          const regex = /(\d+\.\d+\.\d+\.\d+)/;
          const ipAddress = offer.sdp.match(regex)[1];
          resolve(ipAddress);
        })
        .catch((error) => reject(error));
    });
  }

  getLocalIPAddress().then((ipAddress) => setIpAddress(ipAddress));


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ 
      ...prevState,
      [name]: value,
    }));
  };


  // api calling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)




    const userData = {
      first_name: formData.fname,
      last_name: formData.lname,
      email: formData.email,
      date_of_birth: `${year}-${month}-${day}`,
      phone_number: formData.phone,
      browser: browser,
      device_type: deviceType,
      User_type: "user",
      ip_address: ipAddress //ip.IPv4
    }



    let res = await signUpRequest(userData)

    if (res.status === 200) {
      setLoading(false);
      setFormData({
        fname: "",
        lname: "",
        email: "",
        phone: "",
      });
      setDay('');
      setIpAddress('');
      setYear('')
      setMonth('')
      toast.success(res.message);
      setStep((prevState) => prevState + 1);
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  const handleSubmits = async (event) => {
    event.preventDefault();
    setLoading(true);
    const hasEmptyFields = addressLines.some(
      ({ line1 }) => !line1 
    );
   
    if (hasEmptyFields) {
      toast.error('please enter your address atleast one');
      setLoading(false);
    }else{
      console.log('inside else');
      setRequiredFields(hasEmptyFields);
      let res = await userAddress(addressLines)
      if (res.status === 200) {
        setLoading(false);
        handleAddAddress();
        toast.success(res.message);
        // setTimeout(() => {
        //   window.reload();
        // }, 3000);
        setAddressLines([
          { line1: '', line2: '', line3: '' },
        ])
        setStep((prevState) => prevState - 2)
      } else {
        toast.error(res.message);
        setLoading(false);
      }
    }
  };


  const nextStep = (e) => {
    // e.preventDefault();
    if (formData.fname && formData.lname && day && month && year) {
      setStep((prevState) => prevState + 1);
    }
  };

  const preStep = (e) => {
    // e.preventDefault();
    setStep((prevState) => prevState - 1);

  };

  return (
    <div >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {step === 1 && (
        <div className="container">
          <h2 className="header" >Enter Your Personal Details</h2>
          <form>
            <label htmlFor="fname">First Name:</label>
            <input
              type="text"
              id="fname"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <label htmlFor="lname">Last Name:</label>
            <input
              type="text"
              id="lname"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="dob">Enter Your Date of Birth</label>
            </div>

            <fieldset>
              <legend style={{ margin: "0px 15px " }}> Date of Birth</legend>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "15px" }}>
                <select value={day} onChange={(e) => setDay(e.target.value)} className="day" style={{ width: "30%" }} required>
                  <option value="" disabled selected > Day </option>
                  {Day.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>

                <select value={month} onChange={(e) => setMonth(e.target.value)} className="day" style={{ width: "30%" }} required>
                  <option value="">Month </option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>

                <select value={year} onChange={(e) => setYear(e.target.value)} className="day" style={{ width: "30%" }} required>
                  <option value="">Year</option>
                  {dyear.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </fieldset>

            <br />
            <br />

            <div style={{ textAlign: "center" }}>
              <button className="button" type="submit" onClick={nextStep} >
                Next
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="container">
          <h2 className="header">Enter your contact details</h2>
          <button className="button" type="submit" style={{
            backgroundColor: "#198754", color: "white", padding: "10px 10px",
            position: "absolute", top: "70px"
          }} onClick={preStep}>
            Back
          </button>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <label htmlFor="phone">Phone Number:</label>
            <input
              type="number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            {loading ?
              <div className="loadingWrapper">
                <CircularProgress sx={{ color: "#f55a2c" }} />
              </div>
              :
              <div style={{ textAlign: "center" }}>
                <button className="button" type="submit" style={{ backgroundColor: "#198754", color: "white" }}>
                  Submit
                </button>
              </div>
            }
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="container">
          <h2 className="header" >Enter Your Previous Address</h2>
          {addressLines.map((line, index) => (
            <>
              <label htmlFor={`addressLine${index + 1}-1`}>Previous Address {index + 1}:</label>
              <input
                type="text"
                id={`addressLine${index + 1}-1`}
                value={line.line1}
                onChange={(event) =>
                  handleLineChange(index, 'line1', event.target.value)
                }
              />
              <br />

              <input
                type="text"
                id={`addressLine${index + 1}-2`}
                value={line.line2}
                onChange={(event) =>
                  handleLineChange(index, 'line2', event.target.value)
                }
              />
              <br />

              <input
                type="text"
                id={`addressLine${index + 1}-3`}
                value={line.line3}
                onChange={(event) =>
                  handleLineChange(index, 'line3', event.target.value)
                }
              />
              <br />
              <br />



              <div style={{ textAlign: "center" }}>
                {index === addressLines.length - 1 && index !== 2 && (
                  <p style={{color:"blue" , cursor:"pointer"}}><a  onClick={handleAddAddress}>Add Another Address</a></p>
                )}
                {index !== 0 && (
                  <p style={{color:"blue" , cursor:"pointer"}}><a  onClick={handleRemoveAddress}>Remove Address</a></p>
                )}
              </div>
            </>
          ))}
          <br />

          <br />


          {loading ?
            <div className="loadingWrapper">
              <CircularProgress sx={{ color: "#f55a2c" }} />
            </div>
            :
            <div style={{ textAlign: "center" }}>
              <button className="button" type="submit" style={{ backgroundColor: "#198754", color: "white" }} onClick={handleSubmits}>
                Submit
              </button>

            </div>
          }
        </div>
      )}
    </div>
  );
}


export default App;
