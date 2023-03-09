import React, { useState, createContext } from 'react';
import SideBar from "./global/SideBar";
import SideBarFDA from "./global/SideBarFDA";
import SideBarBavaria from "./global/SideBarFDA";

export const AppContext = createContext({
  selectedSidebar: 'default',
  sidebarOptions: {
    default: {
      id: 'janeHopkins',
      label: 'Jane Hopkins Sidebar',
      component: SideBar,
    },
    fda: {
      id: 'fda',
      label: 'FDA Sidebar',
      component: SideBarFDA,
    },
    bavaria: {
      id: 'bavaria',
      label: 'Bavaria Sidebar',
      component: SideBarBavaria,
    },
  },
  setSelectedSidebar: () => {},
});