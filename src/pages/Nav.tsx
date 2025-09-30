import { Car, FileTextIcon, LayoutDashboard, User, Wallet } from 'lucide-react'
import { NavLink } from 'react-router'

function Nav() {
  return (
     <aside className="w-full md:w-40 bg-gray-200 p-4 flex-shrink-0">
        <h2 className="text-xl font-bold mb-6">CarLease</h2>
        <nav className="space-y-2 text-gray-500">
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `${isActive ? "bg-blue-800 text-black" : "hover:text-black"}`
            }
          >
            <div className="flex justify-start items-center rounded-lg p-2 text-left gap-2">
              <LayoutDashboard size={17} />
              <span className='text-[13px]'>Dashboard</span>
            </div>
          </NavLink>
          <NavLink to={"/users"} className={({isActive})=> `${isActive ? "text-black" : "hover:text-black"}`}>
            <div className="flex justify-start items-center  rounded-lg p-2 text-left gap-2">
              <User size={20} /> <span className='text-[13px]'>User Management</span>
            </div>
          </NavLink>
          <NavLink to={"/cars"}>
            <div className="flex justify-start items-center hover:bg-blue-800 hover:text-white rounded-lg p-2 text-left gap-2">
              <Car size={20} />
              <span className='text-[13px]'>Cars Management</span>
            </div>
          </NavLink>
          <NavLink to={"/transaction"}>
            <div className="flex justify-start items-center hover:bg-blue-800 hover:text-white rounded-lg p-2 text-left gap-2">
              <Wallet size={17} />
              <span className='text-[13px]'>Transactions</span>
            </div>
          </NavLink>
          <NavLink to={"/reports"}>
            <div className="flex justify-start items-center hover:bg-blue-800 hover:text-white rounded-lg p-2 text-left gap-2">
              <FileTextIcon  size={17} />
              <span className='text-[13px]'>Reports</span>
            </div>
          </NavLink>
        </nav>
      </aside>
  )
}

export default Nav