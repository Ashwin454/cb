import React from 'react'
import VendorProfile from './vendorProfile';
import BankDetails from './BankDetails';

const ProfilePage = () => {
  return (
    <div className=' flex flex-col gap-3'> 
        <VendorProfile/>
        <BankDetails/>
    </div>
  )
}

export default ProfilePage;