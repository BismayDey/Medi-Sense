'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, ChevronRight } from 'lucide-react';
import LocationMap from '@/components/location-map';

// Hospital locations with coordinates
const hospitalLocations = [
  {
    name: 'Apollo Hospitals, Chennai',
    address: '21, Greams Lane, Off Greams Road, Chennai – 600006, India',
    phone: '+91 44 4040 1066',
    hours: 'Open 24/7',
    coordinates: [13.0642, 80.2526], // Chennai coordinates
  },
  {
    name: 'Max Super Speciality Hospital, Saket',
    address:
      '12, Press Enclave Road, Saket Institutional Area, Saket, New Delhi – 110017, India',
    phone: '011-26515050',
    hours: 'Open 24/7',
    coordinates: [28.5274, 77.2103], // Delhi coordinates
  },
  {
    name: 'Peerless Hospital, Kolkata',
    address: '360 Panchasayar, Kolkata – 700094, West Bengal, India',
    phone: '+91 33 4011 1222',
    hours: 'Open 24/7',
    coordinates: [22.4837, 88.3944], // More precise coordinates for 360 Panchasayar, Kolkata
  },
];

export default function LocationsSection() {
  const openDirections = (location) => {
    const address = encodeURIComponent(location.address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${address}`,
      '_blank',
    );
  };

  return (
    <section
      id='locations'
      className='w-full py-12 md:py-24 lg:py-32 bg-[#f0f9ff]'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]'>
            Our Locations
          </div>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl'>
              Find Us Near You
            </h2>
            <p className='max-w-[700px] text-[#64748b] md:text-lg'>
              With multiple locations across the city, quality healthcare is
              always close by.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2'>
          <div className='space-y-6'>
            {hospitalLocations.map((location, index) => (
              <Card
                key={index}
                className='group hover:shadow-md transition-all border-none bg-white'>
                <CardHeader>
                  <CardTitle className='text-[#0f172a] group-hover:text-[#0284c7] transition-colors'>
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-[#64748b]' />
                    <span className='text-sm text-[#64748b]'>
                      {location.address}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 text-[#64748b]' />
                    <span className='text-sm text-[#64748b]'>
                      {location.phone}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 text-[#64748b]' />
                    <span className='text-sm text-[#64748b]'>
                      {location.hours}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => openDirections(location)}
                    className='w-full group border-[#0284c7] text-[#0284c7]'>
                    Get Directions
                    <ChevronRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className='h-full'>
            <LocationMap locations={hospitalLocations} />
          </div>
        </div>
      </div>
    </section>
  );
}
