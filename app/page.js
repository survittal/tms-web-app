"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { getDetByMobNo } from "./db/devotee";
import PasswordCheck from "./components/PasswordCheck";

export default function Home() {
  const router = useRouter();

  const mobRef = useRef(null);

  const [Admin, setAdmin] = useState(false);
  const [sMobile, setsMobile] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    mobRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    document.body.style.cursor = "wait";
    const r1 = await getDetByMobNo(sMobile);
    if (r1 == 0) {
      router.push("/register/" + `${sMobile}`);
    } else {
      setData(r1.data[0]);
      let userlevel = r1.data[0].user_level;
      if (userlevel === undefined || userlevel === "0") {
        router.replace("/seva/booking/" + `${r1.data[0].id}`);
      } else {
        setAdmin(true);
        setIsSubmitting(false);
      }
    }
    document.body.style.cursor = "default";
  };

  return (
    <section>
      <div className="flex flex-col bg-white items-center">
        <div className="block mb-1 text-lg font-bold p-2.5">
          SEVA BOOKING APP
        </div>
        {Admin == false ? (
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
            <label
              htmlFor="phone-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Mobile Number:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 19 18"
                >
                  <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                </svg>
              </div>
              <input
                onInput={(e) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(
                      0,
                      e.target.maxLength
                    );
                }}
                type="tel"
                id="sMobile"
                ref={mobRef}
                maxLength={10}
                aria-describedby="helper-text-explanation"
                onChange={(e) => setsMobile(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                pattern="[0-9]{10}"
                placeholder="Mobile Number"
                required
              />
            </div>
            <p
              id="helper-text-explanation"
              className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            ></p>
            <button
              type="submit"
              className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </button>
          </form>
        ) : (
          <PasswordCheck id={data.id} pwd={data.pwd} />
        )}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[#87041b] m-4 font-bold text-xl">
          ಸಾವಿರದ ಎಂಟು ಸಂಕ್ರಮಣ ತಂಬಿಲ ಸೇವೆ
        </span>
      </div>
      <div className="flex flex-col items-center">
        <div className="grid max-w-sm grid-cols-1 gap-4 items-center">
          <p className="text-justify text-[#046e87] font-semibold">
            ಪ್ರತಿಯೊಬ್ಬರ ಜೀವನದಲ್ಲಿಯೂ ಸಂಕ್ರಮಣ ಪರ್ವ ಬಂದೇ ಬರುತ್ತದೆ. ಕೆಲವರಿಗೆ ಜೀವನದ
            ಕೆಲವು ಘಟನೆಗಳ ನಂತರ ಯಶಸ್ವಿನ ಪರ್ವ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ. ಇನ್ನೂ ಕೆಲವರಿಗೆ
            ಸೋಲಿನ ಪರ್ವ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ. ಇದು ಕೆವಲ ಮನುಷ್ಯನಿಗೆ ಮಾತ್ರವಲ್ಲದೆ
            ಭೂಮಿಯಲ್ಲಿ ಹಾಗೂ ಬ್ರಹ್ಮಾಂಡದಲ್ಲಿ ಕೂಡಾ ಈ ರೀತಿಯ ಬದಲಾವಣೆಗಳು
            ನಡೆಯುತ್ತಿರುತ್ತವೆ. ಇದನ್ನು ಸಂಕ್ರಮಣ ಎಂದು ಹೇಳಲಾಗುತ್ತದೆ. ಪ್ರಮುಖವಾಗಿ
            ಸೂರ್ಯನ ಚಲನೆಯನ್ನು ಆಧರಿಸಿ ಸಂಕ್ರಮಣದ ಪ್ರಭಾವವು ಬ್ರಹ್ಮಾಂಡದಲ್ಲಿ ನಡೆಯುತ್ತದೆ.
          </p>
          <p className="text-justify text-[#046e87]">
            ನಮ್ಮ ಪರುಶುರಾಮ ಸೃಷ್ಟಿಯಲ್ಲಿ ಈ ಸಂಕ್ರಮಣ ಕಾಲವನ್ನು ಬಹಳ ವಿಶೇಷವಾಗಿ ದೈವ
            ದೇವರುಗಳ ಆಚರಣೆಯನ್ನು ಕಾಲಘಟ್ಟದಲ್ಲಿ ನಡೆಸುತ್ತಾ ಬರುತ್ತಿದ್ದಾರೆ. ಇಂತಹ ಆಚರಣೆ
            ನಮ್ಮ ಜೀವನದಲ್ಲಿ ಉತ್ತಮವಾದ ಪರಿಣಾಮವನ್ನು ಬೀರುತ್ತದೆ. ಇದು ನಂಬಿಕೆಯ ಭಾಗವಾದರು
            ಇದು ಸತ್ಯವಾಗಿದೆ. ಇಂತಹ ಸಂದರ್ಭದಲ್ಲಿ ಇತ್ತೀಚೆಗಷ್ಟೇ ಎಷ್ಟೋ ಕಾಲದಲ್ಲಿದ್ದ
            ನಿರ್ಜಿವಗೊಂಡ ಸಾನಿಧ್ಯ ವೃದ್ಧಿಕಲಶಗಳಿಂದ ಪುನರ್ಜಿವನಗೊಂಡು ಭಕ್ತರನ್ನು
            ಹರಸುತ್ತಿರುವ ಕ್ಷೇತ್ರ ವೈದ್ಯನಾಥ ಮಲರಾಯ ಸಪರಿವಾರ ದೈವಗಳ ಕ್ಷೇತ್ರ ಮಲರಾಯ ಜೇರ
            ಧರ್ಮನಗರ.
          </p>
          <p className="text-justify text-[#046e87]">
            ಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ನೆಲೆಯಾಗಿರುವ ಈ ದೈವಗಳಿಗೆ ಪ್ರತಿ ಸಂಕ್ರಮಣದಂದು ತಂಬಿಲ ಸೇವೆ
            ಬಹಳ ಭಕ್ತಿಗಳಿಂದ ನೆರವೇರುತ್ತಿದೆ. ಯಾವುದೇ ಸ್ಥಳದಲ್ಲಿ ದೈವಗಳಾಗಲಿ, ದೇವರಾಗಾಲಿ
            ನಮ್ಮ ನಿರಂತರ ಆರಾಧನೆಯಿಂದ ಮಾತ್ರ ಮತ್ತು ಒಂದು ಧನಾತ್ಮಕ ಶಕ್ತಿ ಹೆಚ್ಚಾಗಿ ಎಲ್ಲಾ
            ಭಕ್ತಾದಿಗಳಿಂದ ನಾವು ಬೇಡಿದ ಹರಿಕೆಗಳು ಈಡೇರುತ್ತವೆ.
          </p>
          <p className="text-justify text-[#046e87]">
            ಹಾಗಾಗಿ ಮುಂದಿನ ಒಂದು ವರ್ಷದವರೆಗೆ ಸಾನ್ನಿಧ್ಯಗಳ ಶಕ್ತಿ ವರ್ಧನೆಗಾಗಿ ನಾವೆಲ್ಲರೂ
            ಸೇರಿ ಪ್ರತಿ ತಿಂಗಳು ಸಾವಿರದ ಎಂಟು (1008) ತಂಬಿಲ ಸೇವೆ ಸಮರ್ಪಣೆ ಈ
            ಕ್ಷೇತ್ರದಲ್ಲಿ ನೆಲೆಸಿರುವ ದೈವಗಳಿಗೆ ಪ್ರಾರ್ಥನೆ ಸೇವೆಯ ಮುಖಾಂತರ ಶಕ್ತಿಯನ್ನು
            ವೃದ್ಧಿಸಿಕೊಂಡು ಅದನ್ನು ನಾವೆಲ್ಲರೂ ಪಡೆದುಕೊಂಡು ನಮ್ಮ ಜೀವನದಲ್ಲಿ ಸಾರ್ಥಕ
            ಬದುಕನ್ನು ಪಡೆಯೋಣ.
          </p>
          <p className="text-justify text-[#046e87]">
            ಈ ವಿಶೇಷವಾದ 1008 ಸಂಕ್ರಮಣ ಸೇವೆಯಲ್ಲಿ ತಾವೆಲ್ಲರೂ ನಮ್ಮ ಜೀವನ ಹಾಗೂ ಕ್ಷೇತ್ರದ
            ಅಭಿವೃದ್ದಿಯಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳೋಣ, ಬನ್ನಿ ಜೀವನ ಸಾರ್ಥಕವಾಗಿಸೋಣ.
          </p>
          <p className="text-justify font-bold text-[#063970]">
            ವಿ.ಸೂ: ಸಂಕ್ರಮಣ ತಂಬಿಲ ಪ್ರಸಾದವನ್ನು ಅಂಚೆ ಮುಖಾಂತರ ತಲುಪಿಸುವ ವ್ಯವಸ್ಥೆ ಇದೆ.
            ಸದುಪಯೋಗ ಪಡೆದುಕೊಳ್ಳಿ.
          </p>
        </div>
      </div>
    </section>
  );
}
