## Fast Pizza App

- Now the same restaurant (business) needs a simple way of allowing customers to order pizzas and get them delivered to their home
- We were hired to build the application front-end

## STEP 1 : Project Planning

- Please refer Theory_V1.pdf file

## STEP 2 : File Structure

- We'll do feature based File or Folder Structure

- i> Features Directory - Each feature will have been developed and preserved in a single folder
  This gives more organized way of Code Splitting and Easy to Read through and follow

  - features
    - User
    - Manu
    - Cart
    - Order

- ii> ui Directory - This will contain re-usable UI Components like buttons, inputs and so on.
  These components should only be presentational, and don't contain any side effects.

  - ui

- iii> Services - This contains re-usable codes which interacts with APIs

  - services
    - apiGeocoding.js
    - apiRestaurant.js

- iv> utils - This folder will contain some helper functions which can be used through out the project.
  These are all stateless helper functions. They don't create any side effects.

  - utils

    - helper.js

  - Here we'll have formatCurrency, formatDate, calcMinutesLeft functions in this file

## STEP 3 : Setting Up React router

In this step, we integrate React Router DOM v6.x (react-router-dom) to manage the navigation and routing within our React application. This version of React Router offers a more modern, declarative approach for defining routes, significantly improving both code readability and maintainability.

