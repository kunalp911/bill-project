import React from "react";
import CustomerList from "../pages/customer/CustomerList";
import BillList from "../pages/bill/BillList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddBill from "../pages/bill/AddBill";
import UpdateBill from "../pages/bill/UpdateBill";
const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerList />}></Route>
          <Route path="/customer-list" element={<CustomerList />}></Route>
          <Route path="/bill-list" element={<BillList />}></Route>
          <Route path="/bill-add" element={<AddBill />}></Route>
          <Route path="/bill-update/:id" element={<UpdateBill />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
