"use client";
import ReservaForm from '../../components/ReservaForm';

export default function BookingPage() {
  return (
    <div className="flex justify-center items-start min-h-screen py-8 px-2 sm:py-12 sm:px-6 lg:px-8">
      <ReservaForm type="user" />
    </div>
  );
}