- React Router v6 introduces powerful features that streamline the routing experience, such as:
- Declarative Routing: Routes are now defined in a more intuitive and predictable manner, making it easier to organize and manage.
- Error Boundaries & Data Fetching: Enhanced mechanisms for managing errors and loading data asynchronously, improving user experience by providing smoother navigation and error handling.
- Dynamic Routing & Nested Layouts: Greater flexibility in managing routes, with support for dynamic and nested routes.

  ### 1. Install React Router:

  - Use React Router DOM v6.x to manage navigation in your React app.
  - It offers a declarative way to define routes, improving code readability and maintainability.

  ### 2. Setting Up Explicit Routes

  - Create a createBrowserRouter instance to define explicit routes for different app pages.
  - Example:

  ```js
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/menu",
      element: <Menu />,
      loader: menuLoader,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/order/new",
      element: <CreateOrder />,
    },
    {
      path: "/order/:orderId",
      element: <Order />,
    },
  ]);

  const App = () => {
    return <RouterProvider router={router} />;
  };
  ```

  ### 3. Create App Layout:

  - Design a global layout component to manage common UI elements like the header, footer, and cart overview.
  - Use the Outlet component to render specific content based on the active route.

    - App.js

    ````js
        const router = createBrowserRouter([
        {
            element: <AppLayout />,
            errorElement: <Error />,

            children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/menu",
                element: <Menu />,
                loader: menuLoader,
                errorElement: <Error />,
            },
            { path: "/cart", element: <Cart /> },
            {
                path: "/order/new",
                element: <CreateOrder />,
                action: createOrderAction,
            },
            {
                path: "/order/:orderId",
                element: <Order />,
                loader: orderLoader,
                errorElement: <Error />,
                action: updateOrderAction,
            },
            ],
        },
        ]);
        ```

    function App() {
    return <RouterProvider router={router} />;
    }

    export default App;
    ````

    - AppLayout.js

    ```js
    const AppLayout = () => {
      return (
        <div>
          <Header />

          <main>
            <Outlet />
          </main>

          <CartOverview />
        </div>
      );
    };

    export default AppLayout;
    ```

  ### 4. Setting Up loaders

  - Pre-fetching Data

    - Loaders fetch data before a component renders, ensuring all necessary data is ready when the page loads, which prevents loading states and flickers in the UI.

    - We're using render-as-you-fetch strategy here Vs Fetch-on-Render with useEffect

    - Fetch-on-Render with useEffect will create data-loading-waterfall

  - Menu Loader
    - A loader fetches data asynchronously before the route is rendered. In this case, we load the menu data for the Menu page.
    - Example:

  ```js
  export const menuLoader = async () => {
    const menu = await getMenu();
    return menu;
  };
  ```

  - Menu.jsx

    - Use useLoaderData() to access the data loaded by the loader inside the component.
    - Example:

    ```js
    import { useLoaderData } from "react-router-dom";
    import { getMenu } from "../../services/apiRestaurant";

    function Menu() {
      const menu = useLoaderData();

      console.log(menu);

      return <h1>Menu</h1>;
    }

    export const menuLoader = async () => {
      const menu = await getMenu();
      return menu;
    };

    export default Menu;
    ```

  ### 5. Rendering Menu Items

  - Menu.jsx

    ```js
    function Menu() {
      const menu = useLoaderData();

      return (
        <ul>
          {menu.map((item) => (
            <MenuItem key={item.id} pizza={item} />
          ))}
        </ul>
      );
    }

    export const menuLoader = async () => {
      const menu = await getMenu();
      return menu;
    };

    export default Menu;
    ```

  - MenuItem.jsx

    ```js
    function MenuItem({ pizza }) {
      const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

      return (
        <li>
          <img src={imageUrl} alt={name} />
          <div>
            <p>{name}</p>
            <p>{ingredients.join(", ")}</p>
            <div>
              {!soldOut ? <p>{formatCurrency(unitPrice)}</p> : <p>Sold out</p>}
            </div>
          </div>
        </li>
      );
    }

    export default MenuItem;
    ```

  ### 6. Setting Up Loading Animation

  - We could see some delay in UI since Fetching data from external API will take some time
  - So we could Implement a Loading Animation or Spinner to Improve the User Experience better

    - AppLayout.jsx

      ```js
      const AppLayout = () => {
        const navigation = useNavigation();
        const isLoading = navigation.state === "loading";

        return (
          <div className="layout">
            {isLoading && <Loader />}

            <Header />

            <main>
              <Outlet />
            </main>

            <CartOverview />
          </div>
        );
      };

      export default AppLayout;
      ```

    - Loader.jsx

      ```js
      import React from "react";

      const Loader = () => {
        return <div className="loader"></div>;
      };

      export default Loader;
      ```

  ### 7. Error handling

  - Ensuring smooth navigation and providing a good user experience when things go wrong
  - such as missing pages, failed data loading, or route mismatches.
  - React Router v6 supports error boundaries at the route level. You can define a ErrorBoundary for specific routes
  - We can render an error element with common error component

  - Error.jsx

    ```js
    import { useNavigate, useRouteError } from "react-router-dom";

    function NotFound() {
      const navigate = useNavigate();
      const error = useRouteError();

      console.log(error);

      return (
        <div>
          <h1>Something went wrong 😢</h1>
          <p>{error.data || error.message}</p>

          <button onClick={() => navigate(-1)}>&larr; Go back</button>
        </div>
      );
    }

    export default NotFound;
    ```

  - In App.jsx

        ```js
        const router = createBrowserRouter([
        {
            element: <AppLayout />,
            errorElement: <NotFound />,

            children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/menu",
                element: <Menu />,
                loader: menuLoader,
                errorElement: <NotFound />,  // Note Error Prone Component
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/order/new",
                element: <CreateOrder />,
            },
            {
                path: "/order/:orderId",
                element: <Order />,
            },
            ],
        },
        ]);
        ```

## STEP 4 : Fetching Orders by orderId

- Now we implement functionality to fetch and display an individual order based on its orderId.

- Function to getOrder(id)

  - The function getOrder(id) uses the fetch() method to make a request to the API endpoint.
  - If the request is successful, the function parses the response and returns the order data.
  - If the request fails (i.e., the response is not OK), it throws an error with a message indicating that the order couldn't be found.

  ```js
  export async function getOrder(id) {
    const res = await fetch(
      `https://react-fast-pizza-api.onrender.com/api/order/${id}`
    );

    if (!res.ok) throw Error(`Couldn't find order #${id}`);

    const { data } = await res.json();
    return data;
  }
  ```

- orderLoader

  - React Router provides a mechanism called loaders to fetch data asynchronously before rendering a route. In this case, we create a orderLoader that fetches the order details using the orderId from the route's parameters.
  - The loader function extracts the orderId from params, calls the getOrder(id) function, and returns the order data.

  ```js
  export const orderLoader = async ({ params }) => {
    const orderId = params.orderId;
    const order = await getOrder(orderId);

    return order;
  };

  export default Order;
  ```

- router @ App.jsx

  - In the router configuration (App.jsx), we set up the route for fetching and displaying the order. The orderLoader is associated with the route that requires the orderId, and the errorElement specifies a component to show in case of an error (such as when the order is not found).
  - In this example, we use a general NotFound component to handle errors like missing orders.

```js
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
        errorElement: <NotFound />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <NotFound />,
      },
    ],
  },
]);
```

- Order.jsx

  - Finally we comment out the placeholder order at the component, create new order variable inside it.
  - And the new order data will by supplied by useLoaderData() custom hook from react-router-dom

  ```js
  // Test ID: IIDSAT

  import { formatDate } from "../../utils/helpers";
  import { formatCurrency } from "../../utils/helpers";
  import { calcMinutesLeft } from "../../utils/helpers";
  import { getOrder } from "../../services/apiRestaurant";
  import { useLoaderData } from "react-router-dom";

  // const order = {
  //   id: "ABCDEF",
  //   customer: "Jonas",
  //   phone: "123456789",
  //   address: "Arroios, Lisbon , Portugal",
  //   priority: true,
  //   estimatedDelivery: "2027-04-25T10:00:00",
  //   cart: [
  //     {
  //       pizzaId: 7,
  //       name: "Napoli",
  //       quantity: 3,
  //       unitPrice: 16,
  //       totalPrice: 48,
  //     },
  //     {
  //       pizzaId: 5,
  //       name: "Diavola",
  //       quantity: 2,
  //       unitPrice: 16,
  //       totalPrice: 32,
  //     },
  //     {
  //       pizzaId: 3,
  //       name: "Romana",
  //       quantity: 1,
  //       unitPrice: 15,
  //       totalPrice: 15,
  //     },
  //   ],
  //   position: "-9.000,38.000",
  //   orderPrice: 95,
  //   priorityPrice: 19,
  // };

  function Order() {
    const order = useLoaderData();

    // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
    const {
      id,
      status,
      priority,
      priorityPrice,
      orderPrice,
      estimatedDelivery,
      cart,
    } = order;
    const deliveryIn = calcMinutesLeft(estimatedDelivery);

    return (
      <div>
        <div>
          <h2>Status</h2>

          <div>
            {priority && <span>Priority</span>}
            <span>{status} order</span>
          </div>
        </div>

        <div>
          <p>
            {deliveryIn >= 0
              ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
              : "Order should have arrived"}
          </p>
          <p>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
        </div>

        <div>
          <p>Price pizza: {formatCurrency(orderPrice)}</p>
          {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
          <p>
            To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
          </p>
        </div>
      </div>
    );
  }

  export const orderLoader = async ({ params }) => {
    const orderId = params.orderId;
    const order = await getOrder(orderId);

    return order;
  };

  export default Order;
  ```

## STEP 5 : Writing Data with React Router 'Actions'

- placeOrderAction

  ```js
  export const placeOrderAction = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    // console.log(data);

    if (!data) return;

    const order = {
      ...data,
      cart: JSON.parse(data.cart),
      priority: data.priority === "on" ? true : false,
    };

    const response = await createOrder(order);

    return redirect(`/order/${response.id}`);
  };
  ```

- createOrder Function @ apoRestaurant.js

  ```js
  const API_URL = "https://react-fast-pizza-api.jonas.io/api";

  export async function createOrder(newOrder) {
    try {
      const res = await fetch(`${API_URL}/order`, {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw Error();
      const { data } = await res.json();
      return data;
    } catch {
      throw Error("Failed creating your order");
    }
  }
  ```

- Using React Router Form Component

  ```js
  <div>
    <h2>Ready to order? Let's go!</h2>

    {/* <Form method="POST" action="/order/new"> */}
    <Form method="POST">
      <div>
        <label>First Name</label>
        <input type="text" name="customer" required />
      </div>

      <div>
        <label>Phone number</label>
        <div>
          <input type="tel" name="phone" required />
        </div>
      </div>

      <div>
        <label>Address</label>
        <div>
          <input type="text" name="address" required />
        </div>
      </div>

      <div>
        <input
          type="checkbox"
          name="priority"
          id="priority"
          // value={withPriority}
          // onChange={(e) => setWithPriority(e.target.checked)}
        />
        <label htmlFor="priority">Want to yo give your order priority?</label>
      </div>

      <div>
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <button>Order now</button>
      </div>
    </Form>
  </div>
  ```

- Updating the Router @ App.jsx

  ```js
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      errorElement: <NotFound />,

      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/menu",
          element: <Menu />,
          loader: menuLoader,
          errorElement: <NotFound />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/order/new",
          element: <CreateOrder />,
          action: placeOrderAction,
        },
        {
          path: "/order/:orderId",
          element: <Order />,
          loader: orderLoader,
          errorElement: <NotFound />,
        },
      ],
    },
  ]);
  ```

- CreateOrder.jsx Component with Fake Order

  ```js
  import { useState } from "react";
  import { Form, redirect } from "react-router-dom";
  import { createOrder } from "../../services/apiRestaurant";

  // https://uibakery.io/regex-library/phone-number
  const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
      str
    );

  const fakeCart = [
    {
      pizzaId: 12,
      name: "Mediterranean",
      quantity: 2,
      unitPrice: 16,
      totalPrice: 32,
    },
    {
      pizzaId: 6,
      name: "Vegetale",
      quantity: 1,
      unitPrice: 13,
      totalPrice: 13,
    },
    {
      pizzaId: 11,
      name: "Spinach and Mushroom",
      quantity: 1,
      unitPrice: 15,
      totalPrice: 15,
    },
  ];

  function CreateOrder() {
    // const [withPriority, setWithPriority] = useState(false);
    const cart = fakeCart;

    return (
      <div>
        <h2>Ready to order? Let's go!</h2>

        {/* <Form method="POST" action="/order/new"> */}
        <Form method="POST">
          <div>
            <label>First Name</label>
            <input type="text" name="customer" required />
          </div>

          <div>
            <label>Phone number</label>
            <div>
              <input type="tel" name="phone" required />
            </div>
          </div>

          <div>
            <label>Address</label>
            <div>
              <input type="text" name="address" required />
            </div>
          </div>

          <div>
            <input
              type="checkbox"
              name="priority"
              id="priority"
              // value={withPriority}
              // onChange={(e) => setWithPriority(e.target.checked)}
            />
            <label htmlFor="priority">
              Want to yo give your order priority?
            </label>
          </div>

          <div>
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            <button>Order now</button>
          </div>
        </Form>
      </div>
    );
  }

  export const placeOrderAction = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    // console.log(data);

    if (!data) return;

    const order = {
      ...data,
      cart: JSON.parse(data.cart),
      priority: data.priority === "on" ? true : false,
    };

    const response = await createOrder(order);

    return redirect(`/order/${response.id}`);
  };

  export default CreateOrder;
  ```

- Error Handling with Phone Number

  ```js
  // isValidPhone function
  const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
      str
    );

  // Place Order Action
  export const placeOrderAction = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    // console.log(data);

    // Handling Wrong or Invalid Phone Number
    const errors = {};
    if (!isValidPhone(data.phone)) {
      errors.phone =
        "Please give us your correct phone number. We might need it to contact you.";
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    }

    if (!data) return;

    const order = {
      ...data,
      cart: JSON.parse(data.cart),
      priority: data.priority === "on" ? true : false,
    };

    // If Everything is ok, create new order and redirect
    const response = await createOrder(order);

    return redirect(`/order/${response.id}`);
  };
  ```

  ```js
  // Create Order Component
  function CreateOrder() {
    const navigation = useNavigation();
    const formError = useActionData();
    const isSubmitting = navigation.state === "submitting";

    // const [withPriority, setWithPriority] = useState(false);
    const cart = fakeCart;

    console.log(formError);

    return (
      <div>
        <h2>Ready to order? Let's go!</h2>

        {/* <Form method="POST" action="/order/new"> */}
        <Form method="POST">
          <div>
            <label>First Name</label>
            <input type="text" name="customer" required />
          </div>

          <div>
            <label>Phone number</label>
            <div>
              <input type="tel" name="phone" required />
            </div>
            {formError?.phone && <p>{formError.phone}</p>}
          </div>

          <div>
            <label>Address</label>
            <div>
              <input type="text" name="address" required />
            </div>
          </div>

          <div>
            <input
              type="checkbox"
              name="priority"
              id="priority"
              // value={withPriority}
              // onChange={(e) => setWithPriority(e.target.checked)}
            />
            <label htmlFor="priority">
              Want to yo give your order priority?
            </label>
          </div>

          <div>
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            <button disabled={isSubmitting}>
              {isSubmitting ? " Placing Order" : "Order now"}
            </button>
          </div>
        </Form>
      </div>
    );
  }
  ```

## STEP 6 : Setting Up Tailwind CSS

### Introduction :

- ### What is TailwindCSS ?
  ```
  "A Utility-First" CSS Framework packed with Utility classes like flex, text-center, rotate-90, etc..
  that can be composed to build any design, directly into our markup (HTML or JSX)
  ```
- ### Utility-first CSS Approach :
  ```
  Writing tiny css classes with one single purpose, and then combining them to build a Entire Layour or Atomic CSS
  ```
- ### How to use TailwindCSS ?
  ```
  In tailwindCSS, the classes are already written for us. So we're not gonna write any new CSS. But instead use some of tailwind's hundreds of classes.
  ```
- ### Pros of TailwindCSS :

  - We don't need to think about names of Classes
  - No need to jump between files to write markup and styles
  - Immediately understand styling in any project that uses tailwind
  - Tailwind is a design system : Many design desicions have been taken for us like pre-defined colors, spacings and etc.., which makes UI looks better
  - Saves a lot of time, e.g. on responsive design
  - Docs and VS Code integration are great

- ### Cons of TailwindCSS :

  - Markup (HTML or JSX) looks vert unreadable, with lots of class names
  - We need to learn a lot of class names
  - We need to install and setup tailwind on each new project
  - We're giving up on "Vanilla CSS"

- ### TailwindCSS Vs Bootstrap

  - #### Release Date: November 2017 vs. August 2011

    (Note: TailwindCSS was released in November 2017, not 2018)

  - #### Approach: Utility-first vs. Component-based

    (TailwindCSS uses a utility-first approach, while Bootstrap follows a component-based approach)

  - #### Customization: Highly customizable vs. Less customizable

    (TailwindCSS offers greater flexibility in customization, while Bootstrap provides predefined components that are less flexible)

  - #### Code cleanliness: Avoids bloating HTML template vs. Can lead to bloated HTML

    (TailwindCSS promotes cleaner HTML with utility classes, while Bootstrap’s pre-built components can result in more bloated HTML code)

  - #### Popular for: Flexibility vs. Pre-built responsiveness

    (TailwindCSS is favored for its flexibility, while Bootstrap is popular for its pre-designed, responsive components)

  - #### Bundle Size: Reduced file size using PurgeCSS vs. Larger file size by default

    (TailwindCSS reduces the final bundle size by purging unused CSS, while Bootstrap typically has a larger default file size due to its comprehensive CSS)

  - #### Better for: Projects that require more customization vs. Rapid prototyping or common layouts
    (TailwindCSS excels in projects that need extensive customization, while Bootstrap is better for projects requiring rapid prototyping or standard layouts)

- ### CSS Framework Comparison: Vanilla CSS vs Bootstrap vs TailwindCSS

  This document compares the key features of **Vanilla CSS**, **Bootstrap**, and **Tailwind CSS**, helping you choose the best framework for your project.

  | **Feature**          | **Vanilla CSS**                                   | **Bootstrap**                                           | **Tailwind CSS**                                            |
  | -------------------- | ------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- |
  | **Release Date**     | 1996                                              | August 2011                                             | November 2017                                               |
  | **Approach**         | Custom styles for every element                   | Component-based framework with predefined styles        | Utility-first framework with low-level utility classes      |
  | **Customization**    | Fully customizable, but requires effort           | Less customizable, predefined components                | Highly customizable with utility classes                    |
  | **Code Cleanliness** | Can be messy without organization                 | Can lead to bloated HTML and CSS                        | Keeps code clean by using utility classes                   |
  | **Popular For**      | Custom web designs, small-to-medium projects      | Rapid prototyping, standard layouts, common UI patterns | Highly flexible, customizable designs                       |
  | **Bundle Size**      | Minimal (depends on your CSS file size)           | Larger file size due to pre-built components            | Small bundle size (optimized with PurgeCSS)                 |
  | **Learning Curve**   | Steep (requires understanding CSS basics)         | Low to medium (easy-to-use pre-built components)        | Medium to high (requires understanding of utility-first)    |
  | **Flexibility**      | Full flexibility (control everything)             | Moderate flexibility (limited by components)            | High flexibility (complete control using utilities)         |
  | **Responsiveness**   | Manual setup with media queries                   | Built-in responsive grid system                         | Achieved through utility classes, no built-in grid          |
  | **Performance**      | Optimal (no external dependencies)                | Can be less performant due to large file size           | Excellent (optimized with PurgeCSS to remove unused styles) |
  | **Common Use Cases** | Custom designs, complex UIs, tailored experiences | Prototyping, standard layouts, quick designs            | Custom web designs, flexible UIs, high customization        |

  ***

  #### Summary

  - **Vanilla CSS**: Ideal for fully custom designs and complete control, but requires more time and effort.
  - **Bootstrap**: Great for rapid prototyping with a set of pre-built components but may lead to bloat.
  - **Tailwind CSS**: A utility-first framework providing flexibility and clean code, but requires a learning curve.

  Each framework has its strengths depending on the project needs. Choose the one that best fits your goals and workflow.

### TailwindCSS - Setup - Step 1 : Setting Up

- Please visit TailwindCSS Docs for latest Installation Steps : https://tailwindcss.com/docs/installation
- Once you land on the docs page, Click on Framwork Guide
- Select Vite (Frameworks List), and Select Using React
- Follow the Steps mentioned, then run npm run dev
- Also visit : https://tailwindcss.com/docs/preflight, to know TailwindCSS auto reset on your project
- Install TailwindCSS Extensions for VS Code
  - 1. TailwindCSS IntelliSense - Gives Suggestion, Autocompletion and Equivalent Vanilla CSS
  - Tailwind Prettier Extention - GitHub : https://github.com/tailwindlabs/prettier-plugin-tailwindcss

### Setup - Step 2 : Working with Colors

- Read TailwindCSS doc - https://tailwindcss.com/docs/customizing-colors
- Ex.: Colors Palette, Text color, Backgrounf Color, Typography - Font Size, Font Weight, etc.

  ```js
  import React from "react";
  import { Link } from "react-router-dom";
  import SearchOrder from "../features/order/SearchOrder";

  const Header = () => {
    return (
      <header className="w-100 flex h-16 items-center justify-between bg-yellow-500">
        <Link to="/">Fast Pizza Co.</Link>

        <SearchOrder />

        <p>Besant</p>
      </header>
    );
  };

  export default Header;
  ```

- Custom Sizing and Properties

  ```js
  function Home() {
    return (
      <div>
        <h1 className="text-center text-[50px] font-[900] capitalize">
          The best pizza.
          <br />
          <span className="text-yellow-500">
            Straight out of the oven, straight to you.
          </span>
        </h1>
      </div>
    );
  }

  export default Home;
  ```

  - Usage Tailwind Classes in index.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite + React</title>
    </head>
    <body class="bg-stone-100 text-stone-700">
      <div id="root"></div>
      <script type="module" src="/src/main.jsx"></script>
    </body>
  </html>
  ```

