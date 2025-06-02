import { Suspense } from "react";
import PrintComponent from "./printComponent";

const printing = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PrintComponent />
      </Suspense>
    </div>
  );
};

export default printing;
