import React from 'react';

interface LocationProps {
  locate: number[];
}

const Location: React.FC<LocationProps> = ({ locate }) => {
  const latitude: number = locate[0];
  const longitude: number = locate[1];

  const mapsLink: string = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const handleGetDirection = (): void => {
    window.open(mapsLink, '_blank');
  };

  return (
    <div>
      <div className='w-full max-w-[900px] h-[300px] mb-[30px] rounded-xl overflow-hidden md:max-w-full'>
        <iframe
          src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
          width='100%'
          height='100%'
          loading='lazy'
          style={{ border: 0 }}
          allowFullScreen
          title='Google Map'></iframe>
      </div>
    </div>
  );
};

export default Location;
