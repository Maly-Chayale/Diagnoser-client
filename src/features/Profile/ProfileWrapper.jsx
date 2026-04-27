import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileEditor from './ProfileEditor';
import ProfileCustomer from './ProfileCustomer';


const ProfileWrapper = () => {


    const dispatch = useDispatch()
    const statusUser = useSelector(state => state.LogIn.statusUser)
    // const statusC = useSelector(state=>state.Customer.status)
    // const statusD = useSelector(state=>state.Diagnoser.status)


    return (
        <div className='col'>
          
            {statusUser == "cust" ?
                <ProfileCustomer /> :
                <ProfileEditor />}

        </div>
    )

}
export default ProfileWrapper;