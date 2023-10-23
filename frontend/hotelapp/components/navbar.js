import Link from "next/link";

function Navcust(){
  const handleLogout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('nama_user');
    window.localStorage.removeItem('role');
    window.localStorage.removeItem('id');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('nama');
    window.localStorage.removeItem('username');
    window.location.href = '/pagescustomer/logincust';
  };
    return(
        
        
        <nav className="flex items-center justify-between px-20 py-10 bg-white">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
  <h1 className=" cursor-pointer text-3xl font-bold text-gray-800">DannHotel</h1>
  <div className="flex items-center">
    {/* <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 pt-0.5 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        className="ml-2 bg-transparent outline-none font-"
        type="text"
        name="search"
        id="search"
        placeholder="Search..."
      />
    </div> */}
    <ul className="cursor-pointer flex items-center space-x-6">
    <li><Link href="/pagescustomer/dashboardcust" className="font-semibold text-gray-700">Home</Link></li>
      <li><Link href="/pagescustomer/booking" className="font-semibold text-gray-700">Booking</Link></li>
      {/* <li>
      <i className="fa fa-shopping-cart fa-lg"></i>
      </li>
      <li>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </li> */}
      <li>
      <Link href="/pagescustomer/history" className="font-semibold text-gray-700">History
       
        </Link>
      </li>
      <li>
      <a  onClick={handleLogout} className="font-semibold text-gray-700">Logout
       
        </a>
      </li>
    </ul>
  </div>
</nav>

    );
}
export default Navcust;