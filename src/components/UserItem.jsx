'use client';
import Image from "next/image";
import Logo from "../../public/casa97.png";


export default function UserItem() {
    return <div className="flex items-center gap-2 p-2 border rounded-[16-px]">
      <Image className="h-[50px] w-[50px] brightness(0) bg-white rounded-full invert(1)" src={Logo} />
      <div>
      <p className="font-bold text-[16px]">gustavorteuber</p>
      <p className="text-[14px]">gustavorteuber@dev.com</p>    
      </div>
    </div>
}