import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Minus, Plus } from "lucide-react";
import { decrement, increment } from "@/cartSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateOrderMutation } from "@/api/orderApi"; // adjust based on your structure
import { toast, Toaster } from "sonner";

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  paymentMethod: z.enum(["telebirr", "cbe"], {
    errorMap: () => ({ message: "Select a valid payment method" }),
  }),
});


type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const restaurantID = useSelector((state: RootState) => state.cart.restaurantId)
  const dispatch = useDispatch();

  const [createOrder, { isLoading }] = useCreateOrderMutation();
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
    console.log(" rest id ", restaurantID, cart);
    if(!restaurantID){
      console.log("empty cart");
      
      toast.warning("Cart is empty");

      return 
    }
    const orderPayload = {
      ...data,
      orderDetails: Object.values(cart),
      totalAmount: total,
      restaurantID
    };
    try {
      const res = await createOrder(orderPayload).unwrap();
      if (res.success) {
        toast.success("Order placed successfully!");
        // clearCart if needed
      }
    } catch (err) {
      toast.error("Failed to place order.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto py-10 space-y-6">
      <h2 className="text-3xl font-bold">Checkout</h2>

      {Object.keys(cart).length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {Object.values(cart).map(({ item, quantity }) => (
            <div key={item._id} className="flex justify-between items-center border-b pb-2">
              <div>
                <h4 className="font-medium text-lg">{item.name}</h4>
                <p className="text-lg text-gray-500">Price: ETB {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="lg" onClick={() => dispatch(decrement(item._id))}>
                  <Minus size={16} />
                </Button>
                <span className="font-semibold">{quantity}</span>
                <Button variant="outline" size="lg" onClick={() => dispatch(increment(item._id))}>
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
        <p className="text-sm text-red-500">{errors.deliveryAddress.message}</p>
      )}

      <div className="h-64 rounded overflow-hidden border">
        <MapContainer center={[9.678, 39.532]} zoom={8} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector />
        </MapContainer>
      </div>
      {errors.coordinates && (
        <p className="text-sm text-red-500">{errors.coordinates.message}</p>
      )}

      <Select onValueChange={(value: "telebirr" | "cbe") => setValue("paymentMethod", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Payment Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="telebirr">Telebirr</SelectItem>
          <SelectItem value="cbe">CBE</SelectItem>
        </SelectContent>
      </Select>
      {errors.paymentMethod && (
        <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold">Total: ETB {total.toFixed(2)}</span>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Placing..." : "Confirm Order"}
        </Button>
      </div>
      <Toaster/>
    </form>
  );
};

export default Checkout;
