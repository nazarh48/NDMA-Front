import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { toast } from "react-toastify";
import _axios from "../../../components/Axios";
import PropTypes from "prop-types"; // ES6
import { useEffect } from "preact/hooks";

const AddUpdateDialog = ({ onEdit, onDelete, row, onDialogClose, getData }) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (row) {
      formik.setFieldValue("id", row.id);
      formik.setFieldValue("name", row.name);
    }
    if (onEdit) {
      setOpen(true);
    }
  }, [onEdit, onDelete]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onDialogClose();
    formik.resetForm();
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Department name is required"),
  });
  const formik = useFormik({
    initialValues: {
      id: null,
      name: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      try {
        if (onEdit) {
          updateDepartment(values);
        } else {
          addDepartment(values);
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    },
  });

  const addDepartment = async (values) => {
    try {
      const res = await _axios("post", "/Department/addDepartment", values);
      toast.success(res.data.message);
      getData();
      handleClose();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  const updateDepartment = async (values) => {
    try {
      const res = await _axios("put", "/Department/updateDepartment/" + row.id, values);
      toast.success(res.data.message);
      getData();
      handleClose();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <div>
      <button
        className="px-5 py-3 bg-gray-200 rounded-lg text-black text-sm mb-2 hover:bg-gray-300 transition-colors hover:border-gray-300"
        onClick={handleClickOpen}
      >
        Add Department
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
          <h2 className="font-bold">{onEdit ? "Edit Department" : "Add Department"}</h2>
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ my: 2 }}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  type="text"
                  label="Department Name"
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
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
    </div>
  );
};

const myPropTypes = {
  onEdit: PropTypes.bool,
  onDelete: PropTypes.bool,
  row: PropTypes.object,
  onDialogClose: PropTypes.func,
  getData: PropTypes.func,
};

AddUpdateDialog.propTypes = myPropTypes;

export default AddUpdateDialog;
