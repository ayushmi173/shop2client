import React, { useState } from 'react';
import { NextPage } from 'next';
import { useAppDispatch } from 'redux-store';
import { registerUser } from 'redux-store/thunks/auth';

const Registration: NextPage = () => {
    const dispatch = useAppDispatch();
    const [registrationData, setRegistrationData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        contactNumber: '',
        password: '',
        confirmPassword: '',
    });

    const handleFieldChange = (key: string, value: string) => {
        setRegistrationData((previousRegistrationData) => ({
            ...previousRegistrationData,
            [key]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        dispatch(
            registerUser({
                ...registrationData,
            }),
        );
    };

    return (
        <div className="h-screen bg-gradient-to-br from-blue-600 to-indigo-600 flex justify-center items-center w-full">
            <form onSubmit={handleSubmit}>
                <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
                    <div className="space-y-4">
                        <h1 className="text-center text-2xl font-semibold text-gray-600">
                            Register
                        </h1>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-1 text-gray-600 font-semibold"
                            >
                                FirstName
                            </label>
                            <input
                                type="text"
                                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    handleFieldChange(
                                        'firstName',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-1 text-gray-600 font-semibold"
                            >
                                LastName
                            </label>
                            <input
                                type="text"
                                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    handleFieldChange(
                                        'lastName',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-1 text-gray-600 font-semibold"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    handleFieldChange(
                                        'username',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-1 text-gray-600 font-semibold"
                            >
                                Contact Number
                            </label>
                            <input
                                type="text"
                                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    handleFieldChange(
                                        'contactNumber',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-1 text-gray-600 font-semibold"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    handleFieldChange(
                                        'password',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-1 text-gray-600 font-semibold"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    handleFieldChange(
                                        'confirmPassword',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Registration;
