export default function Modaluser() {
  
  return (
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
          Invite your team
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Your new project has been created. Invite your team to collaborate on
          this project.
        </p>
        <form className="mt-4" action="#">
          <label
            htmlFor="emails-list"
            className="text-sm text-gray-700 dark:text-gray-200"
          >
            Nama
          </label>
          <label className="block mt-3" htmlFor="email">
            <input
              type="text"
              name="email"
              id="email"
              placeholder="user@email.xyz"
              defaultValue="arlan"
              className=" w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </label>
          <label className="block mt-3" htmlFor="email">
            {" "}
            Email
            <input
              type="email"
              name="email"
              id="email"
              placeholder="user@email.xyz"
              className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </label>
          <label className="block mt-3" htmlFor="password">
            {" "}
            Password
            <input
              type="password"
              name="password"
              id="password"
              placeholder="***"
              className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </label>
          <label className="block mt-3" htmlFor="role">
            Role
            <select
              name="role"
              id="role"
              className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            >
              <option value="admin">admin</option>
              <option value="resepsionis">resepsionis</option>
              {/* <option value="guest">Guest</option> */}
            </select>
          </label>
          <label className="block mt-3" htmlFor="foto">
  Foto
  <input
    type="file"
    name="foto"
    id="foto"
    className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
  />
</label>

          <button
            type="button"
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
            <span className="mx-2">Add another</span>
          </button>
          <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
            <button
              type="button"
              className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
