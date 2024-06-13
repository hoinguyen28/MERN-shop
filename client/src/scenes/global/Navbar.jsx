import { Close, DarkMode, LightMode, Menu, Search, ShoppingBagOutlined } from "@mui/icons-material";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import LoginIcon from "@mui/icons-material/Login";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import { Badge, Box, FormControl, IconButton, InputBase, MenuItem, Select, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsCartOpen, setLogout, setMode } from "state";
import SearchBar from "./SearchBar";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user?.firstName} ${user?.lastName}`;
  // const fullName = 'user';

  return (
    <FlexBetween padding='1rem 5%' backgroundColor={alt}>
      <FlexBetween gap='1.75rem'>
        <Typography
          fontWeight='bold'
          fontSize='clamp(1rem, 2rem, 2.25rem)'
          color='primary'
          onClick={() => navigate("/")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Shop Quan Ao
        </Typography>
        {isNonMobileScreens && (
          <Box>
            <SearchBar />
            {/* <SearchList valuesSearch={valuesSearch} open={open} /> */}
          </Box>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        user ? (
          <FlexBetween gap={"20px"}>
            <FlexBetween gap={"20px"}>
              <Tooltip title={theme.palette.mode === "dark" ? "Dart mode" : "Light Mode"}>
                <IconButton onClick={() => dispatch(setMode())}>
                  {theme.palette.mode === "dark" ? <DarkMode sx={{ fontSize: "25px" }} /> : <LightMode sx={{ color: dark, fontSize: "25px" }} />}
                </IconButton>
              </Tooltip>
              <Tooltip title={"Giỏ hàng"}>
                <IconButton onClick={() => dispatch(setIsCartOpen({}))}>
                  <Badge badgeContent={cart.length} invisible={cart.length === 0} sx={{ fontSize: "25px" }}>
                    <ShoppingBagOutlined />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title={"Trang cá nhân"}>
                <IconButton onClick={() => navigate(`/user/${user._id}`)}>
                  <PersonIcon />
                </IconButton>
              </Tooltip>

              {user?.role === "admin" && (
                <FlexBetween gap={"20px"}>
                  <Tooltip title={"Manage Order"}>
                    <IconButton onClick={() => navigate("/manage/orders")}>
                      <CardMembershipIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={"Dashboard "}>
                    <IconButton onClick={() => navigate("/dashboard")}>
                      <CardMembershipIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Manage Products"}>
                    <IconButton onClick={() => navigate("/manage/products")}>
                      <PrecisionManufacturingIcon />
                    </IconButton>
                  </Tooltip>{" "}
                  <Tooltip title={"Manage Users"}>
                    <IconButton onClick={() => navigate("/manage/users")}>
                      <GroupIcon />
                    </IconButton>
                  </Tooltip>
                </FlexBetween>
              )}
            </FlexBetween>
            <FormControl variant='standard' value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <FlexBetween gap='2rem'>
            <IconButton onClick={() => dispatch(setMode())}>{theme.palette.mode === "dark" ? <DarkMode sx={{ fontSize: "25px" }} /> : <LightMode sx={{ color: dark, fontSize: "25px" }} />}</IconButton>
            <FormControl variant='standard' value={fullName}>
              <MenuItem onClick={() => navigate("/login")}>
                Log In <LoginIcon sx={{ fontSize: "25px", ml: "4px" }} />
              </MenuItem>
            </FormControl>
          </FlexBetween>
        )
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box position='fixed' right='0' bottom='0' height='100%' zIndex='10' maxWidth='500px' minWidth='300px' backgroundColor={background}>
          {/* CLOSE ICON */}
          <MenuItem onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)} sx={{ display: "flex", justifyContent: "flex-end", p: "1rem" }}>
            <Close />
          </MenuItem>

          {/* MENU ITEMS */}
          <FlexBetween width={"100%"} flexDirection='column' alignItems='center' gap={"20px"}>
            {user ? (
              <FlexBetween display='flex' width={"100%"} flexDirection='column' alignItems='center' justifyContent={"center"} gap={"20px"}>
                <FormControl variant='standard' value={fullName}>
                  <Select
                    value={fullName}
                    sx={{
                      backgroundColor: neutralLight,
                      width: "150px",
                      borderRadius: "0.25rem",
                      p: "0.25rem 1rem",
                      "& .MuiSvgIcon-root": {
                        pr: "0.25rem",
                        width: "3rem",
                      },
                      "& .MuiSelect-select:focus": {
                        backgroundColor: neutralLight,
                      },
                    }}
                    input={<InputBase />}
                  >
                    <MenuItem value={fullName}>
                      <Typography>{fullName}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                  </Select>
                </FormControl>
                <MenuItem
                  onClick={() => {
                    setIsMobileMenuToggled(!isMobileMenuToggled);
                    dispatch(setIsCartOpen({}));
                  }}
                  sx={{ width: "100%", display: "flex", justifyContent: "start" }}
                >
                  <Badge badgeContent={cart.length} invisible={cart.length === 0}>
                    <ShoppingBagOutlined sx={{ fontSize: "25px" }} />
                  </Badge>
                  <Typography sx={{ ml: "14px" }}>Badge</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setIsMobileMenuToggled(!isMobileMenuToggled);
                    navigate(`/user/${user._id}`);
                  }}
                  sx={{ width: "100%", display: "flex", justifyContent: "start" }}
                >
                  <PersonIcon sx={{ fontSize: "25px" }} />
                  <Typography sx={{ ml: "14px" }}>Profile</Typography>
                </MenuItem>

                {user?.role === "admin" && (
                  <Box width={"100%"} display='flex' flexDirection='column' alignItems='center' justifyContent={"start"} gap={"20px"}>
                    <MenuItem
                      onClick={() => {
                        setIsMobileMenuToggled(!isMobileMenuToggled);
                        navigate("/manage/orders");
                      }}
                      sx={{ width: "100%", display: "flex", justifyContent: "start" }}
                    >
                      <CardMembershipIcon sx={{ fontSize: "25px" }} />
                      <Typography sx={{ ml: "14px" }}>Manage Order</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setIsMobileMenuToggled(!isMobileMenuToggled);
                        navigate("/manage/products");
                      }}
                      sx={{ width: "100%", display: "flex", justifyContent: "start" }}
                    >
                      <PrecisionManufacturingIcon sx={{ fontSize: "25px" }} />
                      <Typography sx={{ ml: "14px" }}>Manage Product</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setIsMobileMenuToggled(!isMobileMenuToggled);
                        navigate("/manage/users");
                      }}
                      sx={{ width: "100%", display: "flex", justifyContent: "start" }}
                    >
                      <GroupIcon sx={{ fontSize: "25px" }} />
                      <Typography sx={{ ml: "14px" }}>Manage Users</Typography>
                    </MenuItem>
                  </Box>
                )}
              </FlexBetween>
            ) : (
              <MenuItem
                onClick={() => {
                  navigate("/login");
                  setTimeout(() => {
                    setIsMobileMenuToggled(!isMobileMenuToggled);
                  }, 150);
                }}
                sx={{ width: "100%", display: "flex", justifyContent: "start" }}
              >
                <LoginIcon sx={{ color: dark, fontSize: "25px" }} />
                <Typography sx={{ ml: "14px" }}>Log In</Typography>
              </MenuItem>
            )}

            <MenuItem onClick={() => dispatch(setMode())} sx={{ width: "100%", display: "flex", justifyContent: "start" }}>
              {theme.palette.mode === "dark" ? <DarkMode sx={{ fontSize: "25px" }} /> : <LightMode sx={{ color: dark, fontSize: "25px" }} />}
              <Typography sx={{ ml: "14px" }}> {theme.palette.mode === "dark" ? "Dart Mode" : "Light Mode"}</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/search");
                setIsMobileMenuToggled(!isMobileMenuToggled);
              }}
              sx={{ width: "100%", display: "flex", justifyContent: "start" }}
            >
              <Search />
              <Typography sx={{ ml: "14px" }}>Search</Typography>
            </MenuItem>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
