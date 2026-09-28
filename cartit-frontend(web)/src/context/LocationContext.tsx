import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address } from '../types';
import { MOCK_ADDRESSES } from '../data/mockData';
import { addressApi } from '../services/api';

interface LocationContextType {
  selectedAddress: Address;
  activeAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  selectAddress: (addrId: string | Address) => void;
  addresses: Address[];
  addAddress: (addr: Address | Omit<Address, 'id'>) => Promise<void>;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  estimatedTimeMinutes: number;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address>(MOCK_ADDRESSES[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [estimatedTimeMinutes] = useState(9);

  // Fetch addresses from backend when user logs in / token exists
  useEffect(() => {
    const fetchBackendAddresses = async () => {
      try {
        const data = await addressApi.getMyAddresses();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Address[] = data.map((a: any) => ({
            id: String(a.id),
            label: a.addressType || 'Home',
            houseNo: a.addressLine1 || '',
            street: a.addressLine2 || a.city || '',
            landmark: a.landmark || '',
            city: a.city || 'Bengaluru',
            pincode: a.postalCode || '560001',
            isDefault: a.defaultAddress || false,
          }));
          setAddresses(mapped);
          setSelectedAddress(mapped.find(x => x.isDefault) || mapped[0]);
        }
      } catch (e) {
        console.log('Backend addresses not loaded (offline or unauthenticated), using fallback addresses.');
      }
    };

    fetchBackendAddresses();
  }, []);

  const addAddress = async (newAddr: Address | Omit<Address, 'id'>) => {
    try {
      const payload = {
        fullName: 'Customer',
        phoneNumber: '9876543210',
        addressLine1: newAddr.houseNo,
        addressLine2: newAddr.street,
        landmark: newAddr.landmark || '',
        city: newAddr.city || 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        postalCode: newAddr.pincode,
        addressType: (newAddr.label || 'HOME').toUpperCase(),
        defaultAddress: true,
      };
      const res = await addressApi.createAddress(payload);
      const created: Address = {
        id: String(res?.id || Date.now()),
        label: newAddr.label,
        houseNo: newAddr.houseNo,
        street: newAddr.street,
        landmark: newAddr.landmark,
        city: newAddr.city,
        pincode: newAddr.pincode,
        isDefault: true,
      };
      setAddresses(prev => [created, ...prev]);
      setSelectedAddress(created);
      setIsAddressModalOpen(false);
      return;
    } catch (e) {
      console.warn('Backend address creation failed, saving locally:', e);
    }

    const created: Address = 'id' in newAddr ? newAddr : {
      ...newAddr,
      id: 'addr_' + Date.now(),
    };
    setAddresses(prev => [created, ...prev]);
    setSelectedAddress(created);
    setIsAddressModalOpen(false);
  };

  const selectAddress = (addrInput: string | Address) => {
    if (typeof addrInput === 'string') {
      const found = addresses.find(a => a.id === addrInput);
      if (found) setSelectedAddress(found);
    } else {
      setSelectedAddress(addrInput);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        selectedAddress,
        activeAddress: selectedAddress,
        setSelectedAddress,
        selectAddress,
        addresses,
        addAddress,
        isAddressModalOpen,
        setIsAddressModalOpen,
        estimatedTimeMinutes,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
