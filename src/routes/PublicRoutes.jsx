import Login from "../views/public/Login";
import { Routes } from "react-router-dom";

export default () => (
  <Routes>
    <Route path="/" element={<Login />} />
  </Routes>
);
