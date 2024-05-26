import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config();

const ZEEH_URL: any = process.env.ZEEH_URL
const ZEEH_API: any = process.env.ZEEH_API


const veriNIN = async (nin: string) => {

    const options = {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Secret_Key': ZEEH_API
        },
        data: {
          nin
        }
    }
    
    try {
        let response: any = await axios(ZEEH_URL, options)
        if(response.success === true && response.statusCode === 200){
          return response.data
        }else{
          return false
        }

    } catch (error: any) {
        if (error.response) {
          console.error('Error Data:', error.response.data);
          return false
        } else if (error.request) {
          console.error('No Response Received:', error.request);
          return false
        } else {
          console.error('Error Message:', error.message);
          return false
        }
    }
    
}

export default veriNIN;