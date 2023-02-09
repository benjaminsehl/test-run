import { defer } from "@shopify/remix-oxygen";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { Layout } from "~/components";
import styles from "./styles/app.css";
import favicon from "../public/favicon.svg";

export const links = () => {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com",
    },
    {
      rel: "preconnect",
      href: "https://shop.app",
    },
    { rel: "icon", type: "image/svg+xml", href: favicon },
  ];
};

export const meta = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ context }) {
  const cartId = await context.session.get("cartId");
  const layout = await context.storefront.query(LAYOUT_QUERY);

  const cart = cartId
    ? context.storefront.query(CART_QUERY, {
        variables: {
          cartId,
          /**
      Country and language properties are automatically injected
      into all queries. Passing them is unnecessary unless you
      want to override them from the following default:
      */
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
        cache: context.storefront.CacheNone(),
      })
    : null;

  return defer({
    cart,
    layout,
  });
}

export default function App() {
  const data = useLoaderData();
  const { name, description } = data.layout.shop;
  const cart = data.cart;

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout description={description} title={name} cart={cart}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const CART_QUERY = `#graphql
  query CartQuery($cartId: ID!) {
    cart(id: $cartId) {
      id
      totalQuantity
    }
  }
`;

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
    }
  }
`;
