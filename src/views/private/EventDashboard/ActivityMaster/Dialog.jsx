import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SubmitButton from "../../../../components/SubmitButton";
import CloseButton from "../../../../components/CloseButton";
import { useEffect } from "react";
import _axios from "../../../../components/Axios";
import { toast } from "react-toastify";

const AddUpdateDialog = ({ open, onClose, onEdit, onRefresh, row }) => {
  const [activityMasterTypes, setActivityMasterTypes] = React.useState([]);

  useEffect(() => {
    console.log(row, onEdit);
    if (row && onEdit) {
      formik.setFieldValue("id", row.id);
      formik.setFieldValue("name", row.name);
      formik.setFieldValue("type", row.type);
    }
  }, [onEdit, row, activityMasterTypes]);

  useEffect(() => {
    getActivityMasterTypes();
  }, []);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    type: Yup.string().required("type is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: null,
      name: null,
      type: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      addUpdateActivity(values);
    },
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const addUpdateActivity = async (values) => {
    try {
      const response = await _axios("post", "/ActivityMaster/createUpdateMasterActivity", values);
      if (response.status === 200) {
        toast.success(response.data.message);
        onRefresh();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getActivityMasterTypes = async () => {
    try {
      const response = await _axios("get", "/ActivityMasterType/getActivityMasterTypeList");
      if (response.status === 200) {
        console.log(response.data.data);
        setActivityMasterTypes(response.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
        hideBackdrop
      >
        <DialogTitle>{onEdit ? "Update Activity Master" : "Add Activity Master"}</DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack
                spacing={1}
                sx={{
                  padding: "1rem",
                }}
              >
                <TextField
                  fullWidth
                  label="Name"
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    {...getFieldProps("type")}
                    error={Boolean(touched.type && errors.type)}
                    helperText={touched.type && errors.type}
                    InputLabelProps={{
                      shrink: onEdit ? true : false,
                    }}
                  >
                    {activityMasterTypes.map((item) => (
                      <MenuItem value={item.id}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.touched.type && formik.errors.type ? (
                  <FormHelperText sx={{ color: "#bf3333" }}>
                    {formik.touched.type && formik.errors.type}
                  </FormHelperText>
                ) : null}
              </Stack>
            </Form>
          </FormikProvider>
        </DialogContent>
        <DialogActions>
          <CloseButton onClick={handleClose}>Cancel</CloseButton>
          <SubmitButton
            onClick={() => {
              console.log("clicked");
              handleSubmit();
            }}
          >
            {onEdit ? "Update" : "Add"}
            {isSubmitting && "ing..."}
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};
AddUpdateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onEdit: PropTypes.bool,
  onRefresh: PropTypes.func,
  row: PropTypes.object,
};

export default AddUpdateDialog;
