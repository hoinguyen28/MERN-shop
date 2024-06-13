import { Box, Typography,Paper  } from "@mui/material";
import orderApi from "api/orderApi";
import MyLineChart from "components/MyLineChart";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productApi from "api/productApi";
// import productApi from '../'
import TableProduct from "scenes/Admin/ManageProduct/TableProduct";
import ManageDashboad from "scenes/Admin";
import TopSellingProducts from "./TopSellingProducts";
import OrderStatistics  from "./OrderStatistics";


function StatisticalProduct() {
    const [data, setData] = useState([]);
    const [product, setProduct] = useState([]);
    const { productId } = useParams();

    useEffect(() => {
        orderApi
            .thongkeOrder()
            .then((result) => {
                const formattedResult = [];

                for (let i = 1; i <= 12; i++) {
                    const monthName = `Tháng ${i}`;
                    const sales = result[monthName];

                    formattedResult.push({ name: monthName, pr: sales });
                }
                console.log(formattedResult)
                setData(formattedResult);
            })
            .catch((err) => { });
    }, [productId]);

    useEffect(() => {
        productApi
            .getProductById(productId)
            .then((result) => {
                setProduct([{ ...result }]);

                setProduct((data) => {
                    return data.map((item) => {
                        item.linkTo = `/products/${item._id}`;
                        // item.linkTo = `/products/${item._id}`;
                        return item;
                    });
                });
            })
            .catch((err) => { });
    }, [productId]);

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant='h3' textAlign='center' sx={{ mb: 4, color: '#333' }}>
                Dashboard
            </Typography>

            {/* Container for all components */}
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                {/* Top Selling Products and Order Statistics on the same row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Box sx={{ flex: 1, backgroundColor: '#e0f7fa', borderRadius: '8px', p: 2, mr: 2 }}>
                        <TopSellingProducts />
                    </Box>
                    <Box sx={{ flex: 1, backgroundColor: '#ffebee', borderRadius: '8px', p: 2, ml: 2 }}>
                        <OrderStatistics />
                    </Box>
                </Box>

                {/* Two charts side by side */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                    <Paper elevation={3} sx={{ flex: 1, p: 3, bgcolor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  
                        <ManageDashboad />
                    </Paper>

                    <Box sx={{ flex: 1 }}>
                    <Typography variant='h3' textAlign='left' sx={{ m: "50px 0" }}>
        <b>Thống kê đơn hàng theo tháng</b>
      </Typography>
                        
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <MyLineChart data={data} />
      </Box>
                    </Box>
                    
                </Box>
            </Paper>
        </Box>
    );
}

export default StatisticalProduct;
