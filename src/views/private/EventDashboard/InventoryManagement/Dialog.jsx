import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { ErrorMessage, FieldArray, Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import _axios from "../../../../components/Axios";
import CloseButton from "../../../../components/CloseButton";
import SubmitButton from "../../../../components/SubmitButton";

const AddUpdateDialog = ({ open, onClose, onEdit, onRefresh, row }) => {
  const [warehouses, setWarehouses] = React.useState([]);
  const [UOMs, setUOMs] = React.useState([]);
  useEffect(() => {
    getWarehouses();
    getUOMs();
  }, []);
  const validationSchema = Yup.object().shape({
    warehouseId: Yup.string().required(" required"),
    inventory: Yup.array().of(
      Yup.object().shape({
        inventoryType: Yup.string().required(" required"),
        inventoryQuantity: Yup.number().required(" required"),
        weightPerItem: Yup.number().required("required"),
        unit: Yup.string().required(" required"),
      }),
    ),
  });

  const formik = useFormik({
    initialValues: {
      id: null,
      warehouseId: null,
      inventory: [
        {
          inventoryType: null,
          inventoryQuantity: null,
          weightPerItem: null,
          unit: null,
        },
      ],
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
      formik.setFieldValue("warehouseId", row.warehouseId);
      formik.setFieldValue("inventory", row.inventory);
      formik.setFieldValue("weightPerItem", row.weightPerItem);
    }
  }, [onEdit, row]);

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const handleSave = async (values) => {
    console.log(values);
    try {
      if (values.inventory.length === 0) {
        toast.error("Please add atleast one inventory");
        return;
      }
      const response = await _axios("post", `/Inventory/addInventory`, values);
      if (response.status === 200) {
        toast.success("Inventory added successfully");
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
      if (values.inventory.length === 0) {
        toast.error("Please add atleast one inventory");
        return;
      }
      const response = await _axios(
        "put",
        `/Inventory/updateInventory/${values.warehouseId}`,
        values,
      );
      if (response.status === 200) {
        toast.success("Inventory updated successfully");
        onRefresh();
      }

      onClose();
      formik.resetForm();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const getWarehouses = async () => {
    try {
      const response = await _axios("get", `/Warehouse/getWarehouses`);
      if (response.status === 200) {
        setWarehouses(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const getUOMs = async () => {
    try {
      const response = await _axios("get", `/Common/getUOMs`);
      if (response.status === 200) {
        setUOMs(response.data.data);
      }
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
        maxWidth="md"
        fullWidth
        hideBackdrop
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
          }}
        >
          {onEdit ? "Update Inventory" : "Add Inventory"}
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
                  id="type"
                  select
                  label="Warehouse"
                  key="type"
                  value={formik.values.warehouseId}
                  placeholder="Select Warehouse"
                  onChange={(event) => {
                    formik.setFieldValue("warehouseId", event.target.value);
                  }}
                  InputLabelProps={{
                    shrink: formik.values.warehouseId ? true : false,
                  }}
                  fullWidth
                >
                  {warehouses.map((option) => (
                    <MenuItem key={option.name} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                <FieldArray name="inventory">
                  {({ remove, push }) => (
                    <div>
                      {formik.values.inventory.map((p, index) => {
                        return (
                          <Box
                            key={index}
                            sx={{
                              marginTop: "10px",
                            }}
                          >
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={3} md={3}>
                                <TextField
                                  fullWidth
                                  label="Inventory Type"
                                  name={`inventory.[${index}].inventoryType`}
                                  {...getFieldProps(`inventory[${index}].inventoryType`)}
                                  InputLabelProps={{
                                    shrink: p.inventoryType ? true : false,
                                  }}
                                />
                                <ErrorMessage
                                  name={`inventory.${index}.inventoryType`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </Grid>
                              <Grid item xs={3} md={3}>
                                <TextField
                                  fullWidth
                                  label="Inventory Quantity"
                                  name={`inventory[${index}].inventoryQuantity`}
                                  {...getFieldProps(`inventory[${index}].inventoryQuantity`)}
                                  InputLabelProps={{
                                    shrink: p.inventoryQuantity ? true : false,
                                  }}
                                  onInput={(e) => {
                                    const target = e.target;
                                    target.value = e.target.value.replace(/[^0-9]/g, "");
                                  }}
                                  InputProps={{
                                    inputProps: {
                                      type: "number",
                                      min: 1,
                                    },
                                  }}
                                />
                                <ErrorMessage
                                  name={`inventory.${index}.inventoryQuantity`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </Grid>
                              <Grid item xs={2} md={2}>
                                <TextField
                                  fullWidth
                                  label="Unit"
                                  name={`inventory[${index}].unit`}
                                  {...getFieldProps(`inventory[${index}].unit`)}
                                  InputLabelProps={{
                                    shrink: p.unit ? true : false,
                                  }}
                                  select
                                >
                                  {UOMs.map((option) => (
                                    <MenuItem key={option.name} value={option.unit}>
                                      {option.name}
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <ErrorMessage
                                  name={`inventory.${index}.unit`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </Grid>
                              <Grid item xs={2} md={2}>
                                <TextField
                                  fullWidth
                                  label="Weight Per Item"
                                  name={`inventory[${index}].weightPerItem`}
                                  {...getFieldProps(`inventory[${index}].weightPerItem`)}
                                  InputLabelProps={{
                                    shrink: p.weightPerItem ? true : false,
                                  }}
                                  onInput={(e) => {
                                    const target = e.target;
                                    target.value = e.target.value.replace(/[^0-9]/g, "");
                                  }}
                                  InputProps={{
                                    inputProps: {
                                      type: "number",
                                      min: 1,
                                    },
                                  }}
                                />
                                <ErrorMessage
                                  name={`inventory.${index}.weightPerItem`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </Grid>
                              <Grid item xs={2} md={2}>
                                <i
                                  className="fa-solid fa-trash text-red-500 cursor-pointer"
                                  onClick={() => remove(index)}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        );
                      })}

                      <button
                        className="rounded-lg px-4 py-2 bg-gray-200 text-sm text-black mt-2 "
                        type="button"
                        onClick={() =>
                          push({
                            inventoryType: null,
                            inventoryQuantity: null,
                            weightPerItem: null,
                            unit: null,
                          })
                        }
                      >
                        Add
                        <span className="ml-2">
                          <i className="fa-solid fa-plus text-gray-800" />
                        </span>
                      </button>
                    </div>
                  )}
                </FieldArray>
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
