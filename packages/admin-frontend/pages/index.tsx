import React, { useState } from 'react';
import Head from 'next/head';
import Compressor from 'compressorjs';
import axios from 'axios';
import Input from '../components/Input';
import Select from '../components/Select';

//move this into utils
export enum STOCK {
    AVAILABLE = 'available',
    NOT_AVALILABLE = 'not_available',
}

export enum CATAGORY_TYPE {
    SWEET = 'sweet',
    ITALIAN = 'italian',
    SOUTH_INDIAN = 'south_indian',
    INDIAN = 'indian',
    CHINESE = 'chinese',
    NORTH_INDIAN = 'north_indian',
    DESSERT = 'desert',
}

const Home: React.FC = () => {
    const [addData, setAddData] = useState({
        name: '',
        description: '',
        price: null,
        image: '',
        offer: null,
        catagoryId: '',
        stock: STOCK.AVAILABLE,
        quantity: '',
        catagoryType: CATAGORY_TYPE.CHINESE,
    });

    const handleFieldChange = (key: string, value: string | number): void => {
        setAddData({ ...addData, [key]: value });
    };

    const blobToFile = (theBlob: Blob, fileName: string): File => {
        return new File([theBlob], fileName, {
            lastModified: new Date().getTime(),
            type: theBlob.type,
        });
    };
    const handleImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        event.preventDefault();

        const reader = new FileReader();
        const input = event.target as HTMLInputElement;

        if (!input.files?.length) {
            return;
        }
        const image = input.files[0];
        console.log(image);

        new Compressor(image, {
            quality: 0.8,
            success: async (compressedImage) => {
                console.log('compressed', compressedImage);
                console.log(blobToFile(compressedImage, image.name));
                const formData = new FormData();
                formData.append(
                    'image',
                    blobToFile(compressedImage, image.name),
                );
                const rawResponse = await axios.post(
                    'http://localhost:6001/upload',
                    formData,
                );
                const { url } = await rawResponse.data;
                if (url) {
                    event.target.value = '';
                    handleFieldChange('image', url);
                }
            },
        });

        reader.onloadend = () => {
            if (image) reader.readAsDataURL(image);
        };
    };

    const handleCreate = async () => {
        const response = await axios.post(
            'http://localhost:6001/catagory/create',
            {
                name: addData.name,
                description: addData.description,
                // price: addData.price,
                image: addData.image,
                offer: addData.offer,
                stock: addData.stock,
                quantity: addData.quantity,
                catagory_type: addData.catagoryType,
            },
        );
        if (response.data) alert(JSON.stringify(response.data));
    };
    return (
        <div className="bg-gray-400">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex h-screen bg-gray-200 items-center justify-center  mt-32 mb-32">
                <div className="grid bg-white rounded-lg shadow-xl w-11/12 md:w-9/12 lg:w-1/2">
                    <div className="flex justify-center py-4">
                        <div className="flex bg-purple-200 rounded-full md:p-4 p-2 border-2 border-purple-300">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex">
                            <h1 className="text-gray-600 font-bold md:text-2xl text-xl">
                                Add Product / Catagory
                            </h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 mt-5 mx-7">
                        <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                            Name
                        </label>
                        <Input
                            className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            type="text"
                            placeholder="Name"
                            value={addData.name}
                            onChange={(value) =>
                                handleFieldChange('name', value)
                            }
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                        <div className="grid grid-cols-1">
                            <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                                Description
                            </label>
                            <Input
                                className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                type="text"
                                placeholder="Description"
                                value={addData.description}
                                onChange={(value) =>
                                    handleFieldChange('description', value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                                Quantity
                            </label>
                            <Input
                                className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                type="text"
                                placeholder="quantity"
                                value={addData.quantity}
                                onChange={(value) =>
                                    handleFieldChange('quantity', value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 mt-5 mx-7">
                        <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                            Catagory Type
                        </label>
                        <Select
                            className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            name="catagoryType"
                            options={[
                                {
                                    label: 'Chinese',
                                    value: CATAGORY_TYPE.CHINESE,
                                },
                                {
                                    label: 'Dessert',
                                    value: CATAGORY_TYPE.DESSERT,
                                },
                                {
                                    label: 'Italian',
                                    value: CATAGORY_TYPE.ITALIAN,
                                },
                            ]}
                            onSelect={(value) =>
                                handleFieldChange('catagoryType', value)
                            }
                            selectedValue={addData.catagoryType}
                        />
                    </div>

                    <div className="grid grid-cols-1 mt-5 mx-7">
                        <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                            Price
                        </label>
                        <Input
                            className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            type="text"
                            placeholder="Price"
                            value={addData.price || ''}
                            onChange={(value) =>
                                handleFieldChange('price', Number(value))
                            }
                        />
                    </div>

                    <div className="grid grid-cols-1 mt-5 mx-7">
                        <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold">
                            Offer
                        </label>
                        <Input
                            className="py-2 px-3 rounded-lg border-2 border-purple-300 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            type="text"
                            placeholder="Offer"
                            value={addData.offer || ''}
                            onChange={(value) =>
                                handleFieldChange('offer', Number(value))
                            }
                        />
                    </div>

                    <div className="grid grid-cols-1 mt-5 mx-7">
                        <label className="uppercase md:text-sm text-xs text-gray-500 text-light font-semibold mb-1">
                            Upload Photo
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-purple-300 group">
                                <div className="flex flex-col items-center justify-center pt-7">
                                    <svg
                                        className="w-10 h-10 text-purple-400 group-hover:text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        ></path>
                                    </svg>
                                    <p className="lowercase text-sm text-gray-400 group-hover:text-purple-600 pt-1 tracking-wider">
                                        Select a photo
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5">
                        <button className="w-auto bg-gray-500 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2">
                            Cancel
                        </button>
                        <button
                            className="w-auto bg-purple-500 hover:bg-purple-700 rounded-lg shadow-xl font-medium text-white px-4 py-2"
                            onClick={handleCreate}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
