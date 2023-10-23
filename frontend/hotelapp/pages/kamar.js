import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/router";

export default function Kamar() {
  const [kamarData, setKamarData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const storedUserRole = localStorage.getItem('role');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);
  const router = useRouter();

  useEffect(() => {
    // Check if user-related data exists in local storage
    const role = localStorage.getItem('role');
  
    if (!role) {
      // Redirect the user to the login page
      router.push('/login');
    } if (role === 'tamu') {
      // Redirect the user to the 'tamu' login page
      router.push('/pagescustomer/logincust');
    }  else if (role !== 'resepsionis' && role !== 'admin') {
      // Redirect the user to the default login page for other roles
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    // Set a timeout to show the admin greeting after 2 seconds
    const timeoutId = setTimeout(() => {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        setShowAdmin(true);
      }
    }, 2000);

    return () => clearTimeout(timeoutId); // Clear the timeout if component unmounts

  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Retrieve JWT token from local storage
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8080/kamar/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setKamarData(response.data);
      console.log("Fetched data:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteKamar = (kamarId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (confirmDelete) {
      // Perform the deletion
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:8080/kamar/delete/${kamarId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          // Refresh user data after deletion
          fetchData();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
  
    try {
      // Retrieve JWT token from local storage
      const token = localStorage.getItem("token");
  
      // Check if the search term is empty
      if (searchTerm.trim() === "") {
        // If it's empty, fetch all data
        await fetchData();
      } else {
        // If it's not empty, make a request to search for users
        const response = await axios.post(
          "http://localhost:8080/kamar/find",
          {
            nomor_kamar: searchTerm,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Set the search results
        setKamarData(response.data.data);
        // Log the search results
        console.log(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleUpdateSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
  
    try {
      const token = localStorage.getItem("token");
      const kamarId = selectedKamarId; // Get the selected user ID
  
      const updatedData = {
        nomor_kamar: nomorKamar,
        nama_tipe_kamar: namaTipeKamar,
      };
  
      console.log("Data being sent in PUT:", updatedData);
  
      await axios.put(
        `http://localhost:8080/kamar/update/${kamarId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      fetchData(); // Refresh the user data
  
      handleUpdateModalToggle(selectedKamarId); // Close the modal
    } catch (error) {
      console.error(error);
    }
  };
  
  const [nomorKamar, setNomorKamar] = useState("");
  const [namaTipeKamar, setNamaTipeKamar] = useState("");
  const handleNomorKamarChange = (e) => {
    setNomorKamar(e.target.value);
  };

  const handleNamaTipeKamarChange = (e) => {
    setNamaTipeKamar(e.target.value);
  };
  const [selectedKamarId, setSelectedKamarId] = useState(null);
  
  const handleUpdateModalToggle = (kamarId) => {
    setSelectedKamarId(kamarId === selectedKamarId ? null : kamarId);
  };
  

  // const handleUpdateSubmit = (e) => {
  //   e.preventDefault();

  //   const photoFile = fileInput.files[0];

  //   updateUser(selectedUserId, updatedUserData, photoFile);

  //   handleModalToggle(selectedUserId);
  // };

  const handleAddSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    try {
      const token = localStorage.getItem("token");
      const nomorKamar = document.getElementById("nomor_kamar").value;
      const namaTipeKamar = document.getElementById("nama_tipe_kamar").value;
  
      const postData = {
        nomor_kamar: nomorKamar,
        nama_tipe_kamar: namaTipeKamar,
      };
  
      console.log("Data being sent in POST:", postData);
  
      const response = await axios.post("http://localhost:8080/kamar/add", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.message === `New Member has been inserted`) {
        alert('Success Add Kamar');
        // window.location.href = '/pagescustomer/logincust';
        handleModalAddToggle(); // Close the modal
      } else {
        alert(response.data.message); // Display the server message
        if (response.data.message === 'Nomor kamar already exists') {
          // For example:
          // alert('Email already exists. Please use a different email.');
        }
      }
  
      fetchData(); // Refresh the user data
  
      
    } catch (error) {
      console.error(error);
  
      if (error.response && (error.response.status === 500 || error.response.status === 404)) {
        window.alert('Failed to register');
      }
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
  useEffect(() => {
    // Check if user-related data exists in local storage
    const role = localStorage.getItem('role');
  
  if (role === 'resepsionis') {
    // Redirect the user to the 'tamu' login page
    router.push('/dashboard');
  }
}, []);
  return (
    <>
      <div
        className="flex flex-row min-h-screen bg-gray-100 text-gray-800"
        style={{ overflowX: "hidden" }}
      >
        <Sidebar />
        <section className="container px-2 mx-auto mt-8"> 
          <div className="flex items-center gap-x-3">
          {showAdmin && (
             <h2 className="text-lg font-medium my-2 text-gray-800 dark:text-white">
              Hi Admin
            </h2>
            )}
            {userRole === 'resepsionis' && (
            <h2 className="text-lg font-medium my-2 text-gray-800 dark:text-white">
              Hi Resepsionis,
            </h2>
            )}
            <h2 className="text-lg font-medium my-2 text-gray-800 dark:text-white">
             This Is All Kamar
            </h2>

            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
              {kamarData.length} kamar
            </span>
          </div>
          <form onSubmit={handleSearch}>
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
                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form>
          <div className="flex flex-col mt-6">
            <div className="mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex items-center gap-x-3">
                            <input
                              type="checkbox"
                              className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                            />
                            <span>Name</span>
                          </div>
                        </th>

                        <th
                          scope="col"
                          className="px-24 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Room Number
                        </th>
                        <th
                          scope="col"
                          className="px-24 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Room Type
                        </th>
                        {showAdmin && (
                        <th
                          scope="col"
                          className="px-32 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Action
                        </th>
                        )} 
                        <th scope="col" className="relative py-3.5 px-4">
                        {showAdmin && (
                          <button
                            onClick={handleModalAddToggle}
                            className="px-4 py-1.5 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                          >
                            Add
                          </button>
                           )}
                        </th>
                      </tr>
                    </thead>
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
                            Add Kamar
                          </h3>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Add new kamar
                          </p>
                          <form
                            className="mt-4"
                            onSubmit={(e) => handleAddSubmit(e)}
                          >
                            <label
                              htmlFor="emails-list"
                              className="text-sm text-gray-700 dark:text-gray-200"
                            >
                              Nomor Kamar
                            </label>
                            <label className="block mt-3" htmlFor="email">
                              <input
                                type="text"
                                name="nomor_kamar"
                                id="nomor_kamar"
                                placeholder="nomor_kamar"
                                className=" w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                required
                              />
                            </label>
                            <label className="block mt-3">
                              {" "}
                              Nama Tipe kamar
                              <input
                                type="text"
                                name="nama_tipe_kamar"
                                id="nama_tipe_kamar"
                                placeholder="nama_tipe_kamar"
                                className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                required
                              />
                            </label>

                           
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
                    )}
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      {kamarData.map((kamar) => (
                        <tr key={kamar.id}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center gap-x-3">
                              <input
                                type="checkbox"
                                className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                              />
                              <div className="flex items-center gap-x-2">
                                {/* <img
                                  className="object-cover w-10 h-10 rounded-full"
                                  src={
                                    "http://localhost:8080/gambar/" + kamar.foto
                                  }
                                  alt=""
                                /> */}
                                <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white">
                                    {kamar.nama_tipe_kamar}
                                  </h2>

                                  <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                    {kamar.nomor_kamar}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-28 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {kamar.nomor_kamar}
                          </td>
                          <td className="px-28 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {kamar.nama_tipe_kamar}
                          </td>
                          {/* <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-x-2">
                          <p className="px-3 py-1 text-xs text-indigo-500 rounded-full dark:bg-gray-800 bg-indigo-100/60">Design</p>
                          <p className="px-3 py-1 text-xs text-blue-500 rounded-full dark:bg-gray-800 bg-blue-100/60">Product</p>
                          <p className="px-3 py-1 text-xs text-pink-500 rounded-full dark:bg-gray-800 bg-pink-100/60">Marketing</p>
                        </div>
                      </td> */}
                          {userRole=== 'admin' && (
                          <td className="px-28 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-12">
                              <button
                                onClick={() => deleteKamar(kamar.id)}
                                className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                              <button
                                className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                                onClick={() =>
                                  handleUpdateModalToggle(kamar.id)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                              </button>
                              {selectedKamarId && (
                                <div className="fixed inset-0 z-50 bg-black bg-opacity-25 flex items-center justify-center">
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
                                      Update kamar
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                      Update your Kamar
                                    </p>
                                    <form
                                      className="mt-4"
                                      onSubmit={(e) => handleUpdateSubmit(e)}
                                    >
                                    <label htmlFor="nomor_kamar" className="text-sm text-gray-700 dark:text-gray-200">
    Nomor Kamar
  </label>
                                      <label
                                        className="block mt-3"
                                        htmlFor="email"
                                      >
                                        <input
                                          type="text"
                                          name="nomor_kamar"
                                          id="nomor_kamar"
                                          placeholder="nomor_kamar"
                                          onChange={handleNomorKamarChange}
                                          className=" w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                          required
                                        />
                                      </label>
                                      <label htmlFor="nama_tipe_kamar" className="block mt-3 text-sm text-gray-700 dark:text-gray-200">
    Nama Tipe kamar
  </label>
                                      <label className="block mt-3">
                                    
                                        <input
                                          type="text"
                                          name="nama_tipe_kamar"
                                          id="nama_tipe_kamar"
                                          placeholder="nama_tipe_kamar"
                                          onChange={handleNamaTipeKamarChange}
                                          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                          required
                                        />
                                      </label>
                                      <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                                        <button
                                          onClick={() =>
                                            handleUpdateModalToggle()
                                          }
                                          type="button"
                                          className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                                        >
                                          Cancel
                                        </button>

                                        <button
                                          type="submit"
                                          className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                        >
                                          Update
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                           )}
                          <td className=" text-sm whitespace-nowrap"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <a
              href="#"
              className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
              <span>previous</span>
            </a>
            <div className="items-center hidden lg:flex gap-x-3">
              <a
                href="#"
                className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60"
              >
                1
              </a>
              <a
                href="#"
                className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
              >
                2
              </a>
              <a
                href="#"
                className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
              >
                3
              </a>
              <a
                href="#"
                className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
              >
                ...
              </a>
              <a
                href="#"
                className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
              >
                12
              </a>
              <a
                href="#"
                className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
              >
                13
              </a>
              <a
                href="#"
                className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
              >
                14
              </a>
            </div>
            <a
              href="#"
              className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <span>Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
