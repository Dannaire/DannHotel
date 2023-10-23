import Navcust from "@/components/navbar";
import { Card } from "@/components/card";
import { Header } from "@/components/header";
import { Content } from "@/components/content";
import { Feature } from "@/components/feature";
import { Footer } from "@/components/footer";
// import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';

// import Sidebar from "@/components/sidebar";


export default function History() {
    

  const [pemesananData, setPemesananData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [updatedPemesananData, setUpdatedPemesananData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Retrieve JWT token from local storage
      const token = localStorage.getItem("token");
  
      // Retrieve the :id from local storage (assuming it's stored as "id")
      const id = localStorage.getItem("id");
  
      if (!id) {
        // Handle the case when :id is not found in local storage
        console.error("ID not found in local storage");
        return;
      }
  
      // Construct the URL with the :id parameter
      const url = `http://localhost:8080/pemesanan/${id}`;
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response.data.data);
      setPemesananData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const filteredPemesanan = pemesananData.filter((pemesanan) =>
  pemesanan.nama_pemesanan.toLowerCase().includes(searchTerm.toLowerCase())
);
  const handleSearch = (e) => {
    e.preventDefault();
    // Perform the search by filtering the data based on the searchTerm
    const filteredData = pemesananData.filter((pemesanan) =>
      pemesanan.nama_pemesanan.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPemesananData(filteredData);
  };

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
      <div
        className="flex flex-row min-h-screen bg-gray-100 text-gray-800 "
        style={{ overflowX: "hidden" }}
      >
        {/* <Sidebar /> */}
        <section className="container px-2 mx-auto mt-8 mb-24">
          <div className="flex items-center gap-x-3">
          
             {/* <h2 className="text-lg font-medium my-2 text-gray-800 dark:text-white">
              Hallo
            </h2> */}
           
            
          <h2 className="text-lg font-medium my-2 text-gray-800 dark:text-white">
            This Is All Riwayayat Pemesanan
            </h2>
       
            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
              {pemesananData.length} Pemesanan
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
                            <span>Nomor</span>
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
                          className="px-10 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <button className="flex items-center gap-x-2">
                            <span>Tamu</span>
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
                          className="px-10 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Tipe
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                           Kamar
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Booking
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Check In
                        </th>
                        <th
                          scope="col"
                          className="px-10   py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Check Out
                        </th>
                       
                        <th
                          scope="col"
                          className="px-14 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Print
                        </th>
                    
                        <th scope="col" className="relative py-3.5 px-4">
                        
                        </th>
                      </tr>
                    </thead>
                    
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      {filteredPemesanan.map((pemesanan) => (
                        <tr key={pemesanan.id}>
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
                                    "http://localhost:8080/gambar/" + tipekamar.foto
                                  }
                                  alt=""
                                /> */}
                                <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white">
                                    {pemesanan.nomor_pemesanan}
                                  </h2>

                                  <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                    {pemesanan.nama_pemesanan}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-gray-100/60 dark:bg-gray-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <h2 className="text-sm font-normal text-emerald-500">
                              {pemesanan.status_pemesanan}
                              </h2>
                            </div>
                          </td>
                          <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {pemesanan.nama_tamu}
                          </td>
                          <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {pemesanan.nama_tipe_kamar}
                          </td>
                          <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {pemesanan.jumlah_kamar}
                          </td>
                          <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {pemesanan.tgl_pemesanan.slice(0, 10)}
                          </td>
                          <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {pemesanan.tgl_check_in.slice(0, 10)}
                          </td>
                          <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {pemesanan.tgl_check_out.slice(0, 10)}
                          </td>
                    
                          <td className="px-10 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-12">
                                
                            <button
          onClick={() => {
            router.push(`/pagescustomer/struk/${pemesanan.id}`);
          }}
          className="pl-6 text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
        >
          {/* Your button content */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16"> <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/> <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/> </svg>
        </button>


                            </div>
                          </td>
                           
                          <td className=" text-sm whitespace-nowrap"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
        </section>
        
      </div>
      <Footer/>
    </>
  );
}