- Box Modal - Margin & Spacing

  - Ex.1: Header.jsx

    ```js
    import React from "react";
    import { Link } from "react-router-dom";
    import SearchOrder from "../features/order/SearchOrder";
    import Username from "../features/user/Username";

    const Header = () => {
      return (
        <header className="w-100 flex items-center justify-between border-b-8 border-yellow-950/50 bg-yellow-500 p-4 px-4 uppercase">
          <Link to="/" className="tracking-widest">
            Fast Pizza Co.
          </Link>

          <SearchOrder />
        </header>
      );
    };

    export default Header;
    ```

  - Ex.2: Home.jsx

    ```js
    import CreateUser from "../features/user/CreateUser";

    function Home() {
      return (
        <div className="my-10 text-center">
          <h1 className="mb-12 text-center text-[40px] font-semibold capitalize">
            The best pizza.
            <br />
            <span className="text-yellow-500">
              Straight out of the oven, straight to you.
            </span>
          </h1>

          <CreateUser />
        </div>
      );
    }

    export default Home;
    ```

- Responsive Designs

  - Tailwind comes with 5 Break Points, which are min-width media queries
  - sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
  - All classes are mobile-first design.
  - i.e : Once the responsive classes are given, the matching designs will applied to smaller sizes, and responsive classes will get applied to greater break points

    - Ex.1: Home.jsx

      ```js
      import CreateUser from "../features/user/CreateUser";

      function Home() {
        return (
          <div className="my-10 text-center sm:my-48">
            <h1 className="mb-12 text-center text-[40px] font-semibold capitalize">
              The best pizza.
              <br />
              <span className="text-yellow-500">
                Straight out of the oven, straight to you.
              </span>
            </h1>

            <CreateUser />
          </div>
        );
      }

      export default Home;
      ```

    - Ex.2:
