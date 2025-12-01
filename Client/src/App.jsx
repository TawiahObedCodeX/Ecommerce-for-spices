import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Products from "./Pages/Products";
import Contact from "./Pages/Contact";
import RoleSelector from "./Components/RoleSelector";
import AdminAuth from "./Pages/AdminAuth";
import ClientAuth from "./Pages/ClientAuth";
import DashboardAdmin from "./Pages/DashboardForAdmin";
import DashboardForClient from "./Pages/DashboardForClient";
import AdminAnalytics from "./Pages/AdminAnalytics";
import AdminAddProduct from "./Pages/AdminAddProduct";
import AdminViewPostAdd from "./Pages/AdminViewPostAdd";
import AdminTrackOrdertoClient from "./Pages/AdminTrackOrdertoClient";
import AdminOneOnOneSection from "./Pages/AdminOneOnOneSection";
import AdminMessages from "./Pages/AdminMessages";
import ClientBrowserAdds from "./Pages/ClientBrowserAdds";
import ClientAddtocart from "./Pages/ClientAddtocart";
import Clientpaymentsystem from "./Pages/Clientpaymentsystem";
import ClientMeetingAdminvirtual from "./Pages/ClientMeetingAdminvirtual";
import ClientTrackOrder from "./Pages/ClientTrackOrder";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Outlet />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/roleselector" element={<RoleSelector />} />
        <Route path="/adminform" element={<AdminAuth />} />
        <Route path="/clientform" element={<ClientAuth />} />
        {/* Admin Routes */}
        <Route path="/dashboard-admin" element={<DashboardAdmin />}>
          <Route index element={<AdminAnalytics />} />
          <Route path="addpostadd" element={<AdminAddProduct />} />
          <Route path="viewadd" element={<AdminViewPostAdd />} />
          <Route path="admintrackorder" element={<AdminTrackOrdertoClient />} />
          <Route path="sectionwithClient" element={<AdminOneOnOneSection />} />
          <Route path="ordermessage" element={<AdminMessages />} />
        </Route>
        {/* Admin Routes */}
        {/* Client Routes */}
 <Route path="/dashboard-client" element={<DashboardForClient />}>
  <Route index element={<ClientBrowserAdds />} />
  <Route path="addtocart" element={<ClientAddtocart />} />
  <Route path="clientpaymentsystem" element={<Clientpaymentsystem />} />
  <Route path="sectionwiththeadmin" element={<ClientMeetingAdminvirtual />} />
  <Route path="trackmyorder/:orderId" element={<ClientTrackOrder />} /> {/* Added :orderId */}
</Route>
        {/* Client Routes */}
      </Route>
    )
  );
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
