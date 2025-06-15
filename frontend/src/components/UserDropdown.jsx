import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { LogOut } from "lucide-react";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export default function UserDropdown() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      console.error("User ID not found in localStorage");
      return;
    }

    axios.get(`http://localhost:5000/get_user/${user_id}`)
      .then(res => {
        const { user, role_data } = res.data;
        setUser({ ...user, ...role_data }); // Merge for easy access
      })
      .catch(err => console.error("Error fetching user:", err));
  }, []);


  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Avatar className="w-8 h-8">
            <AvatarImage src={`http://localhost:5000/uploads/${user.image}`} alt="User" />
            <AvatarFallback>{user.first_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
