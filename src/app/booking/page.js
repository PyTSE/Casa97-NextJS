"use client";
import AuthGuard from '@/components/AuthGuard';
import ReservaForm from '../../components/ReservaForm';

export default function Home() {
  return (
      <div className={`flex justify-center items-center min-h-screen md:min-h-screen py-12`}>
        <ReservaForm type="user"/>
      </div>
  );
}
