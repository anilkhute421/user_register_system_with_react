import axios from "axios"


const base_url = process.env.REACT_APP_BASEURL;
// const base_url = 'https://admin.hotepneteru.com';

const prefix = 'api/v1';
const base_url_api = base_url + '/' + prefix;
const appDebug = true;


const signup = `${base_url_api}/signup_manually`;
const address = `${base_url_api}/user_address`;

// const ipaddress = 'https://ipapi.co/json'
// const ipaddress = 'https://geolocation-db.com/json/'
// const ipaddress = 'https://api.ipify.org'



export const signUpRequest = async (body) => {

    

    try {
        let result = await axios.post(signup, body);
        console.log(result);
        if (result.status === 200) {
          if (result.data.status === 200) {
            return result.data;
          } else {
            return result.data;
          }
        }
      } catch (e) {
        if (e) {
          return e;
        }
      }
   
};


export const userAddress = async (body) => {

  try {
      let result = await axios.post(address, body);
      console.log('results');
      console.log(result);
      if (result.status === 200) {
        console.log('status');
        if (result.data.status === 200) {
          return result.data;
        } else {
          return result.data;
        }
      }
    } catch (e) {
      if (e) {
        return e;
      }
    }
 
};


// export const ipAddress = async () => {

//   try {
//       let result = await axios.get(ipaddress);
//       console.log(result , 'ip');
//       if (result.status === 200) {
//           return result;
//       }else {
//           return result;
//         }
//       }
//   catch (e) {
//       if (e) {
//         return e;
//       }
//     }
 
// };


