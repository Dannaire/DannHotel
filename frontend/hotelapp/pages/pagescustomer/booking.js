import Navcust from "@/components/navbar";
import { Card } from "@/components/card";
import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { Feature } from "@/components/feature";
import { Footer } from "@/components/footer";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';



export default function Booking() {



  const [tipekamarData, setTipeKamarData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedTipeKamarData, setUpdatedTipeKamarData] = useState({});
  const [selectedTipeKamar, setSelectedTipeKamar] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Retrieve JWT token from local storage
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8080/tipe_kamar/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTipeKamarData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearchDate = async (e) => {
    e.preventDefault();
  
    try {
      // Retrieve JWT token from local storage
      const token = localStorage.getItem("token");
  
      // Retrieve start and end dates from the date inputs
      const startDate = e.target.elements.start.value;
      const endDate = e.target.elements.end.value;
  
      // Log the data before sending the request
      console.log("Search data:", {
        tgl_check_in: startDate,
        tgl_check_out: endDate,
      });
  
      // Make a request to search for available rooms by date range
      const response = await axios.post(
        "http://localhost:8080/pemesanan/avail",
        {
          tgl_check_in: startDate,
          tgl_check_out: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Set the retrieved data to your state variable
      setTipeKamarData(response.data.data);
  
      // Log the search results
      console.log("Search results:", response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  


  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      // Retrieve JWT token from local storage
      const token = localStorage.getItem("token");

      // Make a request to search for users
      const response = await axios.post(
        "http://localhost:8080/tipe_kamar/find",
        {
          nama_tipe_kamar: searchTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //   setUserData(response.data.data);
      setTipeKamarData(response.data.data);
      // Log the search results
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    const tglCheckIn = e.target.elements.tgl_check_in.value;
  const tglCheckOut = e.target.elements.tgl_check_out.value;

  if (tglCheckIn === tglCheckOut) {
    // Display a window alert
    window.alert('Check-in and check-out dates cannot be the same.');
    return; // Prevent further execution
  }

    const formData = {
      tipe_kamar: e.target.elements.tipe_kamar.value,
      nama_user: localStorage.getItem("nama_user"), // Get the user's name from local storage
      tgl_check_in: e.target.elements.tgl_check_in.value,
      tgl_check_out: e.target.elements.tgl_check_out.value,
      nama_pemesanan: e.target.elements.nama_pemesanan.value,
      email_pemesanan: e.target.elements.email_pemesanan.value,
      // tgl_pemesanan: e.target.elements.tgl_pemesanan.value,
      nama_tamu: e.target.elements.nama_tamu.value,
      jumlah_kamar: e.target.elements.jumlah_kamar.value,
    };
    
  
    try {
      const token = localStorage.getItem("token");
      console.log(formData);
  
      // Send a POST request to the backend API
      const response = await axios.post("http://localhost:8080/pemesanan/addcust", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
  
      // Check the response status and display an appropriate alert
      if (response.data.success) {
        window.alert(response.data.message);
        fetchData(); // Refresh the user data
        handleModalAddToggle(); // Close the modal
      } else {
        window.alert(response.data.message); // Display the error message from the backend
      }
    } catch (error) {
      console.error(error);
      // Show a generic failure alert for other errors
      window.alert("Terjadi kesalahan. Silakan coba lagi nanti.");
    }
  };
  
  
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalAddToggle = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    // window.location.href = '/dashboard';
    // window.location.reload();
  };

    const [minDate, setMinDate] = useState(''); 

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setMinDate(currentDate);
  }, []);

  const router = useRouter();

  useEffect(() => {
    // Check if user-related data exists in local storage
    const role = localStorage.getItem('role');

    if (!role || role !== 'tamu') {
      // Redirect the user to the login page
      router.push('/pagescustomer/logincust');
    }
  }, []);
    return (
        <>
         <Navcust/>
         <Header/>
        <div  className="flex flex-warp min-h-screen ">
<section className="container px-20 mx-auto mt-8 mb-24">
                    {isModalOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
  <span
    className="hidden sm:inline-block sm:h-screen sm:align-middle"
    aria-hidden="true"
  >
    ​
  </span>
  <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
    <h3
      className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
      id="modal-title"
    >
      Add Pemesanan
    </h3>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      Add new Pemesanan
    </p>
    <div className="overflow-y-auto max-h-96 mt-4">
    <form
      className="mt-4"
      onSubmit={(e) => handleAddSubmit(e)}
    >
     <label
        className="block mt-3"
        htmlFor="email"
      >
       
        Tipe Kamar
        <input
          type="text"
          name="tipe_kamar"
          id="tipe_kamar"
          placeholder="tipe_kamar"
          value={selectedTipeKamar} // Set the value to the selected tipe_kamar readOnly // Make the input read-only to prevent user input
          readOnly 
          //  value={user.email}

          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>
      <label
        className="block mt-3"
        htmlFor="email"
      >
       
        Nama Pemesanan
        <input
          type="text"
          name="nama_pemesanan"
          id="nama_pemesanan"
          placeholder="nama_pemesanan"
          //  value={user.email}

          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>
      <label
        className="block mt-3"
        htmlFor="harga"
      >
        {" "}
        Email Pemesanan
        <input
          type="text"
          name="email_pemesanan"
          id="email_pemesanan"
          placeholder="p@gmail"
          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>
      {/* <label
        className="block mt-3"
        htmlFor="harga"
      >
        {" "}
        Tanggal Pemesanan
        <input
          type="date"
          name="tgl_pemesanan"
          id="tgl_pemesanan"
          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label> */}
      <label
        className="block mt-3"
        htmlFor="harga"
      >
        {" "}
        Tanggal Check In
        <input
          type="date"
          name="tgl_check_in"
          id="tgl_check_in"
          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          min={minDate}
          required
        />
      </label>
      <label
        className="block mt-3"
        htmlFor="harga"
      >
        {" "}
        Tanggal Check Out
        <input
          type="date"
          name="tgl_check_out"
          id="tgl_check_out"
          min={minDate}
          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>
      <label
        className="block mt-3"
        htmlFor="harga"
      >
        {" "}
        Nama Tamu
        <input
          type="text"
          name="nama_tamu"
          id="nama_tamu"
          placeholder="arlan"
          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>
      <label
        className="block mt-3"
        htmlFor="harga"
      >
        {" "}
        Jumlah Kamar
        <input
          type="text"
          name="jumlah_kamar"
          id="jumlah_kamar"
          placeholder="1"
          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>
     
      {/* <label
        className="block mt-3"
        htmlFor="harga"
      >
        {" "}
        Nama User
        <input
          type="text"
          name="nama_user"
          id="nama_user"
          placeholder="arlan"
          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>  */}
      
     
      <button
        type=""
        className="mt-2 flex items-center rounded py-1.5 px-2 text-sm text-blue-600 transition-colors duration-300 hover:text-blue-400 focus:outline-none dark:text-blue-400 dark:hover:text-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="mx-2">
          Add another
        </span>
      </button>
      <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
      <button
  onClick={() => handleCancel()}
  type="button"
  className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
>
  Cancel
</button>

        <button
          type="submit"
          className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
        >
          Add
        </button>
      </div>
    </form>
  </div>
</div>
</div>
)}
<form className="mt-6" onSubmit={handleSearchDate}>
      <div date-rangepicker="" className="flex items-center">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </div>
          <input
            name="start"
            type="date"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Select date start"
            min={minDate}
          />
        </div>
        <span className="mx-4 text-gray-500 ">to</span>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </div>
          <input
            name="end"
            type="date"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Select date end"
            min={minDate}
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
      >
        Search
      </button>
    </form>

{/* <form className="mt-6" onSubmit={handleSearch}>
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form> */}
<div className="grid grid-cols-4 gap-8 mt-8">
{tipekamarData.map((tipekamar) => (
                        
<div key={tipekamar.id} className="w-full max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
  <img
    className="object-cover object-center w-full h-56"
    src={
        "http://localhost:8080/gambar/" + tipekamar.foto  
      }
    alt="avatar"
  />
  <div className="flex items-center px-6 py-3 bg-gray-900">
    <svg
      aria-label="headphones icon"
      className="w-6 h-6 text-white fill-current"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 21C15.8954 21 15 20.1046 15 19V15C15 13.8954 15.8954 13 17 13H19V12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12V13H7C8.10457 13 9 13.8954 9 15V19C9 20.1046 8.10457 21 7 21H3V12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12V21H17ZM19 15H17V19H19V15ZM7 15H5V19H7V15Z"
      />
    </svg>
    <h1 className="mx-3 text-lg font-semibold text-white">Relaxing</h1>
  </div>
  <div className="px-6 py-4">
    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
    {tipekamar.nama_tipe_kamar}
    </h1>
    <p className="py-2 text-gray-700 dark:text-gray-400">
    {tipekamar.deskripsi}
    </p>
    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
      <svg
        aria-label="suitcase icon"
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14 11H10V13H14V11Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7 5V4C7 2.89545 7.89539 2 9 2H15C16.1046 2 17 2.89545 17 4V5H20C21.6569 5 23 6.34314 23 8V18C23 19.6569 21.6569 21 20 21H4C2.34314 21 1 19.6569 1 18V8C1 6.34314 2.34314 5 4 5H7ZM9 4H15V5H9V4ZM4 7C3.44775 7 3 7.44769 3 8V14H21V8C21 7.44769 20.5522 7 20 7H4ZM3 18V16H21V18C21 18.5523 20.5522 19 20 19H4C3.44775 19 3 18.5523 3 18Z"
        />
      </svg>
      <h1 className="px-2 text-sm">Rp   {tipekamar.harga}</h1>
    </div>
    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
      <svg
        aria-label="location pin icon"
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.063 10.063 6.27214 12.2721 6.27214C14.4813 6.27214 16.2721 8.063 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16757 11.1676 8.27214 12.2721 8.27214C13.3767 8.27214 14.2721 9.16757 14.2721 10.2721Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.3941 5.48178 3.79418C8.90918 0.194258 14.6059 0.0543983 18.2059 3.48179C21.8058 6.90919 21.9457 12.606 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.9732 6.93028 5.17326C9.59603 2.37332 14.0268 2.26454 16.8268 4.93029C19.6267 7.59604 19.7355 12.0269 17.0698 14.8268Z"
        />
      </svg>
      <h1 className="px-2 text-sm">Malang</h1>
    </div>
    
  </div>
  <button
            onClick={() => {
              setSelectedTipeKamar(tipekamar.nama_tipe_kamar); // Set the selected tipe_kamar
              handleModalAddToggle();
            }}
            type="button"
            className="inline-block rounded mx-auto w-full bg-gray-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white "
          >
            Book Now
          </button>
</div>))}



</div>
        </section>
        </div>
        
        
        <Footer/>
        </>
    );
}