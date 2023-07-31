import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import _axios from "../../../../components/Axios";
import CloseButton from "../../../../components/CloseButton";
import SubmitButton from "../../../../components/SubmitButton";
import Tooltip from "@mui/material/Tooltip";

const AddUpdateDialog = ({ open, onClose, onEdit, onRefresh, row }) => {
  useEffect(() => {}, []);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    city: Yup.string().notRequired(),
    address: Yup.string().notRequired(),
    latitude: Yup.string().required(),
    longitude: Yup.string().required(),
    refillThreshold: Yup.number().required(),
  });

  const formik = useFormik({
    initialValues: {
      id: null,
      name: null,
      city: null,
      address: null,
      latitude: null,
      longitude: null,
      inventoryType: null,
      inventoryQuantity: null,
      refillThreshold: 10,
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
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    console.log(row, onEdit);
    if (row && onEdit) {
      formik.setFieldValue("id", row.id);
      formik.setFieldValue("name", row.name);
      formik.setFieldValue("city", row.city);
      formik.setFieldValue("address", row.address);
      formik.setFieldValue("latitude", row.latitude);
      formik.setFieldValue("longitude", row.longitude);
      formik.setFieldValue("refillThreshold", row.refillThreshold);
    }
  }, [onEdit, row]);

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const handleSave = async (values) => {
    console.log(values);
    try {
      const response = await _axios("post", `/Warehouse/addWarehouse`, values);
      if (response.status === 200) {
        toast.success("Warehouse added successfully");
        onRefresh();
      }

      onClose();
      formik.resetForm();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const handleUpdate = async (values) => {
    console.log(values);
    try {
      const response = await _axios("put", `/Warehouse/updateWarehouse/${values.id}`, values);
      if (response.status === 200) {
        toast.success("Warehouse updated successfully");
        onRefresh();
      }

      onClose();
      formik.resetForm();
    } catch (error) {
      console.log(error);
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
        <DialogTitle
          sx={{
            fontWeight: "bold",
          }}
        >
          {onEdit ? "Update Warehouse" : "Add Warehouse"}
        </DialogTitle>
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
                  fullWidth
                  label="City"
                  {...getFieldProps("city")}
                  error={Boolean(touched.city && errors.city)}
                  helperText={touched.city && errors.city}
                />
                <TextField
                  fullWidth
                  label="Address"
                  {...getFieldProps("address")}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                />
                <Tooltip title="The least limit after which restocking of inventory is required">
                  <TextField
                    fullWidth
                    label="Refill Threshold"
                    {...getFieldProps("refillThreshold")}
                    error={Boolean(touched.refillThreshold && errors.refillThreshold)}
                    helperText={touched.refillThreshold && errors.refillThreshold}
                    InputProps={{
                      inputProps: {
                        type: "number",
                        min: 0,
                      },
                    }}
                  />
                </Tooltip>
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
