import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { increment, decrement } from "@/redux/cartSlice";

const Cart = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  const totalPrice = Object.values(cart).reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );

  return (
    <div className="fixed top-25 right-10 z-50">
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="default">
            <ShoppingCart /> Cart ({Object.values(cart).length})
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl overflow-y-auto">
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ShoppingCart /> Cart
              </DialogTitle>
            </DialogHeader>

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
                        Price:{" "}
                        <span className="text-bold">
                          ETB {item.price.toFixed(2)}
                        </span>
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

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xl font-semibold">
                    Total: ETB {totalPrice.toFixed(2)}
                  </p>
                  <Button onClick={() => navigate("/checkout")}>
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
