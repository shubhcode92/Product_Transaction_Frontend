import React, { useState, useEffect } from 'react';
import './App.css';
import Footer from './components/Footer';
import Heading from './components/Heading';

const App = () => {
  // const API = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
  const [data, setData] = useState([]);
  const [dataDemo, setDataDemo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  const [month, setMonth] = useState('03');
  const [search, setSearch] = useState('');

  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [totalSales, setTotalSales] = useState(0);
  const [sold, setSold] = useState(0);
  const [unsold, setUnsold] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://server-eta-pink.vercel.app/api/data');
        const jsonData = await response.json();
        setData(jsonData);
        setDataDemo(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Calculate current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataDemo.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination buttons
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const changeMonth = (e) => {
    const selected = e.target.value;
    setMonth(selected);
    const monthData = data.filter((val) => {
      const val1 = val.dateOfSale;
      const first = val1.split('-')[1];
      return first === selected;
    });
    setDataDemo(monthData);
    let currTotal = 0;
    let currSold = 0;
    let currUnsold = 0;
    for (let val of monthData) {
      currTotal += val.price;
      if (val.sold) currSold++;
      else currUnsold++;
    }
    setTotalSales(currTotal);
    setSold(currSold);
    setUnsold(currUnsold);
  };

  const searchResult = (e) => {
    setSearch(e.target.value);
    const searchData = data.filter((val) => {
      const combine = val.title + val.description + val.price;
      return combine.includes(e.target.value);
    });
    setDataDemo(searchData);
    if (e.target.value === '') {
      setDataDemo(data);
    }
  };

  const getShortDes = (description) => {
    const words = description.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '... Read More';
    }
    return description;
  };

  return (
    <>
      <Heading val='Transaction Dashboard' />
      <div className='text-center'>
        <div className='flex flex-col md:flex-row items-center justify-center px-4 py-6 md:px-10 md:py-10'>
          <input value={search} onChange={searchResult} className='border-[1px] border-orange-500 rounded-md pl-2 py-2 mb-4 md:mb-0 md:mr-4 w-full md:w-auto' type="text" placeholder='Search transaction' />
          <select onChange={changeMonth} className='px-2 py-2 rounded-md border-orange-500 w-full md:w-auto border-[1px]' name="month" id="month" value={month}>
            <option value="">Select Month</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className='w-full overflow-x-auto px-4 md:px-72'>
          <table className='min-w-full'>
            <thead className='text-orange-500 text-xl'>
              <tr>
                <th className='px-2 py-2'>ID</th>
                <th className='px-2 py-2'>Title</th>
                <th className='px-2 py-2'>Description</th>
                <th className='px-2 py-2'>Price</th>
                <th className='px-2 py-2'>Category</th>
                <th className='px-2 py-2'>Sold</th>
                <th className='px-2 py-2'>Image</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td className='px-2 py-2'>{item.id}</td>
                  <td className='px-2 py-2'>{item.title}</td>
                  <td className='px-2 py-2'>{getShortDes(item.description)}</td>
                  <td className='px-2 py-2'>{item.price}</td>
                  <td className='px-2 py-2'>{item.category}</td>
                  <td className='px-2 py-2'>{item.sold ? 'Yes' : 'No'}</td>
                  <td className='px-2 py-2'><img src={item.image} alt={item.title} className='w-12 h-12 object-cover' /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className='text-center mt-6'>
            <button className='text-white border-[1px] border-gray-700 bg-orange-500 px-4 py-2 rounded-md hover:bg-orange-400' onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            <span className='mx-4'>Page {currentPage}</span>
            <button className='text-white border-[1px] border-gray-700 bg-orange-500 px-4 py-2 rounded-md hover:bg-orange-400' onClick={nextPage} disabled={currentItems.length < itemsPerPage}>Next</button>
          </div>
        </div>
      </div>
      <Heading val='Statistics' />
      <div className='text-center my-8 border-2 border-orange-500 mx-4 md:mx-72 pb-5 text-xl rounded-md'>
        <h1 className='bg-orange-500 rounded-t-md py-3 text-white'>Month: {monthName[parseInt(month)-1]}</h1>
        <h1>Total Sales Amount: {Math.ceil(totalSales)}</h1>
        <h1>Total Sold Items: {sold}</h1>
        <h1>Total Not Sold Items: {unsold}</h1>
      </div>
      <Heading val='Bar Chart States' />
      <Footer />
    </>
  );
};

export default App;