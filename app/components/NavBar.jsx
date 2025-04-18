import Image from "next/image"
import Link from "next/link"
import logo1 from '../../public/jera.jpg'

const NavBar = () => {
  return (
<nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
  <div className="flex items-center flex-shrink-0 text-white mr-6">
    <Image src={logo1} width={50} height={50} alt="Unknown Image..." className="object-none rounded-full pr-1" ></Image>
    
    <span className="font-semibold text-xl tracking-tight pl-1">Malaraya Jera</span>
    
  </div>
  <div className="block lg:hidden md:hidden">
    <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
      <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
    </button>
  </div>
  <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
    <div className="text-sm lg:flex-grow">
      <a href="/" className="block text-xl mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
        Thambila Seva Booking
      </a>
      <a href="/" className="block text-xl mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
        Register
      </a>
      <a href="/" className="block text-xl mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
        Contact Us
      </a>
    </div>
    <div>
      <a href="/" className="inline-block text-xl px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Sign In</a>
    </div>
  </div>
</nav>
 
  )
}

export default NavBar