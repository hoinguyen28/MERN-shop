import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import axiosClient from "api/axiosClient";
import NotFound from "components/NotFound";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import ManageDashboad from "scenes/Admin";
import EditProduct from "scenes/Admin/EditProduct";
import ManageOrder from "scenes/Admin/ManageOrder";
import ManageProduct from "scenes/Admin/ManageProduct";
import OrderDetail from "scenes/OrderDetail";
import StatisticalProduct from "scenes/Statistical/Product";
import Checkout from "scenes/checkoutPage/Checkout";
import CartMenu from "scenes/global/CarMenu";
import Navbar from "scenes/global/Navbar";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProductCreate from "scenes/productCreate";
import ProductDetail from "scenes/productDetail";
import ProfilePage from "scenes/profilePage";
import SearchPage from "scenes/searchPage";
import { themeSettings } from "./theme";
import ManageUser from "scenes/Admin/ManageUser";
import EditProfile from "scenes/EditProfile";
import RegisterForm from "scenes/loginPage/RegisterForm";
import Dashboard from "scenes/dashboard";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const user = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";

  const token = useSelector((state) => state.token);

  if (token) {
    const authHeader = `Bearer ${token}`;
    axiosClient.defaults.headers.common["Authorization"] = authHeader;
  }

  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };

  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ScrollToTop />
          <Navbar />
          <Box padding='0rem 5%'>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/user/:userId' element={isAuth ? <ProfilePage /> : <Navigate to='/login' />} />
              <Route path='/user/:userId/edit' element={isAuth ? <EditProfile /> : <Navigate to='/login' />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/products/:productId' element=<ProductDetail /> />

              <Route path='/orders'>
                <Route path=':orderId' element={<OrderDetail />} />
              </Route>
              {isAdmin && (
                <Route path='/manage'>
                  <Route path='orders'>
                    <Route index element=<ManageOrder /> />
                  </Route>

                  <Route path='products'>
                    <Route path='create' element={<ProductCreate />} />
                    {/* /manage/products/edit/64592e83c8f3ac1943abf33c */}
                    <Route path='edit/:productId' element={<EditProduct />} />
                    <Route index element={<ManageProduct />} />
                  </Route>

                  <Route path='users'>
                    <Route path='create' element={<RegisterForm />} />
                    <Route index element={<ManageUser />} />
                  </Route>

                  <Route index element={<ManageDashboad />} />
                </Route>
              )}
              {isAdmin && (
                <Route path='/statistical'>
                  <Route path='products'>
                    <Route path=':productId' element={<StatisticalProduct />}></Route>
                  </Route>
                </Route>
                
              )}
              {isAdmin && (
                <Route path='/dashboard'>
                  <Route index element={<Dashboard />} />
                </Route>
                
              )}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Box>
          <CartMenu />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
