export type RouteItem = {
  name: string;
  icon: {
    name: string;
    height?: number;
    width?: number;
    fill?: string;
    circleFill?: string;
  };
  path: string;
  activeColor: string;
  circleActiveColor?: string;
};

export const routeItems: RouteItem[] = [
  {
    name: 'My websites',
    icon: {
      name: 'myWebsite',
      height: 21,
      width: 21,
      fill: 'black',
    },
    path: '/websites',
    activeColor: 'white',
  },
  {
    name: 'Billing',
    icon: {
      name: 'billing',
      height: 21,
      width: 21,
      fill: 'black',
    },
    path: '/billing',
    activeColor: 'white',
  },
  {
    name: 'Installation',
    icon: {
      name: 'installation',
      height: 21,
      width: 21,
      fill: 'black',
    },
    path: '/installation',
    activeColor: 'white',
  },
  {
    name: 'Accessibility Audits',
    icon: {
      name: 'accessibilityAudits',
      height: 21,
      width: 21,
      fill: 'black',
    },
    path: '/audits',
    activeColor: 'white',
  },
  {
    name: 'Notifications',
    icon: {
      name: 'notifications',
      height: 21,
      width: 21,
      fill: 'black',
      circleFill: '#017A4F',
    },
    path: '/notifications',
    activeColor: 'white',
    circleActiveColor: '#45FD04',
  },
  {
    name: 'My account',
    icon: {
      name: 'myAccounts',
      height: 21,
      width: 21,
      fill: 'black',
    },
    path: '/account',
    activeColor: 'white',
  },
  {
    name: 'Help Center',
    icon: {
      name: 'helpCenter',
      height: 21,
      width: 21,
      fill: 'black',
    },
    path: '/help',
    activeColor: 'white',
  },
];

/**
 * @param pathName current route pathname
 * @returns Route Heading for header
 */
export const headerTitle = (pathName: string): string => {
  const activeRouteIndex = routeItems.findIndex(
    (item) => pathName === item.path,
  );
  if (activeRouteIndex >= 0) return routeItems[activeRouteIndex].name;
  return '';
};
