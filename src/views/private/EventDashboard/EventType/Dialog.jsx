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

const AddUpdateDialog = ({ open, onClose, onEdit, onRefresh, row }) => {
  useEffect(() => {}, []);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    color: Yup.string().required("color is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: null,
      name: null,
      color: "fff",
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
      formik.setFieldValue("color", row.color);
    }
  }, [onEdit, row]);

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const handleSave = async (values) => {
    console.log(values);
    try {
      const response = await _axios("post", `/EventType/addEventType`, values);
      if (response.status === 200) {
        toast.success("Event Type added successfully");
        onRefresh();
      }

      onClose();
      formik.resetForm();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const handleUpdate = async (values) => {
    console.log(values);
    try {
      const response = await _axios("put", `/EventType/updateEventType/${values.id}`, values);
      if (response.status === 200) {
        toast.success("Event Type updated successfully");
        onRefresh();
      }

      onClose();
      formik.resetForm();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
          {onEdit ? "Update Event Type" : "Add Event Type"}
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
                <label>Select Color</label>
                <input
                  type="color"
                  {...getFieldProps("color")}
                  error={Boolean(touched.color && errors.color)}
                  helperText={touched.color && errors.color}
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
