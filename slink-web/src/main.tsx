import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import NotFound from "./NotFound.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { Button } from "./components/ui/button.tsx";
import { Props } from "./lib/utils.ts";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import Dashboard from "./Dashboard.tsx";
import { GithubIcon } from "./assets/icons.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const ROUTES = {
  HOME: "/app/home",
  DASHBOARD: "/app/dashboard",
};

function NavToggle() {
  let location = useLocation();
  let isHome = location.pathname === ROUTES.HOME;

  return (
    <div>
      <Link to={isHome ? ROUTES.DASHBOARD : ROUTES.HOME}>
        <Button className="bg-gray-600 hover:bg-gray-500 text-gray-50 focus:ring-2 focus:ring-gray-500 flex items-center space-x-2">
          {isHome ? "Go to Dashboard" : "Go to Home"}
        </Button>
      </Link>
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 z-10 w-full bg-gray-900 px-4 py-2 flex items-center justify-between">
      <Link
        className="text-gray-400 hover:text-gray-300 focus:ring-gray-500"
        to="https://github.com/augtheo/slink"
      >
        <GithubIcon className="h-6 w-6" />
      </Link>
      <div className="flex items-center space-x-4">
        <SignedOut>
          <SignInButton>
            <Button className="bg-gray-600 hover:bg-gray-500 text-gray-50 focus:ring-2 focus:ring-gray-500 flex items-center space-x-2">
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <NavToggle />
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}

function Nav() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 ">
      <Header />
      <main className="flex flex-col top-14 flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}

function Root() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 ">
      <div className="max-w-md w-full space-y-4">
        <div>
          <SlinkLogo className="block m-auto" />
        </div>
        <Outlet />
        <p className="text-sm text-gray-400 text-center">
          Shorten your URLs and share them with ease.
        </p>
      </div>
    </div>
  );
}

