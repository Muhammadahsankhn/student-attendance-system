import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";
import UserDropdown from "./UserDropdown";

function Card() {
  const [user, setUser] = useState(null);
  const [roleData, setRoleData] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      console.error("User ID not found in localStorage");
      return;
    }

    axios.get(`http://localhost:5000/get_user/${user_id}`)
      .then(res => {
        setUser(res.data.user);
        setRoleData(res.data.role_data);
      })
      .catch(err => console.error("Error fetching user:", err));
  }, []);

  if (!user || !roleData) return <div>Loading...</div>;

  return (
    <SidebarProvider>
      <div className="p-4">
        {/* <UserDropdown /> */}
      </div>
      <AppSidebar />
      <SidebarTrigger />

      <main className="ml-[240px] p-4">
        <div className="max-w-xl mx-auto  rounded-xl p-6 text-center">

          <div className='border-black border-4 my-4'>

            <div className='flex border-b-3 border-black'>
              <div className=''>
                <img src="https://upload.wikimedia.org/wikipedia/en/8/8d/SSUET_Logo.png" alt="logo" className='w-[80px] h-[80px] m-2' />
              </div>
              <div className='border-l-3 border-black pl-2'>
                <h1 className='font-extrabold text-xl place-self-center '>Sir Syed University</h1>
                <p className='font-bold text-xl place-self-center'>of Engineering & Technology</p>
                <div>
                  <p className="">{user.role}<strong> ID Card</strong></p>
                </div>
              </div>
            </div>


            <div className='flex justify-between'>
              <div className="">

                <div className="flex">
                  <p className="w-28 font-semibold text-start pl-2">Name:</p>
                  <p>{user.name}</p>
                </div>


                <div className="flex">
                  <p className="w-28 font-semibold text-start pl-2">DOB:</p>
                  <p>{new Date(user.dob).toLocaleDateString('en-US')}</p>
                </div>


                <div className="flex">
                  <p className="w-28 font-semibold text-start pl-2">Department:</p>
                  <p>{user.department}</p>
                </div>

                {/* Student-specific info */}
                {user.role === 'student' && (
                  <div className="flex">
                    <p className="w-28 font-semibold text-start pl-2">Roll No:</p>
                    <p>{roleData.batch}F-{roleData.roll_number}</p>
                  </div>
                )}

                {/* Teacher-specific info */}
                {user.role === 'teacher' && (
                  <>
                    <div className="flex">
                      <p className="w-28 font-semibold text-start pl-2">Designation:</p>
                      <p>{roleData.designation}</p>
                    </div>
                  </>
                )}

                <div className="flex">
                  <p className="w-28 font-semibold text-start pl-2">User ID:</p>
                  <p>{user.id}</p>
                </div>
                {user.role === 'student' && (
                  <div className='w-[10rem] bg-purple-800 text-white font-medium text-md text-start px-2 m-2 rounded'>
                    FALL {roleData.batch}
                  </div>
                )}
              </div>


              <div className='flex justify-end place-self-center mx-2'>
                {roleData.image && (
                  <img
                    src={`http://localhost:5000/uploads/${roleData.image}`}
                    alt="Profile"
                    className="w-[100px] h-[100px] border border-purple-500"
                  />
                )}
              </div>

            </div>
          </div>




          <div className='relative border-black border-4 overflow-hidden'>

            {/* Background Logo */}
            <img
              src="https://upload.wikimedia.org/wikipedia/en/8/8d/SSUET_Logo.png"
              alt="SSUET Logo"
              className="absolute inset-0 w-full h-full object-contain opacity-10 z-0"
            />

            {/* Foreground Content */}
            <div className='relative z-10 pl-2'>
              <h1 className='font-bold text-xl place-self-center'>
                Sir Syed University<br />
                <p className='font-medium text-sm place-self-center'>of Engineering & Technology</p>
              </h1>
            </div>

            <div className='relative z-10 flex items-center justify-center'>

              <div>
                {roleData.qr_code && (
                  <img
                    src={`http://localhost:5000/uploads/${roleData.qr_code}`}
                    alt="QR Code"
                    className="w-[150px] h-[150px]"
                  />
                )}
              </div>

              <div>
                <div className="flex">
                  <p className="w-28 font-semibold text-start pl-2">Email:</p>
                  <p>{user.email}</p>
                </div>

                <div className="flex">
                  <p className="w-28 text-start pl-2 font-semibold">Phone:</p>
                  <p>{user.phone}</p>
                </div>

                <div className="flex">
                  <p className="w-28 text-start pl-2 font-semibold">Address:</p>
                  <p>{user.address}</p>
                </div>
              </div>

            </div>

            <div className='text-start px-2'>
              <p className='font-medium '>If found please return to:</p>
              <p className='text-sm'>Sir Syed University of Engineering & Technology</p>
            </div>
          </div>



        </div>
      </main>
    </SidebarProvider>
  );
}

export default Card;
