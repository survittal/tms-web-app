import logo1 from "../../public/jera.jpg";
import Image from "next/image";
import Link from "next/link";

const HeaderPage = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-300 via-indigo-600 to-indigo-300 dark:from-gray-500 dark:via-gray-600 dark:to-gray-500 py-4 md:py-8">
      <div className="flex flex-col gap-3">
        <Image
          src={logo1}
          className="object-cover w-14 h-14 rounded-full m-auto"
          alt="User image"
          id="user_image"
        />

        <Link href="/">
          <p className="text-3xl font-bold text-center text-white">
            TMS-Web-App
          </p>
        </Link>

        <p className="text-center text-lg text-gray-200">
          VAIDYANATHA MALARAYA SAPARIVARA DAIVASTHANA
        </p>
      </div>
    </div>
  );
};

export default HeaderPage;
