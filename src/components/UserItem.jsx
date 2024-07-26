"use client";
import Image from "next/image";
import Logo from "../../public/casa97.png";

export default function UserItem({ user }) {
  console.log(user);
  return (
    <div className="flex items-center gap-2 p-2 border rounded-[16-px]">
      <Image className="h-[50px] w-[50px] brightness(0) bg-white rounded-full invert(1)" src={Logo} alt="Logo" />
      <div>
        <p className="font-bold text-[16px]">{user?.displayName || "Casa 97"}</p>
        <p className="text-[14px]">{user?.accessToken}</p>
      </div>
    </div>
  );
}
