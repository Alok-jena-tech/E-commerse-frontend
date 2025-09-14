 Frontend — E-Commerce App

Stack: React (Vite) · Tailwind CSS · Redux Toolkit (Thunk) · React Router · PayPal SDK · Vercel (deploy)

Project Summary

This is the frontend of the Rabit E-Commerce App, a full-stack MERN project. It provides all customer and admin UI flows, integrates PayPal for payments, and manages application state with Redux Toolkit + Thunk.

The frontend communicates with the Express/MongoDB backend via REST APIs.

Key Features

Authentication & Role Based UI

Login / Register with JWT (stored in localStorage).

Role-based routing: customer vs. admin dashboards.

Product Browsing

Public product listing with images, details, and filters.

Advanced filters: gender, category, color, size, brand, price range.

Sorting: price/date ascending & descending.

Cart Management

Guest cart stored in localStorage with a guestId.

On login, guest cart merges into user cart (handled by backend).

Checkout & Payments

Integrated with PayPal using @paypal/react-paypal-js.

Order created only after PayPal success response.

Order Management

Customers: view past orders, purchase date, delivery status.

Admin: view all orders, update status (processing → shipping → delivered).

Admin Features

Product CRUD (create/edit/delete).

Manage users: change roles (customer ↔ admin).

Order status management.

Responsive UI

Tailwind CSS for styling.

Mobile-first design with clean UI/UX.


State Management:
Redux Toolkit + Thunk handles async API calls (login, product fetch, cart updates, orders).


Security:
JWT tokens stored in localStorage; sent in Authorization header for protected routes.

PayPal:
Handled in frontend with PayPal SDK. Backend verifies transactions before creating orders.

Run Locally

git clone <repo>

cd frontend

Create .env file:

VITE_API_URL=http://localhost:5000
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id


Install dependencies:

npm install


Start dev server:

npm run dev

Deployment

Deployed on Vercel.

Environment variables configured in Vercel dashboard:

VITE_API_URL → backend deployment URL

VITE_PAYPAL_CLIENT_ID → PayPal sandbox/live client ID

Demo Flow

Browse products without login.

Add to cart (guest cart saved in localStorage).

Login → guest cart merges into user cart.

Checkout with PayPal → order created in backend.

Admin login → manage products, users, and orders.

Contact

Alok Kumar Jena — available for walkthroughs and code review.
