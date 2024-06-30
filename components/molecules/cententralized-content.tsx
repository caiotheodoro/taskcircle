import React from 'react';

interface CententralizedContentProps {
  children: React.ReactNode;
}

export default function CententralizedContent({
  children,
}: Readonly<CententralizedContentProps>) {
  return (
    <div className=" flex flex-col mx-auto max-w-md space-y-6 p-4 w-full  fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center">
      {children}
    </div>
  );
}
