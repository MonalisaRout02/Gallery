import { useEffect, useState } from 'react'
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
 
  useEffect(() => {

    const fetchData = async() =>{
        
      try{
        const res = await axios.get ("https://jsonplaceholder.typicode.com/photos");
       
        console.log(res.data);
        const groupedData = res.data.reduce((acc, element) => {
          const {albumId} = element;
         
          if( !acc[albumId]){
             acc[albumId] = [];
          }
          acc[albumId].push(element);
          console.log(acc);
          return acc;

        } , {});
        
        setData(groupedData);
  
       
      }catch(error){
          console.log(error);
      }
    }
    fetchData();

  }, []);


  return (
    <>
     
    </>
  )
}

export default App
