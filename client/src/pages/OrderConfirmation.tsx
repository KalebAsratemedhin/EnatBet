import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetOrderByIdQuery } from "@/redux/api/orderApi";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data, isLoading, error } = useGetOrderByIdQuery(orderId!, {
    skip: !orderId,
  });

  useEffect(() => {
    if (!orderId) {
      console.error("No order ID found in URL");
    }
  }, [orderId]);

  if (!orderId) {
    return <div className="p-4 text-red-500">Invalid confirmation link</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
        <span className="ml-2">Loading order...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to fetch order. Please try again later.
      </div>
    );
  }

  const order = data?.order;

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Successful</h2>
          <p className="text-sm text-gray-500 mb-2">
            Order ID: <span className="font-mono">{order?._id}</span>
          </p>
          <p>
            <strong>Total:</strong> {order?.totalAmount} ETB
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize">{order?.status}</span>
          </p>
          <p>
            <strong>Items:</strong>
          </p>
          <ul className="list-disc list-inside ml-2">
            {order?.orderDetails?.map((item: any) => (
              <li key={item._id}>
                {item.name} x {item.quantity}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;
