import React, { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { useAppSelector } from 'src/store';
import { ISanitizedUser } from '@package/entities';
import { headerTitle } from '../types';

import Input from 'src/components/Input';
import Icon from 'src/components/Icon';

const HeaderProfile = dynamic(() => import('./HeaderProfile'), {
  ssr: false,
});

const Header: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');

  const user: ISanitizedUser = useAppSelector(
    (state) => Object.values(state.entities.users.entities)[0],
  );

  return (
    <div className="flex flex-row mt-11 mb-8 mx-7 items-center">
      <div className="w-3/6 font-poppins font-bold text-2xl">
        {headerTitle(router.pathname)}
      </div>
      <div className="w-3/6 flex flex-row">
        <div className="relative flex items-center w-full mr-7 cursor-pointer">
          <Input
            type="text"
            value={search}
            onChange={(value) => setSearch(value)}
            className="rounded-full py-5 px-5 focus:outline-none font-poppins w-full"
            placeholder="Search"
          />
          <span className="w-9 h-9 rounded-full main-background-color absolute right-5 flex items-center justify-center">
            <Icon width={16} height={16} name="search" fill="white" />
          </span>
        </div>
        <HeaderProfile
          trigger={
            <div className="w-2/5 bg-white rounded-lg flex flex-row justify-center items-center px-4 cursor-pointer relative">
              <div className="border-2 rounded-full compliant-border-color h-11 w-11 object-cover object-top flex justify-center items-center">
                <img src="/profile.png" alt="profileIcon"/>
              </div>
              <div className="text-sm font-poppins font-medium mx-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                Hi, {user && user.firstName.split(' ')[0]}
              </div>
              <Icon height={18} width={18} name="downArrow" />
            </div>
          }
        />
      </div>
    </div>
  );
};
export default Header;
