import axios from 'axios';
import { useState,useEffect } from 'react';

export default function Register() {

  const [nama_user, setNamaUser] = useState('');
  const [email, setEmailUser] = useState('');
  const [password, setPasswordUser] = useState('');
  const [foto, setFoto] = useState(null); 
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Check if user-related data exists in local storage
    if (localStorage.getItem('id') || localStorage.getItem('token')) {
      // Display an alert message
      // window.alert('Anda harus logout dahulu untuk mengakses halaman login.');
      // Redirect the user to another page (e.g., dashboard)
      window.location.href = '/pagescustomer/dashboardcust';
    }
  }, []);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('nama_user', nama_user);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', 'tamu');
  
    // Check if a file is selected before appending it to FormData
    if (file) {
      formData.append('foto', file);
    }
  
    try {
      const url = 'http://localhost:8080/user/addtamu';
      const response = await axios.post(url, formData);
  
      if (response.data.message === `New User has been inserted`) {
        alert('Success Register');
        window.location.href = '/pagescustomer/logincust';
      } else {
        alert(response.data.message); // Display the server message
        if (response.data.message === 'Email already exists') {
          // For example:
          // alert('Email already exists. Please use a different email.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
  
      if (error.response && (error.response.status === 500 || error.response.status === 404)) {
        window.alert('Failed to register');
      }
    }
  };
  
  

  return (
  <>
    <div className="relative flex min-h-screen ">
    <div className="flex flex-col items-center flex-auto min-w-0 bg-white sm:flex-row md:items-start sm:justify-center md:justify-start">
      <div className="relative items-center justify-center flex-auto hidden h-full p-10 overflow-hidden text-white bg-purple-900 bg-no-repeat bg-cover sm:w-1/2 xl:w-3/5 md:flex" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1579451861283-a2239070aaa9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)'}}>
        <div className="absolute inset-0 z-0 opacity-75 bg-slate-800 from-indigo-600 to-blue-500" />
        <div className="z-10 w-full max-w-md">
          <div className="mb-6 font-bold leading-tight sm:text-4xl xl:text-5xl">Dann Hotel</div>
          <div className="font-normal text-gray-200 sm:text-sm xl:text-md"> Dann Hotel is a website for all who want merasakan sesuatu yang serasa di paradise.Dann hotel merupakan situs website terpercaya bagi anda yang kebingunan mencari hotel terbaik</div>
        </div>
        {/*-remove custom style*/}
        <ul className="circles">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
      </div>
      <div className="w-2/5 w-full p-8 bg-white md:flex md:items-center md:justify-center sm:w-auto md:h-full xl:w-2/5 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome!
            </h2>
            <p className="mt-2 text-sm text-gray-500">Please Register your account</p>
          </div>
          <div className="flex flex-row items-center justify-center space-x-3">
            <a href="https://www.behance.net/ajeeshmon" target="_blank" className="inline-flex items-center justify-center text-lg font-bold transition duration-300 ease-in bg-blue-900 cursor-pointer w-11 h-11 rounded-2xl hover:shadow-lg"><img className="w-4 h-4" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0xNS45OTcgMy45ODVoMi4xOTF2LTMuODE2Yy0uMzc4LS4wNTItMS42NzgtLjE2OS0zLjE5Mi0uMTY5LTMuMTU5IDAtNS4zMjMgMS45ODctNS4zMjMgNS42Mzl2My4zNjFoLTMuNDg2djQuMjY2aDMuNDg2djEwLjczNGg0LjI3NHYtMTAuNzMzaDMuMzQ1bC41MzEtNC4yNjZoLTMuODc3di0yLjkzOWMuMDAxLTEuMjMzLjMzMy0yLjA3NyAyLjA1MS0yLjA3N3oiIGZpbGw9IiNmZmZmZmYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48L2c+PC9zdmc+" />
            </a><a href="https://twitter.com/ajeemon?lang=en" target="_blank" className="inline-flex items-center justify-center text-lg font-bold text-white transition duration-300 ease-in bg-blue-400 cursor-pointer w-11 h-11 rounded-2xl hover:shadow-lg"><img className="w-4 h-4" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDY4MS4zMzQ2NCA2ODEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTIwMC45NjQ4NDQgNTE1LjI5Mjk2OWMyNDEuMDUwNzgxIDAgMzcyLjg3MTA5NC0xOTkuNzAzMTI1IDM3Mi44NzEwOTQtMzcyLjg3MTA5NCAwLTUuNjcxODc1LS4xMTcxODgtMTEuMzIwMzEzLS4zNzEwOTQtMTYuOTM3NSAyNS41ODU5MzctMTguNSA0Ny44MjQyMTgtNDEuNTg1OTM3IDY1LjM3MTA5NC02Ny44NjMyODEtMjMuNDgwNDY5IDEwLjQ0MTQwNi00OC43NTM5MDcgMTcuNDYwOTM3LTc1LjI1NzgxMyAyMC42MzY3MTggMjcuMDU0Njg3LTE2LjIzMDQ2OCA0Ny44MjgxMjUtNDEuODk0NTMxIDU3LjYyNS03Mi40ODgyODEtMjUuMzIwMzEzIDE1LjAxMTcxOS01My4zNjMyODEgMjUuOTE3OTY5LTgzLjIxNDg0NCAzMS44MDg1OTQtMjMuOTE0MDYyLTI1LjQ3MjY1Ni01Ny45NjQ4NDMtNDEuNDAyMzQ0LTk1LjY2NDA2Mi00MS40MDIzNDQtNzIuMzY3MTg4IDAtMTMxLjA1ODU5NCA1OC42ODc1LTEzMS4wNTg1OTQgMTMxLjAzMTI1IDAgMTAuMjg5MDYzIDEuMTUyMzQ0IDIwLjI4OTA2MyAzLjM5ODQzNyAyOS44ODI4MTMtMTA4LjkxNzk2OC01LjQ4MDQ2OS0yMDUuNTAzOTA2LTU3LjYyNS0yNzAuMTMyODEyLTEzNi45MjE4NzUtMTEuMjUgMTkuMzYzMjgxLTE3Ljc0MjE4OCA0MS44NjMyODEtMTcuNzQyMTg4IDY1Ljg3MTA5MyAwIDQ1LjQ2MDkzOCAyMy4xMzY3MTkgODUuNjA1NDY5IDU4LjMxNjQwNyAxMDkuMDgyMDMyLTIxLjUtLjY2MDE1Ni00MS42OTUzMTMtNi41NjI1LTU5LjM1MTU2My0xNi4zODY3MTktLjAxOTUzMS41NTA3ODEtLjAxOTUzMSAxLjA4NTkzNy0uMDE5NTMxIDEuNjcxODc1IDAgNjMuNDY4NzUgNDUuMTcxODc1IDExNi40NjA5MzggMTA1LjE0NDUzMSAxMjguNDY4NzUtMTEuMDE1NjI1IDIuOTk2MDk0LTIyLjYwNTQ2OCA0LjYwOTM3NS0zNC41NTg1OTQgNC42MDkzNzUtOC40Mjk2ODcgMC0xNi42NDg0MzctLjgyODEyNS0yNC42MzI4MTItMi4zNjMyODEgMTYuNjgzNTk0IDUyLjA3MDMxMiA2NS4wNjY0MDYgODkuOTYwOTM3IDEyMi40MjU3ODEgOTEuMDIzNDM3LTQ0Ljg1NTQ2OSAzNS4xNTYyNS0xMDEuMzU5Mzc1IDU2LjA5NzY1Ny0xNjIuNzY5NTMxIDU2LjA5NzY1Ny0xMC41NjI1IDAtMjEuMDAzOTA2LS42MDU0NjktMzEuMjYxNzE4OC0xLjgxNjQwNyA1Ny45OTk5OTk4IDM3LjE3NTc4MSAxMjYuODcxMDkzOCA1OC44NzEwOTQgMjAwLjg4NjcxODggNTguODcxMDk0IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PC9nPjwvc3ZnPg==" />
            </a><a href="https://in.linkedin.com/in/ajeeshmon" target="_blank" className="inline-flex items-center justify-center text-lg font-bold text-white transition duration-300 ease-in bg-blue-500 cursor-pointer w-11 h-11 rounded-2xl hover:shadow-lg"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0yMy45OTQgMjR2LS4wMDFoLjAwNnYtOC44MDJjMC00LjMwNi0uOTI3LTcuNjIzLTUuOTYxLTcuNjIzLTIuNDIgMC00LjA0NCAxLjMyOC00LjcwNyAyLjU4N2gtLjA3di0yLjE4NWgtNC43NzN2MTYuMDIzaDQuOTd2LTcuOTM0YzAtMi4wODkuMzk2LTQuMTA5IDIuOTgzLTQuMTA5IDIuNTQ5IDAgMi41ODcgMi4zODQgMi41ODcgNC4yNDN2Ny44MDF6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtLjM5NiA3Ljk3N2g0Ljk3NnYxNi4wMjNoLTQuOTc2eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTIuODgyIDBjLTEuNTkxIDAtMi44ODIgMS4yOTEtMi44ODIgMi44ODJzMS4yOTEgMi45MDkgMi44ODIgMi45MDkgMi44ODItMS4zMTggMi44ODItMi45MDljLS4wMDEtMS41OTEtMS4yOTItMi44ODItMi44ODItMi44ODJ6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PC9nPjwvc3ZnPg==" className="w-4 h-4" /></a>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-16 h-px bg-gray-200" />
            <span className="font-normal text-gray-300">or continue with</span>
            <span className="w-16 h-px bg-gray-200" />
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="relative">
              <div className="absolute mt-4 right-3"><svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <label className="ml-3 text-sm font-bold tracking-wide text-gray-700">Nama</label>
              <input className="w-full px-4 py-2 text-base border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500" id="nama" name="nama" placeholder="Alex" value={nama_user} onChange={(e) => setNamaUser(e.target.value)} required  />
            </div>
            <div className="content-center mt-8">
  <label className="ml-3 text-sm font-bold tracking-wide text-gray-700">Email</label>
  <input
    className="w-full px-4 py-2 text-base border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
    id="email"
    name="email"
    placeholder="example@gmail.com"
    value={email}
    onChange={(e) => setEmailUser(e.target.value)}
    required
    type="email"
    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
  />
</div>

            <div className="content-center mt-8">
              <label className="ml-3 text-sm font-bold tracking-wide text-gray-700">
                Password
              </label>
              <input className="content-center w-full px-4 py-2 text-base border-b border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-500"  id="password" name="password" type="password" placeholder="***" value={password} onChange={(e) => setPasswordUser(e.target.value)} required />
            </div>
            <div className="content-center mt-8">
            <label className="ml-3 text-sm font-bold tracking-wide text-gray-700">Foto</label>
            <input
  type="file"
  className="w-full px-4 py-2 text-base border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
  id="foto"
  name="foto"
  onChange={handleFileChange}
  required
/>
              </div>
            <div className="flex items-center justify-between">
            </div>
            <div>
              <button type="submit" className="flex justify-center w-full p-4 font-semibold tracking-wide text-gray-100 transition duration-500 ease-in rounded-full shadow-lg cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-600">
                Sign Up
              </button>
            </div>
            <p className="flex flex-col items-center justify-center mt-10 text-center text-gray-500 text-md">
              <span> Have an account?</span>
              <a href="/pagescustomer/logincust" className="text-indigo-400 no-underline transition duration-300 ease-in cursor-pointer hover:text-blue-500 hover:underline">Sign
                In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  </>
        );
    }

