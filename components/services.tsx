import React from "react";

interface ServiceItemProps {
  title: string;
  description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ title, description }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md transition-transform hover:scale-105">
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

const Services: React.FC = () => {
  const servicesData: ServiceItemProps[] = [
    {
      title: "Web Development",
      description:
        "We build modern, responsive websites using the latest technologies.",
    },
    {
      title: "UI/UX Design",
      description:
        "We craft stunning user interfaces and seamless experiences.",
    },
    {
      title: "SEO Optimisation",
      description:
        "Improve your website’s search rankings and online visibility.",
    },
  ];

  return (
    <section id="services" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Our Services
        </h2>
        <p className="text-center text-gray-600 mt-2">
          What we offer to our clients
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {servicesData.map((service, index) => (
            <ServiceItem
              key={index}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
