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
import Autocomplete from "@mui/material/Autocomplete";

const AddUpdateDialog = ({ open, onClose, onEdit, onRefresh, row, menus, menuPositions }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("required"),
    url: Yup.string().required("required"),
  });

  useEffect(() => {
    console.log(row, onEdit);
    if (row && onEdit) {
      formik.setFieldValue("id", row.id);
      formik.setFieldValue("name", row.name);
      formik.setFieldValue("url", row.url);
      formik.setFieldValue("icon", row.icon);
      formik.setFieldValue("order", row.order);
      formik.setFieldValue("parentId", row.parent);
      formik.setFieldValue("menuPositionId", row.menuPosition);
    }
  }, [onEdit, row]);

  const formik = useFormik({
    initialValues: {
      id: null,
      name: null,
      url: null,
      icon: null,
      order: null,
      parentId: null,
      menuPositionId: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      console.log(values);
      const payload = {
        ...values,
        parentId: values.parentId?.id,
        menuPositionId: values.menuPositionId?.id,
      };
      if (onEdit) {
        handleUpdate(payload);
      } else {
        handleSave(payload);
      }
    },
  });

  const handleSave = async (values) => {
    try {
      const response = await _axios("post", `/Menu/createMenu`, values);
      if (response.status === 200) {
        toast.success("Menu Added Successfully");
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
      const response = await _axios("put", `/Menu/updateMenu/${values.id}`, values);
      if (response.status === 200) {
        toast.success("Menu Updated Successfully");
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
        <DialogTitle>{onEdit ? "Update Menu" : "Add Menu"}</DialogTitle>
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
                  label="URL"
                  {...getFieldProps("url")}
                  error={Boolean(touched.url && errors.url)}
                  helperText={touched.url && errors.url}
                />
                <TextField
                  fullWidth
                  label="Icon (Optional)"
                  {...getFieldProps("icon")}
                  error={Boolean(touched.icon && errors.icon)}
                  helperText={touched.icon && errors.icon}
                />
                <TextField
                  fullWidth
                  label="Order (optional)"
                  {...getFieldProps("order")}
                  error={Boolean(touched.order && errors.order)}
                  helperText={touched.order && errors.order}
                />
                <Autocomplete
                  options={menus}
                  getOptionLabel={(option) => option.name}
                  value={formik.values.parentId}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("parentId", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Parent (Optional)" />}
                />
                <Autocomplete
                  options={menuPositions}
                  getOptionLabel={(option) => option.name}
                  value={formik.values.menuPositionId}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    formik.setFieldValue("menuPositionId", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Position (Optional)" />}
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
              console.log(formik.values);
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
  menus: PropTypes.array,
  menuPositions: PropTypes.array,
};

export default AddUpdateDialog;
