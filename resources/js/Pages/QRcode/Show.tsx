import React, { useRef } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { ReactQRCode } from "@lglab/react-qr-code";

// Define the Receipt type properly
interface Receipt {
    data: {
        date_issued: string;
        customer_name: string;
        id: number;
        qr_code: string | string[];
        queue_number: string;
        type: string;
    };
}

interface CustomerPageProps extends InertiaPageProps {
    receipt: Receipt;
}

export default function Show() {
    const { receipt } = usePage<CustomerPageProps>().props;
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const content = printRef.current?.innerHTML;
        const printWindow = window.open('', '', 'width=400,height=600');
        if (printWindow && content) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              @media print {
                body {
                  font-family: monospace;
                  width: 58mm;
                  margin: 0;
                  padding: 0;
                  text-align: center;
                  color: #000;
                }
                .ticket {
                  width: 58mm;
                  padding: 0;
                  margin: 0 auto;
                }
                h1 {
                  font-size: 18px;
                  margin: 4px 0;
                }
                h2 {
                  font-size: 16px;
                  margin: 2px 0;
                }
                small {
                  font-size: 12px;
                  color: #333;
                }
                img {
                  margin: 8px 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="ticket">
              ${content}
            </div>
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    };

    return (
        <>
            {/* Printable content only */}
            <div ref={printRef}>
                <div className="w-[58mm] mx-auto text-center">
                    <h1 className="text-xl font-bold">#{receipt.data.queue_number}</h1>
                    <div className="flex justify-center my-2">
                        <ReactQRCode value={String(receipt.data.qr_code)} size={150} />
                    </div>
                    <h2 className="font-semibold">{receipt.data.type}</h2>
                    <small>{receipt.data.date_issued}</small>
                </div>
            </div>

            {/* Print Button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={handlePrint}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-300"
                >
                    🖨️ Print
                </button>
            </div>
        </>
    );
}
