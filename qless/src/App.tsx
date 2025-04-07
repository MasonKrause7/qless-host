import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LandingPage from './pages/login-signup/LandingPage';
import CookDashboard from './pages/kitchen/CookDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import CustomerInterface from './pages/customer/CustomerInterface';
import OrderMenu from './pages/customer/OrderMenu';
import './styles/global.css';
import { StrictMode } from 'react';

function App() {


  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/manage" element={<ManagerDashboard />} />
      <Route path="/cook" element={
        <StrictMode>
          <CookDashboard />
        </StrictMode>
      } />
      <Route path="/customer" element={<CustomerInterface />} />
      <Route path="/order-menu" element={<OrderMenu />} />
    </Routes>

  )
}

export default App;

export type ManagementSubDashProps = {
  manager: User | null
}
export type User = {
  first_name: string,
  last_name: string,
  email: string,
  user_id: string,
  is_manager: boolean
}
export type Employee = {
  first_name: string,
  last_name: string,
  email: string,
  employee_id: string,
  truck_id: number,
  truck_name: string,
  date_assigned: string
}
export type Truck = {
  truck_id: number,
  truck_name: string,
  image_path: string | null,
  qr_code_path: string,
  menu_id: number | null,
  manager_id: number
}
export type Menu = {
  menu_id: number,
  menu_name: string,
  manager_id: string
}
export type TruckAssignment = {
  assignment_id: number,
  truck_id: number,
  employee_id: string,
  date_assigned: string
}

export type Order = {
  order_id: number,
  subtotal: number,
  tax_rate: number,
  customer_phone_number: string,
  time_received: Date,
  time_being_cooked: Date | null,
  time_ready: Date | null,
  time_picked_up: Date | null,
  status_id: OrderStatus,
  truck_id: number
}

export type OrderDetail = {
  order_product_id: number,
  qty: number,
  product: Product
}

export type Product = {
  product_name: string,
  price: number,
  image_path: string
}

export enum OrderStatus {
  Received = 1,
  BeingCooked = 2,
  Ready = 3,
  PickedUp = 4
}