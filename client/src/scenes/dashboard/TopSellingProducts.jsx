import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

const TopSellingProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/product/top");
        setTopProducts(response.data);
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      }
    };

    fetchTopProducts();
  }, []);
  
  return (
    <Box sx={{
      width: "100%",
      backgroundColor: "#f5f5f5",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
    }}>
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center' }}>
        Top Selling Products
      </Typography>
      <Box sx={{
        display: "flex",
        justifyContent: "space-around",
        gap: "20px",
        flexWrap: "wrap",
      }}>
        {topProducts.slice(0, 3).map((product, index) => (
          <Box key={index} sx={{
            backgroundColor: "#ffffff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "calc(33.33% - 20px)",
            marginBottom: "20px",
            flex: "0 0 auto",
            boxSizing: "border-box",
          }}>
            <div style={{
              width: '100%',
              height: '150px', // Đặt chiều cao tối đa cho hình ảnh
              overflow: 'hidden', // Ẩn bớt phần dư thừa của hình ảnh
              borderRadius: '8px', // Đường viền cong cho hình ảnh
            }}>
              <img
                alt={product.product.name}
                src={`http://localhost:4000/assets/${product.product.images[0]}`}
                style={{
                  width: "100%", // Đảm bảo hình ảnh vừa khít với kích thước của div
                  height: "100%", // Chiều cao của hình ảnh tối đa là 150px
                  objectFit: "contain", // Đảm bảo giữ nguyên tỷ lệ của hình ảnh
                }}
              />
            </div>
            <Box sx={{ textAlign: 'center', width: '100%', backgroundColor: '#ffffff', p: 2, borderRadius: '0 0 8px 8px' }}>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                {product.product.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sold: {product.totalSales}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
  
  
  
  
};

export default TopSellingProducts;
