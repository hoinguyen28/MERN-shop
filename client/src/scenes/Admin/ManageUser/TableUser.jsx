import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import userApi from "api/userApi";
import StyledTableCell from "components/StyledTableCell";
import StyledTableRow from "components/StyledTableRow";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const head = [
  {
    numeric: true,
    disablePadding: false,
    lable: "User ID",
    id: "_id",
  },
  {
    numeric: true,
    disablePadding: false,
    lable: "First Name",
    id: "firstName",
  },
  {
    numeric: true,
    disablePadding: false,
    lable: "Last Name",
    id: "lastName",
  },
  {
    numeric: true,
    disablePadding: false,
    lable: "Email",
    id: "email",
  },
  {
    numeric: true,
    disablePadding: false,
    lable: "Role",
    id: "role",
  },
  {
    numeric: true,
    disablePadding: false,
    lable: "CreateAt",
    id: "createdAt",
  },
];

const roles = [
  {
    _id: 1,
    name: "admin",
    label: "Admin",
  },
  {
    _id: 2,
    name: "user",
    label: "User",
  },
];

function TableUsers({ data, btn, submitDelete }) {
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [selectedOne, setSelectedOne] = useState();
  const [actionAllIn, setActionAllIn] = useState(false);

  const user = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";

  const navigate = useNavigate();
  // Bên ngoài hàm TableUsers

  const theme = useTheme();
  const { palette } = useTheme();

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      if (selected.length > 0) {
        return setSelected([]);
      }
      const x = data.filter((n) => {
        return n.role !== "admin";
      });
      const newSelected = x.map((n) => n._id);
      setSelected(newSelected);
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleClickDeleteIcon = (selected) => {
    submitDelete(selected);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setActionAllIn(false);
      setSelectedOne();
    }, 250);
  };

  // Trong hàm TableUsers
  const handleChangeRole = (event, userId) => {
    const role = event.target.value;
    setSelectedRoles((prevSelectedRoles) => ({
      ...prevSelectedRoles,
      role: role,
      userId: userId,
      [userId]: role,
    }));

    userApi
      .updateRole(userId, { userId, role })
      .then((result) => {
        console.log({ result });
      })
      .catch((err) => {});
  };

  return (
    <Box>
      <Box m='0 auto'>
        {submitDelete && (
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              ...(selected.length > 0 && {
                bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              }),
            }}
          >
            {selected.length > 0 ? (
              <Typography sx={{ flex: "1 1 100%" }} color='inherit' variant='subtitle1' component='div'>
                {selected.length} selected
              </Typography>
            ) : (
              <Typography sx={{ flex: "1 1 100%" }} variant='h6' id='tableTitle' component='div'>
                Nutrition
              </Typography>
            )}

            {selected.length > 0 ? (
              <Tooltip title='Delete'>
                <IconButton
                  onClick={() => {
                    setActionAllIn(true);
                    handleClickOpen();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title='Filter list'>
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        )}

        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            {/* Head table */}
            {head && (
              <TableHead>
                <TableRow>
                  {submitDelete && (
                    <StyledTableCell align='left'>
                      <Checkbox
                        color='primary'
                        sx={{
                          backgroundColor: "white",
                        }}
                        indeterminate={selected.length > 0 && selected.length < data.length}
                        checked={selected.length > 0 && selected.length === data.length}
                        onChange={handleSelectAllClick}
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                      />
                    </StyledTableCell>
                  )}
                  {head.map((item) => {
                    return <StyledTableCell key={item.id}>{item.lable}</StyledTableCell>;
                  })}
                  <StyledTableCell align='center' colSpan={2}>
                    Action
                  </StyledTableCell>
                </TableRow>
              </TableHead>
            )}

            {/* Body of table */}
            {data ? (
              <TableBody>
                {data.map((row) => {
                  const isItemSelected = isSelected(row._id);
                  return (
                    <StyledTableRow key={row._id}>
                      {submitDelete && (
                        <StyledTableCell
                          align='left'
                          onClick={(event) => {
                            if (row.role !== "admin") handleClick(event, row._id);
                          }}
                        >
                          <Checkbox
                            color='primary'
                            sx={{
                              backgroundColor: "white",
                            }}
                            checked={isItemSelected}
                            disabled={row.role === "admin"}
                          />
                        </StyledTableCell>
                      )}

                      <StyledTableCell align='left'>
                        <Link to={row?.linkTo}>{row?._id}</Link>
                      </StyledTableCell>
                      <StyledTableCell align='left'>{row?.firstName.length > 50 ? `${row?.firstName.slice(0, 50)}...v.v` : row?.firstName}</StyledTableCell>
                      <StyledTableCell align='left'>{row?.lastName.length > 50 ? `${row?.lastName.slice(0, 50)}...v.v` : row?.lastName}</StyledTableCell>
                      <StyledTableCell align='left'>{row?.email.length > 50 ? `${row?.email.slice(0, 50)}...v.v` : row?.email}</StyledTableCell>
                      {isAdmin ? (
                        <StyledTableCell align='left'>
                          <FormControl sx={{ minWidth: "100px" }} disabled={row.email === process.env.REACT_APP_EMAIL_AMIN}>
                            <InputLabel id='demo-simple-select-helper-label'>Role</InputLabel>
                            <Select
                              labelId='demo-simple-select-helper-label'
                              id='demo-simple-select-helper'
                              // value={row?.role}
                              value={selectedRoles[row?._id] || row?.role}
                              label='Role'
                              name='role'
                              onChange={(event) => handleChangeRole(event, row?._id)}
                            >
                              {roles.map((role) => (
                                <MenuItem key={role._id} value={role.name}>
                                  {role.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell align='left'>{row?.role.length > 50 ? `${row?.role.slice(0, 50)}...v.v` : row?.role}</StyledTableCell>
                      )}

                      <StyledTableCell align='left'>{row.createdAt.slice(0, 10)}</StyledTableCell>
                      <StyledTableCell align='left'>
                        <IconButton
                          aria-label='delete'
                          size='large'
                          disabled={row.role === "admin"}
                          onClick={(e) => {
                            if (row.role !== "admin") {
                              setSelectedOne(row._id);
                              handleClickOpen();
                            }
                          }}
                          sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: palette.background.error,
                            color: "white",
                            "&:hover": { color: palette.background.error },
                          }}
                        >
                          <DeleteIcon fontSize='inherit' />
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        <IconButton
                          onClick={() => {
                            navigate(`/user/${row._id}/edit`);
                          }}
                          size='large'
                          sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: palette.primary.main,
                            color: "white",
                            "&:hover": { color: palette.primary.main },
                          }}
                        >
                          <EditIcon fontSize='inherit' />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            ) : (
              <Box>
                <Box width={"100%"} pt={"15px"} m='15px auto' backgroundColor={theme.palette.background.alt}>
                  <Typography display={"block"} fontWeight='500' variant='h5' textAlign={"center"} sx={{ mb: "1.5rem" }}>
                    Dữ liệu trống
                  </Typography>
                </Box>
              </Box>
            )}
          </Table>
        </TableContainer>
        {btn && (
          <Box width={"100%"} display={"flex"} justifyContent={"end"}>
            <Button
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
              onClick={() => {
                navigate(`${btn.linkTo}`);
              }}
            >
              {btn.title}
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có chắc chắn muốn xóa sản phẩm <strong>{selectedOne}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            aria-label='Hủy'
            onClick={(e) => {
              handleClose();
            }}
            sx={{
              p: "1rem",
            }}
          >
            Hủy
          </Button>
          <Button
            aria-label='delete'
            size='large'
            onClick={() => {
              var x;
              if (actionAllIn) x = selected;
              else {
                x = [selectedOne];
              }

              handleClickDeleteIcon(x);
              handleClose();
            }}
            autoFocus
            sx={{
              p: "1rem",
              backgroundColor: palette.background.error,
              color: "white",
              "&:hover": { color: palette.background.error },
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TableUsers;
