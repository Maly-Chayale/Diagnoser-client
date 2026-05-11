import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileEditor from './ProfileEditor';
import ProfileCustomer from './ProfileCustomer';


const ProfileWrapper = () => {
    const statusUser = useSelector(state => state.LogIn.statusUser)
    
    return (
        <div className='col'>
          
            {statusUser == "cust" ?
                <ProfileCustomer /> :
                <ProfileEditor />}

        </div>
    )

}
export default ProfileWrapper;