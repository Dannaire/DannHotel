import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/router";


export default function Tipekamar() {
  const [tipekamarData, setTipeKamarData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedTipeKamarData, setUpdatedTipeKamarData] = useState({});
  const [userRole, setUserRole] = useState('');
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
    const storedUserRole = localStorage.getItem('role');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

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

  const deleteTipeKamar = (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (confirmDelete) {
      // Perform the deletion
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:8080/tipe_kamar/delete/${userId}`, {
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
  
      if (searchTerm.trim() === "") {
        // If the search term is empty, fetch all data
        await fetchData();
      } else {
        // Make a request to search for tipe_kamar
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
  
        // Set the search results
        setTipeKamarData(response.data.data);
        // Log the search results
        console.log(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const updateTipeKamar = async (tipekamarId, newData) => {
    try {
      const token = localStorage.getItem("token");
  
      const formData = new FormData();
      formData.append("nama_tipe_kamar", newData.nama_tipe_kamar);
      formData.append("deskripsi", newData.deskripsi);
      formData.append("harga", newData.harga);
      if (newData.foto) {
        formData.append("foto", newData.foto); // Append the foto file if it exists
      }
  
      const response = await axios.put(
        `http://localhost:8080/tipe_kamar/update/${tipekamarId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };
  

  const [selectedTipeKamarId, setSelectedTipeKamarId] = useState(null);

  const handleModalToggle = (tipekamarId) => {
    setSelectedTipeKamarId(tipekamarId === selectedTipeKamarId ? null : tipekamarId);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    // Get the file input element
    const fileInput = document.getElementById("foto");
    // Get the selected file (assuming single file selection)
    const photoFile = fileInput.files[0];

    // Call the updateUser function with the selected user ID and updated user data
    updateTipeKamar(selectedTipeKamarId, updatedTipeKamarData, photoFile);

    // Close the modal
    handleModalToggle(selectedTipeKamarId);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    try {
      const formData = new FormData();
      formData.append("nama_tipe_kamar", e.target.elements.nama_tipe_kamar.value);
      formData.append("deskripsi", e.target.elements.deskripsi.value);
      formData.append("harga", e.target.elements.harga.value);
      if (e.target.elements.foto.files[0]) {
        formData.append("foto", e.target.elements.foto.files[0]); // Append the foto file if it exists
      }
  
      const token = localStorage.getItem("token");
  
      const response = await axios.post("http://localhost:8080/tipe_kamar/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data.message === `New Tipe Kamar has been inserted`) {
        alert('Success Add Tipe Kamar');
        // window.location.href = '/pagescustomer/logincust';
        handleModalAddToggle(); // Close the modal

      } else {
        alert(response.data.message); // Display the server message
        if (response.data.message === 'Tipe kamar already exists') {
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
          {userRole === 'admin' && (
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
             This Is All Tipe Kamar
            </h2>

            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
              {tipekamarData.length} Tipe Kamar
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
                          className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <button className="flex items-center gap-x-2">
                            <span>Status</span>
                            <svg
                              className="h-3"
                              viewBox="0 0 10 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.1"
                              />
                              <path
                                d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.1"
                              />
                              <path
                                d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.3"
                              />
                            </svg>
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-28 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <button className="flex items-center gap-x-2">
                            <span>Deskripsi</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                              />
                            </svg>
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-32 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Harga
                        </th>
                        {userRole === 'admin' && (
                        <th
                          scope="col"
                          className="px-32 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Action
                        </th>
                        )}
                        {userRole === 'admin' && (
                        <th scope="col" className="relative py-3.5 px-4">
                        <button onClick={handleModalAddToggle} className="px-4 py-1.5 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
        Add
      </button>
                        </th>
                        )}
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
      Add Tipe Kamar
    </h3>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      Add new Tipe Kamar
    </p>
    <form
      className="mt-4"
      onSubmit={(e) => handleAddSubmit(e)}
    >
      <label
        htmlFor="emails-list"
        className="text-sm text-gray-700 dark:text-gray-200"
      >
        Nama Tipe Kamar
      </label>
      <label
        className="block mt-3"
        htmlFor="email"
      >
        <input
          type="text"
          name="nama_tipe_kamar"
          id="nama_tipe_kamar"
          placeholder="nama_tipe_kamar"
          //  defaultValue={user.nama_user
          className=" w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>
      <label
        className="block mt-3"
        htmlFor="email"
      >
        {" "}
        Deskripsi
        <input
          type="text"
          name="deskripsi"
          id="deskripsi"
          placeholder="deskripsi"
          //  defaultValue={user.email}

          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>
      <label
        className="block mt-3"
        htmlFor="harga"
      >
        {" "}
        Harga
        <input
          type="text"
          name="harga"
          id="harga"
          placeholder="800000"

          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          required
        />
      </label>
      <label
        className="block mt-3"
        htmlFor="foto"
      >
        Foto
        <input
          type="file"
          name="foto"
          id="foto"
          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
         
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
                      {tipekamarData.map((tipekamar) => (
                        <tr key={tipekamar.id}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center gap-x-3">
                              <input
                                type="checkbox"
                                className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                              />
                              <div className="flex items-center gap-x-2">
                                <img
                                  className="object-cover w-10 h-10 rounded-full"
                                  src={
                                    "http://localhost:8080/gambar/" + tipekamar.foto
                                  }
                                  alt=""
                                />
                                <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white">
                                    {tipekamar.nama_tipe_kamar}
                                  </h2>

                                  <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                    {tipekamar.harga}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <h2 className="text-sm font-normal text-emerald-500">
                                Active
                              </h2>
                            </div>
                          </td>
                          <td className="px-28 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {tipekamar.deskripsi}
                          </td>
                          <td className="px-32 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {tipekamar.harga}
                          </td>
                          {/* <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-x-2">
                          <p className="px-3 py-1 text-xs text-indigo-500 rounded-full dark:bg-gray-800 bg-indigo-100/60">Design</p>
                          <p className="px-3 py-1 text-xs text-blue-500 rounded-full dark:bg-gray-800 bg-blue-100/60">Product</p>
                          <p className="px-3 py-1 text-xs text-pink-500 rounded-full dark:bg-gray-800 bg-pink-100/60">Marketing</p>
                        </div>
                      </td> */}
                      {userRole === 'admin' && (
                          <td className="px-28 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-12">
                                
                              <button
                                onClick={() => deleteTipeKamar(tipekamar.id)}
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
                                onClick={() => handleModalToggle(tipekamar.id)}
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
                              {selectedTipeKamarId && (
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
                                      Update Tipe Kamar
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                      Update your Tipe Kamar
                                    </p>
                                    <form
                                      className="mt-4"
                                      onSubmit={(e) => handleUpdateSubmit(e)}
                                    >
                                      <label
                                        htmlFor="emails-list"
                                        className="text-sm text-gray-700 dark:text-gray-200"
                                      >
                                        Nama Tipe Kamar
                                      </label>
                                      <label
                                        className="block mt-3"
                                        htmlFor="email"
                                      >
                                        <input
                                          type="text"
                                          name="nama_tipe_kamar"
                                          id="nama_tipe_kamar"
                                          placeholder="nama_tipe_kamar"
                                          //  defaultValue={user.nama_user}
                                          onChange={(e) =>
                                            setUpdatedTipeKamarData({
                                              ...updatedTipeKamarData,
                                              nama_tipe_kamar: e.target.value,
                                            })
                                          }
                                          className=" w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                          required
                                        />
                                      </label>
                                      <label
                                        className="block mt-3"
                                        htmlFor="email"
                                      >
                                        {" "}
                                        Deskripsi
                                        <input
                                          type="text"
                                          name="deskripsi"
                                          id="deskripsi"
                                          placeholder="deskripsi"
                                          //  defaultValue={user.email}
                                          onChange={(e) =>
                                            setUpdatedTipeKamarData({
                                              ...updatedTipeKamarData,
                                              deskripsi: e.target.value,
                                            })
                                          }
                                          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                          required
                                        />
                                      </label>
                                      <label
                                        className="block mt-3"
                                        htmlFor="password"
                                      >
                                        {" "}
                                        harga
                                        <input
                                          type="text"
                                          name="harga"
                                          id="harga"
                                          placeholder="700000"
                                          onChange={(e) =>
                                            setUpdatedTipeKamarData({
                                              ...updatedTipeKamarData,
                                              harga: e.target.value,
                                            })
                                          }
                                          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                          required
                                        />
                                      </label>
                                     
                                      <label
                                        className="block mt-3"
                                        htmlFor="foto"
                                      >
                                        Foto
                                        <input
                                          type="file"
                                          name="foto"
                                          id="foto"
                                          className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                          onChange={(e) => {
                                            const file = e.target.files[0];
                                            setUpdatedTipeKamarData({
                                              ...updatedTipeKamarData,
                                              foto: file,
                                            });
                                          }}
                                        />
                                      </label>

                                  
                                      <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                                        <button
                                        onClick={() => handleModalToggle(tipekamar.id)}
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
