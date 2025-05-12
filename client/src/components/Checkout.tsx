import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { Minus, Plus } from "lucide-react";
import { decrement, increment } from "@/redux/cartSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateOrderMutation,
  usePayForOrderMutation,
} from "@/redux/api/orderApi";
import { toast, Toaster } from "sonner";
import { useState } from "react";

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const restaurantID = useSelector(
    (state: RootState) => state.cart.restaurantId
  );
  const dispatch = useDispatch();

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [payForOrder] = usePayForOrderMutation();

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const total = Object.values(cart).reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        setValue("coordinates", { lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });

    const coords = watch("coordinates");
    return coords ? <Marker position={[coords.lat, coords.lng]} /> : null;
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!restaurantID) {
      toast.warning("Cart is empty");
      return;
    }

    const orderPayload = {
      ...data,
      orderDetails: Object.values(cart),
      totalAmount: total,
      restaurantID,
    };

    try {
      const res = await createOrder(orderPayload).unwrap();
      if (res.success) {
        toast.success("Order placed successfully!");
        setOrderId(res.order?._id); // adjust based on API response
        setShowPaymentDialog(true);
      }
    } catch (err) {
      toast.error("Failed to place order.");
    }
  };

  const onInitializePayment = async () => {
    if (!orderId) return;

    try {
      const res = await payForOrder({ total, orderId }).unwrap();
      if (res.url) {
        setShowPaymentDialog(false);
        window.location.href = res.url;
        toast.success("Payment initialized successfully!");
      }
    } catch (err) {
      toast.error("Failed to initialize payment.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto py-10 space-y-6"
      >
        <h2 className="text-3xl font-bold">Checkout</h2>

        {Object.keys(cart).length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {Object.values(cart).map(({ item, quantity }) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <h4 className="font-medium text-lg">{item.name}</h4>
                  <p className="text-lg text-gray-500">
                    Price: ETB {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => dispatch(decrement(item._id))}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => dispatch(increment(item._id))}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Input
          placeholder="Delivery Address"
          {...register("deliveryAddress")}
        />
        {errors.deliveryAddress && (
          <p className="text-sm text-red-500">
            {errors.deliveryAddress.message}
          </p>
        )}

        <div className="h-64 rounded overflow-hidden border">
          <MapContainer
            center={[9.678, 39.532]}
            zoom={8}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector />
          </MapContainer>
        </div>
        {errors.coordinates && (
          <p className="text-sm text-red-500">{errors.coordinates.message}</p>
        )}

        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">
            Total: ETB {total.toFixed(2)}
          </span>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Placing..." : "Confirm Order"}
          </Button>
        </div>
        <Toaster />
      </form>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proceed to Payment</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            Your order was placed successfully. Click below to proceed with
            payment.
          </p>
          <Button onClick={onInitializePayment}>Pay Now</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Checkout;
