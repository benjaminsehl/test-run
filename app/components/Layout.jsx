import { Suspense } from "react";

import { Await } from "@remix-run/react";

export function Layout({ children, cart, title, description }) {
  return (
    <div className="Layout">
      <CartCount cart={cart} />
      <h1>{title}</h1>
      <h2>{description}</h2>
      {children}
    </div>
  );
}

export function CartCount({ cart }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        fontSize: 14,
        display: "flex",
      }}
    >
      <span>CART</span>
      &nbsp;
      <Suspense fallback={<span>0</span>}>
        <Await resolve={cart}>
          {(data) => <span>{data?.cart?.totalQuantity || 0}</span>}
        </Await>
      </Suspense>
    </div>
  );
}
