import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, useMediaQuery, useTheme } from "@mui/material";
import userApi from "api/userApi";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Aleart from "scenes/global/Aleart";
import * as yup from "yup";

const registerSchema = yup.object().shape({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  email: yup.string().lowercase().trim().email("Invalid email").required("Email is required"),
  password: yup.string().trim().required("Password is required"),
  retypePassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Retype password is required"),
});

export default function RegisterForm({ userId, onSuccess }) {
  const [pageType, setPageType] = useState("add");
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({ firstName: "", lastName: "", email: "", password: "", retypePassword: "" });
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isEdit = pageType === "edit";
  const isAdd = pageType === "add";

  const navigate = useNavigate();

  const add = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(`${process.env.REACT_APP_BASE_URL}auth/register`, {
      method: "POST",
      body: formData,
    });
    const savedUser = await savedUserResponse.json();
    console.log(savedUser);
    onSubmitProps.resetForm();
  };
  const update = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    userApi
      .updateAccount(userId, formData)
      .then((result) => {
        setOpen(true);
        onSubmitProps.resetForm();

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/manage/users");
          }
        }, 1000);
      })
      .catch((err) => {});
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isEdit) {
      return update(values, onSubmitProps);
    }

    if (isAdd) {
      return add(values, onSubmitProps);
    }
  };

  useEffect(() => {
    if (userId) {
      setPageType("edit");
      userApi
        .getUserById(userId)
        .then((result) => {
          setInitialValues((prevValues) => ({
            ...prevValues,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
          }));
        })
        .catch((err) => {});
    } else {
      setPageType("add");
    }
  }, [userId]);

  return (
    <div>
      <h1>{isEdit ? "Chỉnh sửa account" : "Thêm mới sản phẩm"}</h1>
      <Formik initialValues={initialValues} validationSchema={registerSchema} enableReinitialize={true} onSubmit={handleFormSubmit}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
          isSubmitting,
          dirty,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display='grid'
              gap='30px'
              gridTemplateColumns='repeat(4, minmax(0, 1fr))'
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <>
                <TextField
                  label='First Name'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name='firstName'
                  error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label='Last Name'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name='lastName'
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
              </>

              <TextField
                label='Email'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name='email'
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label='Password'
                type='password'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name='password'
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label='Retype Password'
                type='password'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.retypePassword}
                name='retypePassword'
                error={Boolean(touched.retypePassword) && Boolean(errors.retypePassword)}
                helperText={touched.retypePassword && errors.retypePassword}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                disabled={!dirty}
                type='submit'
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {!isSubmitting && (isAdd ? "REGISTER" : "Save")}
                {isSubmitting && "Submitting..."}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      {isEdit ? (
        <Aleart open={open} setOpen={setOpen} title={"Success"} messsage={"Chỉnh sửa account thành công"} />
      ) : (
        <Aleart open={open} setOpen={setOpen} title={"Success"} messsage={"Thêm account thành công"} />
      )}
    </div>
  );
}
