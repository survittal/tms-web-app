import React, { useState } from "react";
import { getPaymentStatus } from "../cashfree/cashfree-server-action";
import { updateDocument } from "../db/devotee";

const SevaTable = ({ id, data }) => {
  const [sevas, setSevas] = useState(data);

  function UpdatePayStatus(idTo, newValue) {
    const updatedItems = sevas.map((item) => {
      if (item.id === idTo) {
        // Conditionally modify the item
        if (newValue != "PAID") {
          newValue = "Failed";
        }
        return { ...item, order_status: newValue };
      }
      // Return unchanged item for others
      return item;
    });
    setSevas(updatedItems); // Update the state with the new array
  }

  const PaymentVerify = async (sRef, Ord_ID) => {
    const result = await getPaymentStatus({ order_id: Ord_ID });
    UpdatePayStatus(sRef, result.data.order_status);
    let oStatus = "";
    if (result.data.order_status != "PAID") {
      oStatus = "Unpaid";
    } else {
      oStatus = "PAID";
    }
    const uResult = await updateDocument("devotees/" + id + "/sevadet", sRef, {
      order_status: oStatus,
    });
  };

  return (
    <div className="md:w-full overflow-x-auto">
      {sevas ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Devotee Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pay Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sevas.map((item, index) => {
              let textColor = "text-black-900";
              if (item.order_status != "PAID") {
                textColor = "text-red-900";
              }
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.devotee_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.bill_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.total_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className={`${textColor}`}>{item.order_status}</p>
                    {item.order_status === "Unpaid" ? (
                      <a
                        href="#"
                        onClick={() => PaymentVerify(item.id, item.order_id)}
                        className="text-blue-900"
                      >
                        Verify
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        "Sorry... No Seva List found..."
      )}
    </div>
  );
};

export default SevaTable;
