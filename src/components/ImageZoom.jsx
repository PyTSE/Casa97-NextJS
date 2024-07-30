import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import Image from 'next/image';
import { X, Search } from 'lucide-react'; // Ícone de fechar e lupa

const ImageZoom = ({ src, alt }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer group">
          <img src={src} alt={alt} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Search className="text-white w-12 h-12" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="relative bg-white p-4 rounded-md">
        <img src={src} alt={alt} className="max-w-full max-h-full"/>
        <DialogClose asChild>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoom;
