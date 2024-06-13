import { Typography } from "@mui/material";
import productApi from "api/productApi";
import userApi from "api/userApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeManyFromCart, setItems } from "state";
import TableUsers from "./TableUser";

const btn = {
  title: "Thêm người dùng mới",
  linkTo: "/manage/users/create",
};
function ManageUser() {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    userApi
      .getAllUser()
      .then((result) => {
        setData(result.data);
        setData((data) => {
          return data.map((item) => {
            item.linkTo = `/user/${item._id}`;
            return item;
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const submitDelete = async (selected) => {
    const formData = {
      selected: selected,
    };
    userApi
      .deleteUsers(formData)
      .then((result) => {
        const newData = data.filter((item) => {
          return !selected.includes(item._id);
        });
        setData(newData);
        dispatch(setItems(newData));
        dispatch(removeManyFromCart(selected));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Typography variant='h3' textAlign='left' sx={{ mb: "15px" }}>
        <b>User Management</b>
      </Typography>
      <TableUsers data={data} btn={btn} submitDelete={submitDelete} />
    </div>
  );
}

export default ManageUser;
