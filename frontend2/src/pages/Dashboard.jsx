import React, { useEffect } from 'react'
import { DashboardSidebar } from '../component/core/dashBoard/Sidebar'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {useSocket} from "../context/Socket"
const Dashboard = () => {

  return (
    <div className=' flex w-full flex-col md:flex-row h-[calc(100vh-0.5rem)]'>
        <div className=' '>
            <DashboardSidebar/>
        </div>
        <div className='w-full overflow-y-auto m-0 p-0'>
            <Outlet/>
        </div>
    </div>
  )
}

export default Dashboard