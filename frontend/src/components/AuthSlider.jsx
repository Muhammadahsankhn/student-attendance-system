import React, { useState } from 'react';
import Registration from './Registration';
import Login from './Login';

const AuthSlider = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-8"
            style={{
                backgroundImage:
                    "url('https://images.saymedia-content.com/.image/t_share/MTkyOTkyMzE2OTQ3MDQ3NjQ1/website-background-templates.png')",
            }}>
            <div className="relative w-[768px] max-w-full h-[500px] overflow-hidden bg-gray-200 rounded-xl shadow-2xl">

                {/* Sliding Forms Container */}
                <div
                    className={`absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-700 ease-in-out ${isLogin ? '-translate-x-1/2' : 'translate-x-0'
                        }`}
                >
                    <div className="w-full h-full flex justify-center items-center p-10">
                        <div className="w-full h-full">
                            <Registration />
                        </div>
                    </div>

                    <div className="w-full h-full flex justify-center items-center p-10 max-w-md" >
                        <div className="w-full h-full ">
                            <Login />
                        </div>
                    </div>
                </div>

                {/* Overlay Container (Animated Background) */}
                <div
                    className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-10 transition-transform duration-700 ease-in-out ${isLogin ? '-translate-x-full' : 'translate-x-0'
                        }`}
                >
                    <div
                        className={`absolute left-[-100%] w-[200%] h-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-pink-500 to-orange-500 text-white flex`}
                        style={{
                            transform: isLogin ? 'translateX(50%)' : 'translateX(0)',
                        }}
                    >
                        {/* Left Panel */}
                        <div className="w-1/2 flex flex-col items-center justify-center px-10 text-center">
                            <h2 className="text-3xl font-bold">Welcome Back!</h2>
                            <p className="text-sm my-4">
                                To stay connected with us please login with your personal info.
                            </p>
                            
                            <button
                                onClick={() => setIsLogin(false)}
                                className="mt-4 border border-white px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-white hover:text-pink-600 transition cursor-pointer"
                            >
                                Register
                            </button>
                        </div>

                        {/* Right Panel */}
                        <div className="w-1/2 flex flex-col items-center justify-center px-10 text-center">
                            <h2 className="text-3xl font-bold">Hello!</h2>
                            <p className="text-sm mt-4 mb-1.5">
                                Already have an account?
                            </p>
                            <button
                                onClick={() => setIsLogin(true)}
                                className="border border-white px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-white hover:text-orange-600 transition cursor-pointer"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthSlider;
