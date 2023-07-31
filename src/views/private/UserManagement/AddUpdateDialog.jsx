import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Form, FormikProvider, useFormik } from "formik";
import { useEffect } from "preact/hooks";
import * as React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import _axios from "../../../components/Axios";
import Checkbox from "@mui/material/Checkbox";

export const AddUpdateDialog = ({ onEdit, onDelete, row, onDialogClose, getUsers }) => {
  const [open, setOpen] = React.useState(false);
  const [departments, setDepartments] = React.useState([]);
  useEffect(() => {
    getDepartments();
  }, []);
  useEffect(() => {
    if (row) {
      formik.setFieldValue("id", row.id);
      formik.setFieldValue("name", row.name);
      formik.setFieldValue("email", row.email);
      formik.setFieldValue("password", null);
      formik.setFieldValue("isAdmin", row.isAdmin);
      formik.setFieldValue("department", row.departmentId);
      //disable password validation
    }
    if (onEdit) {
      setOpen(true);
      validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").nullable().required("Email is required"),
        password: Yup.string().when([], {
          is: null,
          then: Yup.string().required("Password is required"),
          otherwise: Yup.string().notRequired(),
        }),
        isAdmin: Yup.boolean(),
        department: Yup.string().required("Department is required"),
      });
    } else {
    }
  }, [onEdit, onDelete]);

  let validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").nullable().required("Email is required"),
    password: Yup.string().nullable(),
    isAdmin: Yup.boolean(),
    department: Yup.string().required("Department is required"),
  });
  const formik = useFormik({
    initialValues: {
      id: null,
      name: null,
      email: null,
      password: null,
      isAdmin: false,
      department: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      try {
        if (onEdit) {
          handleUpdate(values);
        } else {
          handleSave(values);
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    },
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onDialogClose();
    formik.resetForm();
  };
  const handleSave = async (values) => {
    try {
      const response = await _axios("post", "UserManagement/createUser", {
        ...values,
      });

      if (response.status === 200) {
        toast.success("User Created Successfully", {
          autoClose: 2000,
        });
        handleClose();

        getUsers();
        onDialogClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const handleUpdate = async (values) => {
    try {
      const response = await _axios("put", `UserManagement/updateUser/${values.id}`, {
        ...values,
      });

      if (response.status === 200) {
        toast.success("User Updated Successfully", {
          autoClose: 2000,
        });
        handleClose();
        onDialogClose();
        getUsers();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const getDepartments = async () => {
    try {
      const response = await _axios("get", "/Department/getDepartments");
      if (response.status == 200) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      setDepartments([]);
      toast.error(error.message?.data?.message);
    }
  };
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <button
        className="px-5 py-3 bg-gray-200 rounded-lg text-black text-sm mb-2 hover:bg-gray-200 transition-colors hover:border-gray-300"
        onClick={handleClickOpen}
      >
        Add User
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          <h2 className="font-bold">{onEdit ? "Edit User" : "Add User"}</h2>
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ my: 2 }}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  type="text"
                  label="Name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                <TextField
                  fullWidth
                  autoComplete="off"
                  type="email"
                  label="Email"
                  {...getFieldProps("email")}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  autoComplete="off"
                  type="password"
                  label="Password"
                  {...getFieldProps("password")}
                  error={Boolean(touched.password && errors.password && !onEdit)}
                  helperText={touched.password && errors.password && !onEdit}
                />
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-helper-label">Department</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="Department"
                    {...getFieldProps("department")}
                    error={Boolean(touched.department && errors.department)}
                    helperText={touched.department && errors.department}
                  >
                    {departments.map((item) => (
                      <MenuItem value={item.id}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    {...getFieldProps("isAdmin")}
                    checked={values.isAdmin}
                  />
                  <label for="isAdmin" name="isAdmin">
                    IsAdmin
                  </label>
                </div>
              </Stack>
            </Form>
          </FormikProvider>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={handleClose}
          >
            Close
          </button>

          <button
            type="button"
            className="flex   text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2   focus:outline-none  "
            onClick={() => handleSubmit()}
          >
            {onEdit ? "Update" : "Add"}
            {isSubmitting && <p>ing..</p>}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};
