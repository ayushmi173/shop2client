import React from 'react';

import Link from 'next/link';
import Popup from 'reactjs-popup';
import { useDispatch } from 'react-redux';

import { RouteItem, routeItems } from '../types';
import { onUserLogout } from 'src/store/thunks/auth';

type Props = {
  trigger: JSX.Element;
};

const headerProfileAllowedRoutes: string[] = [
  'My websites',
  'Team',
  'My account',
  'Sign out',
];

const HeaderProfile: React.FC<Props> = ({ trigger }) => {
  const dispatch = useDispatch();
  const headerProfileRoutes: RouteItem[] = routeItems.filter((item) =>
    headerProfileAllowedRoutes.includes(item.name),
  );

  const handleLogout = () => {
    dispatch(onUserLogout());
  };
  return (
    <Popup
      trigger={trigger}
      on={['hover', 'focus']}
      position="bottom right"
      className="header-profile"
    >
      <div className="bg-white w-full absolute top-2 py-10 shadow-lg rounded-xl">
        <div className="absolute profile-popup-arrow"></div>
        {headerProfileRoutes.map((route) => {
          return (
            <Link key={route.name} href={route.path}>
              <li className="list-none px-8 pb-4">
                <span className="cursor-pointer font-poppins font-medium text-base">
                  {route.name}
                </span>
              </li>
            </Link>
          );
        })}
        <li className="list-none px-8">
          <span
            className="cursor-pointer font-poppins font-medium text-base"
            onClick={handleLogout}
          >
            {headerProfileAllowedRoutes[3]}
          </span>
        </li>
      </div>
    </Popup>
  );
};

export default HeaderProfile;
