import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import _axios from "../../../../components/Axios";
import CloseButton from "../../../../components/CloseButton";
import SubmitButton from "../../../../components/SubmitButton";

const AddUpdateDialog = ({ open, onClose, onEdit, onRefresh, row }) => {
  const [alertTypes, setAlertTypes] = React.useState([]);
  const [alertSeverities, setAlertSeverities] = React.useState([]);
  useEffect(() => {
    getAlertTypes();
    getAlertSeverities();
  }, []);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    type: Yup.string().required("type is required"),
    severity: Yup.string().required("severity is required"),
    latitude: Yup.string().required("latitude is required"),
    longitude: Yup.string().required("longitude is required"),
    description: Yup.string().notRequired(),
  });

  useEffect(() => {
    console.log(row, onEdit);
    if (row && onEdit) {
      formik.setFieldValue("id", row.id);
      formik.setFieldValue("name", row.name);
      formik.setFieldValue("type", row.type);
      formik.setFieldValue("severity", row.severity);
      formik.setFieldValue("latitude", row.latitude);
      formik.setFieldValue("longitude", row.longitude);
      formik.setFieldValue("description", row.description);
    }
  }, [onEdit, row]);

  const formik = useFormik({
    initialValues: {
      id: null,
      name: null,
      type: null,
      severity: null,
      latitude: null,
      longitude: null,
      description: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      if (onEdit) {
        handleUpdate(values);
      } else {
        handleSave(values);
      }
    },
  });

  const handleSave = async (values) => {
    try {
      const response = await _axios("post", `/Alert/createAlert`, values);
      if (response.status === 200) {
        toast.success("Alert Added Successfully");
        onRefresh();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const handleUpdate = async (values) => {
    try {
      const response = await _axios("put", `/Alert/updateAlert/${values.id}`, values);
      if (response.status === 200) {
        toast.success("Alert Updated Successfully");
        onRefresh();
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };
  const getAlertTypes = async () => {
    try {
      const response = await _axios("get", `/AlertType/getAlertTypes`);
      if (response.status === 200) {
        setAlertTypes(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAlertSeverities = async () => {
    try {
      const response = await _axios("get", `/AlertSeverity/getAlertSeverityList`, null);
      if (response.status === 200) {
        setAlertSeverities(response.data.data);
      }
    } catch (error) {
      console.log(error);
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
        <DialogTitle>{onEdit ? "Update Alert" : "Create Alert"}</DialogTitle>
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
                <TextField
                  id="type"
                  select
                  label="Type"
                  key="type"
                  value={formik.values.type}
                  placeholder="Select Type"
                  onChange={(event) => {
                    formik.setFieldValue("type", event.target.value);
                  }}
                  InputLabelProps={{
                    shrink: formik.values.type,
                  }}
                  fullWidth
                >
                  {alertTypes.map((option) => (
                    <MenuItem key={option.name} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  id="severity"
                  select
                  label="Severity"
                  key="severity"
                  placeholder="Select Severity"
                  value={formik.values.severity}
                  onChange={(event) => {
                    formik.setFieldValue("severity", event.target.value);
                  }}
                  InputLabelProps={{
                    shrink: formik.values.severity,
                  }}
                  fullWidth
                >
                  {alertSeverities.map((option) => (
                    <MenuItem key={option.name} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Latitude"
                  {...getFieldProps("latitude")}
                  error={Boolean(touched.latitude && errors.latitude)}
                  helperText={touched.latitude && errors.latitude}
                />
                <TextField
                  fullWidth
                  label="Longitude"
                  {...getFieldProps("longitude")}
                  error={Boolean(touched.longitude && errors.longitude)}
                  helperText={touched.longitude && errors.longitude}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  placeholder="Optional"
                  {...getFieldProps("description")}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
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
