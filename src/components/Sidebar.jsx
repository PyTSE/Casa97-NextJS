"use client"; // Certifique-se de adicionar essa linha para ativar o modo cliente no Next.js.

import React, { createContext, useContext, useState } from 'react';
import { Calendar, Home, Headset, Table, ListChecks, ChevronFirst, ChevronLast } from 'lucide-react';
import Link from 'next/link';

function renderIcon(iconName) {
  switch (iconName) {
    case 'Calendar':
      return <Calendar />;
    case 'Home':
      return <Home />;
    case 'Support':
      return <Headset />;
    case 'Table':
      return <Table />;
    case 'ListChecks':
      return <ListChecks />;
    default:
      return null;
  }
}

const SidebarContext = createContext();

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  const menuList = [
    {
      group: "Menu Geral",
      items: [
        {
          text: "Gerenciar Reservas",
          icon: "Calendar",
          link: "/dashboard",
        },
        {
          text: "Gerenciar Espaços da Casa",
          icon: "Home",
          link: "/spaces",
        },
        {
          text: "Gerenciar Mesas dos Locais",
          icon: "Table",
          link: "/localtables",
        },
        {
          text: "Gerenciar Itens Adicionais",
          icon: "ListChecks",
          link: "/itens",
        },
      ],
    }
  ];

  return (
    <aside className='h-screen'>
      <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
        <div className='p-4 pb-2 flex justify-between items-center'>
          <img src="/casa97.png" alt='Logo Casa97' className={`overflow-hidden transition-all ${expanded ? "w-12 ml-3" : "w-0"}`} />
          <button onClick={() => setExpanded(curr => !curr)} className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100'>
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className='flex-1 px-3'>
            {menuList.map((menu, menuIndex) => (
              <React.Fragment key={menuIndex}>
                <h3 className='font-semibold text-gray-700 py-2'>{menu.group}</h3>
                {menu.items.map((item, itemIndex) => (
                  <SidebarItem
                    key={itemIndex}
                    icon={renderIcon(item.icon)}
                    text={item.text}
                    link={item.link}
                  />
                ))}
              </React.Fragment>
            ))}
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, link }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-indigo-50 text-gray-600`}>
      <Link href={link} className="flex items-center w-full">
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
      </Link>
    </li>
  );
}
