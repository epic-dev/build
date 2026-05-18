import type { Metadata } from "next";
import { Counter } from "./components/counter/Counter";
import { Cart } from "./components/cart/Cart";

export default function IndexPage() {
  return <div>
    <Cart />
    <Counter />
    </div>;
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
