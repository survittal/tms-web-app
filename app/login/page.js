import Image from "next/image";
import logo1 from "../../public/jera.jpg";

const Login = () => {
  return (
    <div className="min-h-screen flex gap-4 items-center justify-center">
      <div className="rounded-2xl flex max-w-3xl p-5 items-center">
        <div className="md:block hidden w-1/2">
          <Image className="rounded-2xl max-h-[1600px]" src={logo1} alt="" />
        </div>
        <div className="md:w-1/2 flex flex-col gap-4 items-center">
          <div className="place-self-center">
            <span className="text-2xl font-bold text-green-950">Sign In</span>
          </div>
          <div className="block mb-4 text-md">
            <label htmlFor="username" className="block text-md mb-2">
              Mobile No
            </label>
            <input
              type="tel"
              id="username"
              placeholder="Mobile No"
              className="block border border-blue-400 rounded-md p-1 focus:outline-none"
            ></input>
          </div>
          <div className="block mb-4 text-md">
            <label htmlFor="password" className="block mb-2 text-md">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="block border border-blue-400 rounded-md p-1 focus:outline-none"
            ></input>
          </div>
          <div className="">
            <button className="text-white bg-teal-900 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:bg-teal-200 font-medium rounded-lg text-lg sm:w-auto px-5 py-2.5 w-48 text-center ">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