function SlinkLogo(props: Props) {
  return (
    <svg
      {...props}
      width="191.1"
      height="74.602"
      viewBox="0 0 191.1 74.602"
      xmlns="http://www.w3.org/2000/svg"
      strokeLinecap="round"
      fillRule="evenodd"
      fontSize="9pt"
      stroke="#ffffff"
      strokeWidth="0.25mm"
      fill="#ffffff"
    >
      <path
        d="M 188.4 65 L 189.5 64.5 L 191.1 67.9 Q 189.356 69.498 186.636 71.123 A 48.734 48.734 0 0 1 184.45 72.35 A 23.208 23.208 0 0 1 181.43 73.699 Q 178.915 74.6 176.7 74.6 A 7.993 7.993 0 0 1 170.333 71.375 Q 167.934 68.455 166.41 62.893 A 48.972 48.972 0 0 1 165.8 60.4 A 76.477 76.477 0 0 1 164.585 53.879 A 59.699 59.699 0 0 1 164.1 49 Q 170.025 47.611 173.165 45.665 A 13.138 13.138 0 0 0 173.65 45.35 A 8.306 8.306 0 0 0 175.411 43.77 A 6.005 6.005 0 0 0 176.8 39.85 A 4.743 4.743 0 0 0 176.628 38.514 Q 176.194 37.035 174.656 36.642 A 5.084 5.084 0 0 0 173.4 36.5 A 5.758 5.758 0 0 0 171.448 36.912 Q 168.566 37.976 163.824 41.79 A 87.338 87.338 0 0 0 162 43.3 Q 157.533 62.152 157.057 70.387 A 31.585 31.585 0 0 0 157 72.2 Q 153.097 73.336 147.531 73.665 A 81.886 81.886 0 0 1 142.7 73.8 A 64.685 64.685 0 0 1 142.632 72.389 Q 142.608 71.746 142.602 71.174 A 36.038 36.038 0 0 1 142.6 70.8 A 19.486 19.486 0 0 1 142.802 68.456 Q 143.521 62.989 146.796 48.277 A 1142.18 1142.18 0 0 1 148.35 41.4 A 531.643 531.643 0 0 0 150.59 31.194 Q 154.1 14.353 154.1 7.4 Q 154.1 4.861 153.745 3.447 A 4.99 4.99 0 0 0 153.5 2.7 Q 161.3 0 168.2 0 Q 169.024 0.824 169.094 3.999 A 27.615 27.615 0 0 1 169.1 4.6 A 44.829 44.829 0 0 1 168.798 9.326 Q 167.811 18.408 163.6 36.4 Q 172.5 29.1 181.2 29.1 A 10.508 10.508 0 0 1 184.697 29.663 A 9.227 9.227 0 0 1 187.8 31.5 Q 190.407 33.817 190.497 38.186 A 15.292 15.292 0 0 1 190.5 38.5 A 9.689 9.689 0 0 1 186.751 46.119 Q 183.453 48.921 177.254 50.756 A 49.662 49.662 0 0 1 176.4 51 Q 179.645 61.227 182.116 64.975 A 13.352 13.352 0 0 0 182.2 65.1 Q 183.057 66.347 183.55 66.622 A 0.525 0.525 0 0 0 183.8 66.7 A 2.76 2.76 0 0 0 184.396 66.619 Q 185.361 66.398 187.171 65.578 A 50.625 50.625 0 0 0 188.4 65 Z M 94.7 73.7 L 92.8 73.7 Q 92.8 69 95.65 55.7 Q 98.001 44.727 98.413 41.582 A 8.435 8.435 0 0 0 98.5 40.6 A 9.004 9.004 0 0 0 97.885 37.418 Q 97.427 36.203 96.629 34.938 A 19.208 19.208 0 0 0 95.7 33.6 L 94.8 32.4 L 94.9 31.1 Q 100.3 29.6 112.2 29.6 A 4.845 4.845 0 0 1 112.866 30.856 Q 113.53 32.636 113.6 35.8 Q 122.3 29.1 128.3 29.1 A 8.366 8.366 0 0 1 130.974 29.509 A 6.89 6.89 0 0 1 134.05 31.6 A 8.816 8.816 0 0 1 136.104 36.324 A 11.828 11.828 0 0 1 136.2 37.85 A 20.194 20.194 0 0 1 136.056 40.066 Q 135.645 43.725 134.055 50.176 A 191.513 191.513 0 0 1 133.9 50.8 Q 131.916 58.737 131.643 62.171 A 12.51 12.51 0 0 0 131.6 63.15 Q 131.6 66.3 132.4 66.3 A 1.243 1.243 0 0 0 132.73 66.233 Q 133.502 65.997 135.595 64.923 A 96.712 96.712 0 0 0 136.6 64.4 L 137.8 63.8 L 139.6 67.3 Q 138.795 68.016 137.51 69.051 A 111.271 111.271 0 0 1 137.2 69.3 Q 135.712 70.49 131.716 72.517 A 104.951 104.951 0 0 1 131.65 72.55 A 23.519 23.519 0 0 1 128.966 73.717 Q 127.511 74.238 126.184 74.451 A 11.229 11.229 0 0 1 124.4 74.6 A 9.176 9.176 0 0 1 121.379 74.144 Q 117.297 72.723 117.109 66.876 A 17.898 17.898 0 0 1 117.1 66.3 Q 117.1 63.06 119.028 54.763 A 213.147 213.147 0 0 1 119.35 53.4 Q 121.6 44 121.6 41.3 A 6.417 6.417 0 0 0 121.54 40.382 Q 121.281 38.6 119.9 38.6 A 8.716 8.716 0 0 0 117.7 38.909 Q 115.686 39.436 113.204 40.864 A 31.08 31.08 0 0 0 112.8 41.1 A 32.79 32.79 0 0 1 112.638 41.934 Q 112.181 44.169 110.8 50.1 A 289.076 289.076 0 0 0 109.279 57.323 Q 107.39 66.952 107.304 71.843 A 25.946 25.946 0 0 0 107.3 72.3 Q 103.8 73.7 94.7 73.7 Z M 47.9 7.1 L 47.3 2.7 A 52.324 52.324 0 0 1 54.622 0.718 A 38.923 38.923 0 0 1 61.9 0 A 4.037 4.037 0 0 1 62.417 1.048 Q 62.9 2.466 62.9 4.9 Q 62.9 11.464 59.5 28.095 A 533.251 533.251 0 0 1 57.85 35.85 Q 52.8 58.8 52.8 62.55 A 24.458 24.458 0 0 0 52.822 63.63 Q 52.927 65.998 53.536 66.266 A 0.402 0.402 0 0 0 53.7 66.3 L 60.7 63.8 L 62.5 67.3 Q 59.153 69.958 54.401 72.228 A 58.36 58.36 0 0 1 54.25 72.3 A 31.895 31.895 0 0 1 51.355 73.513 Q 49.851 74.052 48.508 74.324 A 12.925 12.925 0 0 1 45.95 74.6 A 8.476 8.476 0 0 1 43.07 74.128 A 7.405 7.405 0 0 1 40.25 72.3 A 7.536 7.536 0 0 1 38.371 68.917 Q 38.052 67.73 38.007 66.318 A 14.737 14.737 0 0 1 38 65.85 Q 38 62.305 41.612 45.48 A 969.078 969.078 0 0 1 42.95 39.35 Q 46.624 22.762 47.571 13.032 A 62.157 62.157 0 0 0 47.9 7.1 Z M 29.501 69.43 A 11.845 11.845 0 0 0 33.6 60.3 A 9.092 9.092 0 0 0 33.544 59.303 Q 33.284 56.938 31.8 54.3 A 54.605 54.605 0 0 0 30.956 52.849 Q 29.729 50.817 28.9 49.95 A 216.633 216.633 0 0 0 28.672 49.712 Q 27.726 48.726 27.1 48.1 Q 31.484 43.213 32.717 39.849 A 7.034 7.034 0 0 0 33.2 37.45 A 9.059 9.059 0 0 0 33.196 37.172 Q 33.132 35.103 32.116 33.51 A 7.752 7.752 0 0 0 30 31.35 Q 27.7 29.733 23.773 29.278 A 28.963 28.963 0 0 0 20.45 29.1 A 25.086 25.086 0 0 0 15.946 29.487 A 18.37 18.37 0 0 0 9.6 31.85 Q 7.174 33.332 6.056 35.469 A 8.774 8.774 0 0 0 5.1 39.6 Q 5.1 44.6 13.2 53.05 A 82.936 82.936 0 0 1 13.748 53.628 Q 19.161 59.384 20.694 63.297 A 7.771 7.771 0 0 1 21.3 66.1 Q 21.3 68.6 19.042 69.33 A 6.37 6.37 0 0 1 17.6 69.6 Q 15.85 65.225 13.562 62.136 A 20.073 20.073 0 0 0 9.4 57.9 Q 7 58.6 3.5 61.75 A 36.419 36.419 0 0 0 2.667 62.523 Q 0 65.078 0 66.3 A 3.249 3.249 0 0 0 0.375 67.745 Q 1.247 69.501 4.15 71.6 A 13.509 13.509 0 0 0 6.588 72.993 Q 8.525 73.854 10.915 74.254 A 27.235 27.235 0 0 0 15.4 74.6 Q 22.5 74.6 28.05 70.6 A 16.671 16.671 0 0 0 29.501 69.43 Z M 85.6 64.4 L 86.8 63.8 L 88.5 67.3 Q 87.695 68.016 86.41 69.051 A 111.271 111.271 0 0 1 86.1 69.3 Q 84.6 70.5 80.5 72.55 Q 77.025 74.288 73.98 74.552 A 12.467 12.467 0 0 1 72.9 74.6 A 9.18 9.18 0 0 1 70.578 74.322 A 6.475 6.475 0 0 1 67.4 72.45 A 7.228 7.228 0 0 1 65.664 69.104 Q 65.4 67.976 65.4 66.65 A 17.946 17.946 0 0 1 65.547 64.548 Q 65.961 61.104 67.547 54.989 A 185.134 185.134 0 0 1 67.9 53.65 Q 70.4 44.3 70.4 41.5 A 13.32 13.32 0 0 0 68.228 34.24 A 16.434 16.434 0 0 0 67.8 33.6 L 66.9 32.4 L 67 31.1 Q 71.234 29.902 79.68 29.661 A 158.859 158.859 0 0 1 84.2 29.6 A 3.949 3.949 0 0 1 84.872 30.765 Q 85.328 31.938 85.453 33.801 A 22.477 22.477 0 0 1 85.5 35.3 Q 85.5 39.5 82.8 49.75 Q 80.502 58.475 80.16 62.056 A 11.698 11.698 0 0 0 80.1 63.15 Q 80.1 65.412 80.564 66.05 A 0.53 0.53 0 0 0 81 66.3 A 1.394 1.394 0 0 0 81.345 66.233 Q 82.166 65.997 84.485 64.923 A 124.272 124.272 0 0 0 85.6 64.4 Z M 72.241 15.058 A 6.488 6.488 0 0 0 74.1 18.65 A 6.321 6.321 0 0 0 74.434 18.953 Q 76.384 20.6 79.6 20.6 Q 83.1 20.6 85.95 18.1 A 10.212 10.212 0 0 0 87.095 16.929 A 7.021 7.021 0 0 0 88.8 12.35 A 9.363 9.363 0 0 0 88.704 10.988 A 6.722 6.722 0 0 0 86.8 7.1 Q 84.8 5.1 81.2 5.1 Q 77.6 5.1 74.85 7.6 A 10.283 10.283 0 0 0 74.022 8.442 A 7.338 7.338 0 0 0 72.1 13.4 A 9.323 9.323 0 0 0 72.241 15.058 Z M 22.5 43.3 L 24 44.6 A 18.17 18.17 0 0 0 25.935 42.695 Q 26.855 41.628 27.401 40.571 A 6.644 6.644 0 0 0 28.2 37.5 A 3.56 3.56 0 0 0 27.841 35.848 Q 27.08 34.372 24.703 34.075 A 10.528 10.528 0 0 0 23.4 34 Q 21.459 34 20.088 34.676 A 5.264 5.264 0 0 0 19.6 34.95 A 4.827 4.827 0 0 0 18.913 35.468 Q 18.572 35.782 18.374 36.121 A 1.909 1.909 0 0 0 18.1 37.1 A 3.277 3.277 0 0 0 18.41 38.396 Q 19.269 40.363 22.5 43.3 Z"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/app" element={<Nav />}>
        {/* TODO:  Redirect to auth if accessed dashboard without auth*/}
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app" element={<Root />}>
          <Route path="/app/error" element={<NotFound />} />
          <Route path="/app/home" element={<App />} />
          <Route path="/app/" element={<Navigate to="/app/home" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/app/home" replace />} />
      </Route>
    </>,
  ),
);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
);
