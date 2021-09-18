import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Icon from 'src/components/Icon';
import { routeItems } from '../types';

const Sidebar: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <div className="w-1/6 bg-white fixed top-0 bottom-0 flex flex-col sidebar-min-width">
        <Link href="/websites" as="/websites">
          <div className="flex ml-4 mt-10 mb-16 items-center cursor-pointer fit-width-content">
            <span className="relative">
              <Icon name="compliantLogo" width={50} height={430} />
              <span className="font-poppins text-2xl font-bold compliant-logo">
                C
              </span>
            </span>

            <span className="font-poppins text-xl font-bold logo-text ml-3">
              Compliant
            </span>
          </div>
        </Link>
        {routeItems.map((item) => {
          return (
            <Link href={item.path} as={item.path} key={item.name}>
              <a>
                <div>
                  {item.name === 'My account' && (
                    <div
                      key={item.icon.name}
                      className="sidebar-separator ml-8 mr-16 my-4"
                    />
                  )}
                  <div
                    className={`${
                      item.path === router.pathname
                        ? 'px-4 border-l-4 compliant-border-color'
                        : 'h-14'
                    } flex flex-row items-center`}
                  >
                    <li
                      className={`${
                        item.path === router.pathname
                          ? 'text-white pl-3 py-4 rounded-xl compliant-bgColor'
                          : 'ml-8 my-6'
                      } font-poppins font-medium text-base list-none flex items-center cursor-pointer w-full`}
                    >
                      <Icon
                        name={item.icon.name}
                        height={item.icon.height}
                        width={item.icon.width}
                        fill={
                          item.path === router.pathname
                            ? item.activeColor
                            : item.icon.fill
                        }
                        circleFill={
                          item.path === router.pathname
                            ? item.circleActiveColor
                            : item.icon.circleFill
                        }
                      />
                      <span className="font-poppins ml-6 font-medium text-base">
                        {item.name}
                      </span>
                    </li>
                  </div>
                </div>
              </a>
            </Link>
          );
        })}
        <div className="font-normal font-inter text-xs ml-9 absolute bottom-14">
          &copy; 2021 - Compliant
        </div>
      </div>
    </>
  );
};
export default Sidebar;
