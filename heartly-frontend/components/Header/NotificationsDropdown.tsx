const NotificationsDropdown = () => {
  return (
    <div className="hs-dropdown [--auto-close:inside] relative inline-flex">
      <div className="hs-tooltip [--placement:bottom] inline-block">
        <button
          id="hs-pro-dnnd"
          type="button"
          className="hs-tooltip-toggle relative size-[38px] inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          aria-label="Notifications"
        >
          <svg
            className="flex-shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="flex absolute top-0 end-0 z-10 -mt-1.5 -me-1.5">
            <span className="animate-ping absolute inline-flex size-full rounded-full bg-red-400 opacity-75 dark:bg-red-600"></span>
            <span className="relative min-w-[18px] min-h-[18px] inline-flex justify-center items-center text-[10px] bg-red-500 text-white rounded-full px-1">
              2
            </span>
          </span>
        </button>
        <span
          className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
          role="tooltip"
        >
          Notifications
        </span>
      </div>
      <div
        className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-full sm:w-96 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white border-t border-gray-200 sm:border-t-0 sm:rounded-lg shadow-md sm:shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_10px_rgba(0,0,0,0.2)] dark:bg-neutral-900 dark:border-neutral-700"
        aria-labelledby="hs-pro-dnnd"
      >
        <div className="px-5 pt-3 flex justify-between items-center border-b border-gray-200 dark:border-neutral-800">
          <nav className="flex space-x-1 " aria-label="Tabs">
            <button
              type="button"
              className="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 active"
              id="hs-pro-tabs-dnn-item-all"
              data-hs-tab="#hs-pro-tabs-dnn-all"
              aria-controls="hs-pro-tabs-dnn-all"
              role="tab"
            >
              All
            </button>
            <button
              type="button"
              className="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 "
              id="hs-pro-tabs-dnn-item-archived"
              data-hs-tab="#hs-pro-tabs-dnn-archived"
              aria-controls="hs-pro-tabs-dnn-archived"
              role="tab"
            >
              Archived
            </button>
          </nav>

          <div className="hs-tooltip relative inline-block mb-3">
            <a
              className="hs-tooltip-toggle size-7 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              href="../../pro/dashboard/account-profile.html"
              aria-label="Preferences"
            >
              <svg
                className="flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </a>
            <span
              className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
              role="tooltip"
            >
              Preferences
            </span>
          </div>
        </div>

        <div
          id="hs-pro-tabs-dnn-all"
          role="tabpanel"
          aria-labelledby="hs-pro-tabs-dnn-item-all"
        >
          <div className="h-[480px] overflow-y-auto overflow-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <ul className="divide-y divide-gray-200 dark:divide-neutral-800">
              <li className="relative group w-full flex gap-x-5 text-start p-5 bg-gray-100 dark:bg-neutral-800">
                <div className="relative flex-shrink-0">
                  <img
                    className="flex-shrink-0 size-[38px] rounded-full"
                    src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                    alt="issue profile img"
                  />
                  <span className="absolute top-4 -start-3 size-2 bg-blue-600 rounded-full dark:bg-blue-500"></span>
                </div>
                <div className="grow">
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    2 hours ago
                  </p>

                  <span className="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                    Eilis Warner
                  </span>
                  <p className="text-sm text-gray-500 dark:text-neutral-500">
                    changed an issue from 'in Progress' to 'Review'
                  </p>
                </div>

                <div>
                  <div className="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                    <div className="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="flex items-center">
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 11 12 14 22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            <svg
                              className="flex-shrink-0 size-4 hidden"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="M8 12h8" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Mark this notification as read
                          </span>
                        </div>
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="20" height="5" x="2" y="4" rx="2" />
                              <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                              <path d="M10 13h4" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Archive this notification
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="relative group w-full flex gap-x-5 text-start p-5 ">
                <div className="relative flex-shrink-0">
                  <span className="flex flex-shrink-0 justify-center items-center size-[38px] bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                    C
                  </span>
                </div>
                <div className="grow">
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    3 days ago
                  </p>

                  <span className="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                    Clara Becker
                  </span>
                  <p className="text-sm text-gray-500 dark:text-neutral-500">
                    mentioned you in a comment
                  </p>
                  <div className="mt-2">
                    <blockquote className="ps-3 border-s-4 border-gray-200 text-sm text-gray-500 dark:border-neutral-700 dark:text-neutral-400">
                      Nice work, love! You really nailed it. Keep it up!
                    </blockquote>
                  </div>
                </div>

                <div>
                  <div className="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                    <div className="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="flex items-center">
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 11 12 14 22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            <svg
                              className="flex-shrink-0 size-4 hidden"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="M8 12h8" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Mark this notification as read
                          </span>
                        </div>
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="20" height="5" x="2" y="4" rx="2" />
                              <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                              <path d="M10 13h4" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Archive this notification
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="relative group w-full flex gap-x-5 text-start p-5 ">
                <div className="relative flex-shrink-0">
                  <span className="flex flex-shrink-0 justify-center items-center size-[38px] bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                    P
                  </span>
                </div>
                <div className="grow">
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    5 Jan 2023
                  </p>

                  <span className="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                    New Update on Preline
                  </span>
                  <p className="text-sm text-gray-500 dark:text-neutral-500">
                    Add yourself to our new “Hire Page”. Let visitors know
                    you’re open to freelance or full-time work.
                  </p>
                  <a
                    className="mt-2 p-1.5 inline-flex items-center border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm focus:outline-none focus:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    href="/"
                  >
                    <img
                      className="w-[70px] h-[62px] object-cover rounded-lg"
                      src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                      alt="get hired"
                    />
                    <div className="grow py-2.5 px-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
                        Get hired!
                      </p>
                      <p className="inline-flex items-center gap-x-1 text-sm text-gray-500 dark:text-neutral-500">
                        Get started
                        <svg
                          className="flex-shrink-0 size-4 transition ease-in-out group-hover:translate-x-1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </p>
                    </div>
                  </a>
                </div>

                <div>
                  <div className="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                    <div className="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="flex items-center">
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 11 12 14 22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            <svg
                              className="flex-shrink-0 size-4 hidden"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="M8 12h8" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Mark this notification as read
                          </span>
                        </div>
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="20" height="5" x="2" y="4" rx="2" />
                              <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                              <path d="M10 13h4" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Archive this notification
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="relative group w-full flex gap-x-5 text-start p-5 ">
                <div className="relative flex-shrink-0">
                  <span className="flex flex-shrink-0 justify-center items-center size-[38px] bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                    P
                  </span>
                </div>
                <div className="grow">
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    5 Jan 2023
                  </p>

                  <span className="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                    We’re updating our Privacy Policy as of 10th January
                    2023.content
                  </span>
                  <p>
                    <a
                      className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium focus:outline-none focus:underline dark:text-blue-400 dark:hover:text-blue-500"
                      href="/"
                    >
                      Learn more
                      <svg
                        className="flex-shrink-0 size-4 transition ease-in-out group-hover:translate-x-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </a>
                  </p>
                </div>

                <div>
                  <div className="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                    <div className="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="flex items-center">
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 11 12 14 22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            <svg
                              className="flex-shrink-0 size-4 hidden"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="M8 12h8" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Mark this notification as read
                          </span>
                        </div>
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="20" height="5" x="2" y="4" rx="2" />
                              <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                              <path d="M10 13h4" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Archive this notification
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="relative group w-full flex gap-x-5 text-start p-5 bg-gray-100 dark:bg-neutral-800">
                <div className="relative flex-shrink-0">
                  <img
                    className="flex-shrink-0 size-[38px] rounded-full"
                    src="https://images.unsplash.com/photo-1614880353165-e56fac2ea9a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                    alt="rubia"
                  />
                  <span className="absolute top-4 -start-3 size-2 bg-blue-600 rounded-full dark:bg-blue-500"></span>
                </div>
                <div className="grow">
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    31 Dec 2022
                  </p>

                  <span className="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                    Rubia Walter
                  </span>
                  <p className="text-sm text-gray-500 dark:text-neutral-500">
                    Joined the Slack group HS Team
                  </p>
                </div>

                <div>
                  <div className="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                    <div className="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="flex items-center">
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 11 12 14 22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            <svg
                              className="flex-shrink-0 size-4 hidden"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="M8 12h8" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Mark this notification as read
                          </span>
                        </div>
                        <div className="hs-tooltip relative inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700"
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="20" height="5" x="2" y="4" rx="2" />
                              <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                              <path d="M10 13h4" />
                            </svg>
                          </button>
                          <span
                            className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700"
                            role="tooltip"
                          >
                            Archive this notification
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="text-center border-t border-gray-200 dark:border-neutral-800">
            <a
              className="p-4 flex justify-center items-center gap-x-2 text-sm text-gray-500 font-medium sm:rounded-b-lg hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
              href="../../docs/index.html"
            >
              Mark all as read
            </a>
          </div>
        </div>

        <div
          id="hs-pro-tabs-dnn-archived"
          className="hidden"
          role="tabpanel"
          aria-labelledby="hs-pro-tabs-dnn-item-archived"
        >
          <div className="p-5 min-h-[533px]  flex flex-col justify-center items-center text-center">
            <svg
              className="w-48 mx-auto mb-4"
              width="178"
              height="90"
              viewBox="0 0 178 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="27"
                y="50.5"
                width="124"
                height="39"
                rx="7.5"
                fill="currentColor"
                className="fill-white dark:fill-neutral-800"
              />
              <rect
                x="27"
                y="50.5"
                width="124"
                height="39"
                rx="7.5"
                stroke="currentColor"
                className="stroke-gray-50 dark:stroke-neutral-700/10"
              />
              <rect
                x="34.5"
                y="58"
                width="24"
                height="24"
                rx="4"
                fill="currentColor"
                className="fill-gray-50 dark:fill-neutral-700/30"
              />
              <rect
                x="66.5"
                y="61"
                width="60"
                height="6"
                rx="3"
                fill="currentColor"
                className="fill-gray-50 dark:fill-neutral-700/30"
              />
              <rect
                x="66.5"
                y="73"
                width="77"
                height="6"
                rx="3"
                fill="currentColor"
                className="fill-gray-50 dark:fill-neutral-700/30"
              />
              <rect
                x="19.5"
                y="28.5"
                width="139"
                height="39"
                rx="7.5"
                fill="currentColor"
                className="fill-white dark:fill-neutral-800"
              />
              <rect
                x="19.5"
                y="28.5"
                width="139"
                height="39"
                rx="7.5"
                stroke="currentColor"
                className="stroke-gray-100 dark:stroke-neutral-700/30"
              />
              <rect
                x="27"
                y="36"
                width="24"
                height="24"
                rx="4"
                fill="currentColor"
                className="fill-gray-100 dark:fill-neutral-700/70"
              />
              <rect
                x="59"
                y="39"
                width="60"
                height="6"
                rx="3"
                fill="currentColor"
                className="fill-gray-100 dark:fill-neutral-700/70"
              />
              <rect
                x="59"
                y="51"
                width="92"
                height="6"
                rx="3"
                fill="currentColor"
                className="fill-gray-100 dark:fill-neutral-700/70"
              />
              <g filter="url(#filter15)">
                <rect
                  x="12"
                  y="6"
                  width="154"
                  height="40"
                  rx="8"
                  fill="currentColor"
                  className="fill-white dark:fill-neutral-800"
                  shapeRendering="crispEdges"
                />
                <rect
                  x="12.5"
                  y="6.5"
                  width="153"
                  height="39"
                  rx="7.5"
                  stroke="currentColor"
                  className="stroke-gray-100 dark:stroke-neutral-700/60"
                  shapeRendering="crispEdges"
                />
                <rect
                  x="20"
                  y="14"
                  width="24"
                  height="24"
                  rx="4"
                  fill="currentColor"
                  className="fill-gray-200 dark:fill-neutral-700 "
                />
                <rect
                  x="52"
                  y="17"
                  width="60"
                  height="6"
                  rx="3"
                  fill="currentColor"
                  className="fill-gray-200 dark:fill-neutral-700"
                />
                <rect
                  x="52"
                  y="29"
                  width="106"
                  height="6"
                  rx="3"
                  fill="currentColor"
                  className="fill-gray-200 dark:fill-neutral-700"
                />
              </g>
              <defs>
                <filter
                  id="filter15"
                  x="0"
                  y="0"
                  width="178"
                  height="64"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="6" />
                  <feGaussianBlur stdDeviation="6" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_1187_14810"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_1187_14810"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>

            <div className="max-w-sm mx-auto">
              <p className="mt-2 font-medium text-gray-800 dark:text-neutral-200">
                No archived notifications
              </p>
              <p className="mb-5 text-sm text-gray-500 dark:text-neutral-500">
                We'll notify you about important updates and any time you're
                mentioned on Preline.
              </p>
            </div>

            <a
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              href="/"
            >
              Notifications settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
