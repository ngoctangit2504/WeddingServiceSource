import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import path from '@/ultils/path';


import { apiGetServiceType } from "@/apis/service"

const ServiceTypeGrid = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await apiGetServiceType() // Replace with your API endpoint
        setServiceTypes(response.data);
      } catch (err) {
        setError('Failed to fetch service types.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-5 gap-4">
        {serviceTypes.map((service) => (
          <div key={service.id} className="flex flex-col items-center">
            <NavLink
              to= {`/${path.LIST}?service_type_id=${service.id}`}
              key={service.id}
            >
              <img
                src={service.imageURL}
                alt={service.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <p className="mt-2 text-center text-lg font-semibold">{service.name}</p>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTypeGrid;
