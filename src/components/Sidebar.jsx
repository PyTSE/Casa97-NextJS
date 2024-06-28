import React from 'react';
import { Calendar, Home, Headset, Table,  ListChecks} from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

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

export default function Sidebar() {
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
    },
    {
      group: "Configurações",
      items: [
        {
          text: "Contato com o suporte",
          icon: "Support",
          link: "/support",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col w-[300px] border-r min-h-screen p-4 text-[16px]">
      <div className="grow">
        <Command>
          <CommandList>
            {menuList.map((menu, key) => (
              <CommandGroup key={key} heading={menu.group}>
                {menu.items.map((option, optionKey) => (
                  <CommandItem key={optionKey}>
                    <a href={option.link} passHref className="flex gap-2 cursor-pointer">
                      {renderIcon(option.icon)}
                      {option.text}
                    </a>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
          <CommandSeparator />
        </Command>
      </div>
    </div>
  );
}
