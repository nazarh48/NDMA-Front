import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { ErrorMessage, Field, FieldArray, Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import _axios from "../../../../components/Axios";
import CloseButton from "../../../../components/CloseButton";
import SubmitButton from "../../../../components/SubmitButton";
import WarehouseDialog from "../Warehouse/Dialog";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import MiniTable from "../../../../components/MiniTable";

const MouseOverPopover = ({ warehouse }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [warehouseInfo, setWarehouseInfo] = React.useState({}); //[warehouseInfo,setWarehouseInfo
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const columns = [
    { id: "inventoryType", label: "Type" },
    { id: "inventoryQuantity", label: "Quantity" },
    {
      id: "weightPerItem",
      label: "Weight",
    },
  ];
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const getWarehouseInfo = async () => {
    try {
      console.log(warehouse);
      if (!warehouse.from) return;
      const response = await _axios("get", `/Warehouse/getWarehouseById/${warehouse.warehouseId}`);
      console.log(response.data);
      if (response.status == 200) {
        setWarehouseInfo(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useMemo(() => {
    console.log({ warehouse });
    getWarehouseInfo();
  }, [warehouse]);

  const open = Boolean(anchorEl);

  return (
    <div>
      <i
        className="fa-solid fa-info text-black text-xl cursor-pointer py-3 px-4 bg-gray-200 rounded hover:bg-gray-300"
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />

      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
      >
        <Box sx={{ p: 3 }}>
          <Typography gutterBottom variant="h5" component="div">
            {warehouseInfo.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {warehouseInfo.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {warehouseInfo.city}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <i className="fa-solid fa-location-dot"></i> {warehouseInfo.latitude}{" "}
            {warehouseInfo.longitude}
          </Typography>
          <div className="mt-2"></div>
          <MiniTable
            columns={columns}
            item={warehouseInfo}
            rowPerPage={warehouseInfo?.inventory?.length}
          />
        </Box>
      </Popover>
    </div>
  );
};
const ActionDialog = ({ open, onClose, onEdit, onRefresh, row }) => {
  const [openWarehouseDialog, setOpenWarehouseDialog] = React.useState(false);
  const [masterActivities, setMasterActivities] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [warehouseAndInventory, setWarehouseAndInventory] = React.useState([]);
  const [activityStatuses, setActivityStatuses] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    getMasterActivities();
    getUsers();
    getWarehouseAndInventory();
    getActivityStatuses();
  }, []);
  const validationSchema = Yup.object().shape({
    activities: Yup.array().of(
      Yup.object().shape({
        activityMasterId: Yup.string().required("required"),
        employees: Yup.array()
          .min(1, "Please select at least one employee")
          .required("Please select at least one employee"),

        from: Yup.string().required("required"),
        to: Yup.string().required("required"),
        warehouseId: Yup.string().required("required"),
        inventoryId: Yup.string().required("required"),
        inventoryToSend: Yup.number().required("required"),
        activityStatusId: Yup.string().required("required"),
      }),
    ),
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

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const openPopover = Boolean(anchorEl);

  const formik = useFormik({
    initialValues: {
      activities: [
        {
          id: null,
          planId: 1,
          inheritAlertLocation: false,
          activityMasterId: null,
          activityStatusId: null,
          alertId: row.id,
          eventId: row.id,
          employees: [],
          progress: null,
          remarks: null,
          from: null,
          to: null,
          warehouseId: null,
          inventoryMasterList: [],
          availableInventory: null,
          inventoryId: null,
          inventoryToSend: null,
          expectedCompletion: null,
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      console.log(values);
      let _values = values.activities.map((x) => {
        return {
          ...x,
          alertId: row.id,
          eventId: row.id,
        };
      });
      if (onEdit) {
        handleUpdate({
          activities: _values,
        });
      } else {
        handleSave({
          activities: _values,
        });
      }
    },
  });

  const handleSave = async (values) => {
    try {
      const response = await _axios("post", `/Activity/createActivity`, values);
      if (response.status === 200) {
        toast.success("Activity created with given recipients Successfully");
        onRefresh();
        handleClose();
        getWarehouseAndInventory();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleWarehouseChange = (e, p, index) => {
    console.log(e.target.value, p, index);
    const warehouse = warehouseAndInventory.find((x) => x.warehouseId == e.target.value);
    formik.setFieldValue(`activities[${index}].inventoryMasterList`, []);
    formik.setFieldValue(`activities[${index}].inventoryToSend`, "");
    formik.setFieldValue(`activities[${index}].inventoryId`, null);
    formik.setFieldValue(`activities[${index}].warehouseId`, e.target.value);
    formik.setFieldValue(`activities[${index}].availableInventory`, 0);
    formik.setFieldValue(
      `activities[${index}].from`,
      `${warehouse.latitude},${warehouse.longitude}`,
    );
    formik.setFieldValue(`activities[${index}].inventoryMasterList`, warehouse.inventory);

    // if (formik.values.length > 1) {
    //   handleInventoryMasterList(e, p, index);
    // }
  };

  const handleInventoryChange = (e, p, index) => {
    console.log(e.target.value);
    formik.setFieldValue(`activities[${index}].inventoryId`, e.target.value);
    formik.setFieldValue(
      `activities[${index}].availableInventory`,
      warehouseAndInventory
        .find((x) => x.warehouseId == p.warehouseId)
        .inventory.find((x) => x.id == e.target.value).inventoryQuantity,
    );
  };
  const getMasterActivities = async () => {
    try {
      const response = await _axios("get", "/ActivityMaster/getMasterActivities");
      console.log(response);
      if (response.status === 200) {
        setMasterActivities(response.data.data || []);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getUsers = async () => {
    try {
      const response = await _axios("get", "UserManagement/getUsers", null);

      if (response.status == 200) {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getWarehouseAndInventory = async () => {
    try {
      const response = await _axios("get", `/Inventory/getInventory`);
      if (response.status === 200) {
        setWarehouseAndInventory(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getActivityStatuses = async () => {
    try {
      const response = await _axios("get", `/ActivityStatus/getActivityStatus`);
      if (response.status === 200) {
        setActivityStatuses(response.data.data);
      }
    } catch (error) {
      console.log(error);
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

  const handleLatLongChange = (checked, p, index) => {
    console.log(formik.values);
    console.log(formik.values.activities);
    if (checked) {
      formik.setFieldValue(`activities[${index}].inheritAlertLocation`, true);
      const location = `${row.latitude}, ${row.longitude}`;
      formik.setFieldValue(`activities[${index}].to`, location);
    } else {
      formik.setFieldValue(`activities[${index}].inheritAlertLocation`, false);
      formik.setFieldValue(`activities[${index}].to`, "");
    }
  };

  const handleFormFieldPush = () => {
    const lastFormArrayObject = formik.values.activities[formik.values.activities.length - 1];
    if (lastFormArrayObject) {
    }
  };

  const getAvailableInventory = (p, index) => {
    if (p.inventoryId) {
      return warehouseAndInventory
        .find((x) => x.warehouseId == p.warehouseId)
        .inventory.find((x) => x.id == p.inventoryId).inventoryQuantity;
    } else {
      return 0;
    }
  };

  const handleActivityInsertion = (push) => {
    // const formValues = [...formik.values];
    // const lastIndex = formValues[formValues.length - 1];
    if (!formik.isValid) {
      formik.submitForm();
      return;
    }
    push({
      id: null,
      planId: null,
      inheritAlertLocation: null,
      activityMasterId: null,
      activityStatusId: null,
      employees: null,
      progress: null,
      remarks: null,
      from: null,
      to: null,
      warehouseId: null,
      inventoryMasterList: [],
      availableInventory: null,
      inventoryId: null,
      inventoryToSend: null,
      expectedCompletion: null,
    });
  };
  return (
    <div>
      <WarehouseDialog
        open={openWarehouseDialog}
        onClose={() => {
          setOpenWarehouseDialog(false);
        }}
        onRefresh={() => {
          getWarehouseAndInventory();
        }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
        hideBackdrop
      >
        <DialogTitle>{onEdit ? "Update Activity" : "Add Activity"}</DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" onSubmit={handleSubmit}>
              <FieldArray name="activities">
                {({ remove, push }) => (
                  <div>
                    {formik.values.activities.map((p, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            padding: "1rem",
                            border: "0.5px solid #ccc",
                            borderRadius: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {formik.values.activities.length > 1 && (
                            <span className="my-2">
                              <Tooltip title="Remove activity from list">
                                <i
                                  className="fa-solid fa-trash text-red-500 text-xl hover:text-red-600 cursor-pointer float-right"
                                  onClick={() => {
                                    remove(index);
                                  }}
                                ></i>
                              </Tooltip>
                            </span>
                          )}
                          <Grid container spacing={1} alignItems="center">
                            <Grid item xs={6} md={6}>
                              <TextField
                                id="activityMasterId"
                                select
                                label="Activity"
                                placeholder="Select Activity"
                                {...getFieldProps(`activities[${index}].activityMasterId`)}
                                fullWidth
                                required
                              >
                                {masterActivities.map((option) => (
                                  <MenuItem key={option.name} value={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <ErrorMessage
                                name={`activities[${index}].activityMasterId`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </Grid>

                            <Grid item xs={6} md={6}>
                              <Field name="employees">
                                {({ field }) => (
                                  <>
                                    <Autocomplete
                                      multiple
                                      disableCloseOnSelect
                                      isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                      }
                                      limitTags={2}
                                      id={`activities[${index}]-employees`}
                                      name={`activities[${index}]-employees`}
                                      options={users}
                                      getOptionLabel={(option) => option.name}
                                      onChange={(e, value) => {
                                        console.log(e, value);
                                        formik.setFieldValue(
                                          `activities[${index}].employees`,
                                          value,
                                        );
                                        console.log(formik.values);
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Employees"
                                          placeholder="Select Employees"
                                          {...getFieldProps(`activities[${index}].employees`)}
                                          sx={{
                                            cursor: "pointer",
                                          }}
                                          required
                                        />
                                      )}
                                      fullWidth
                                    />
                                    <ErrorMessage
                                      name={`activities[${index}].employees`}
                                      component="div"
                                      className="text-red-500 text-sm"
                                    />
                                  </>
                                )}
                              </Field>
                            </Grid>
                            <Grid item md={8}>
                              <Tooltip title="List of warehouses that at least have one item in the inventory">
                                <TextField
                                  fullWidth
                                  label="From"
                                  name={`activities[${index}].warehouseId`}
                                  {...getFieldProps(`activities[${index}].warehouseId`)}
                                  InputLabelProps={{
                                    shrink: p.warehouseId ? true : false,
                                  }}
                                  onChange={(e) => {
                                    handleWarehouseChange(e, p, index);
                                  }}
                                  select
                                >
                                  {warehouseAndInventory.map((option) => (
                                    <MenuItem key={option.warehouse} value={option.warehouseId}>
                                      {option.warehouse}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Tooltip>
                              <ErrorMessage
                                name={`activities[${index}].from`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </Grid>
                            <Grid item md={2}>
                              <div className="flex items-center gap-2">
                                <Tooltip title="Navigate to warehouse page if required warehouse is not available in the list. Add warehouse and inventory then come back to this page">
                                  <i
                                    className="fa-solid fa-plus text-black text-xl cursor-pointer p-3 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => {
                                      toast.info(
                                        "Navigated to warehouse screen. Please add warehouse and inventory then go back to alerts page to take necessary action",
                                        {
                                          autoClose: 8000,
                                        },
                                      );
                                      navigate("/event-dashboard/warehouses");
                                    }}
                                  ></i>
                                </Tooltip>
                                {p.from && <MouseOverPopover warehouse={p} />}
                              </div>
                            </Grid>
                            <Grid item md={8}>
                              <TextField
                                fullWidth
                                label="To"
                                name={`activities[${index}].to`}
                                {...getFieldProps(`activities[${index}].to`)}
                                InputLabelProps={{
                                  shrink: p.to ? true : false,
                                }}
                                helperText="Point of incident"
                                required
                              />
                              <ErrorMessage
                                name={`activities[${index}].to`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </Grid>
                            <Grid item md={4}>
                              <Field type="checkbox" name="inheritAlertLocation">
                                {({ field }) => (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        {...field}
                                        onChange={(e) => {
                                          handleLatLongChange(e.target.checked, p, index);
                                        }}
                                        checked={p.inheritAlertLocation}
                                      />
                                    }
                                    label="Inherit Event Location"
                                  />
                                )}
                              </Field>
                            </Grid>

                            <Grid item md={4}>
                              <TextField
                                id="inventoryId"
                                select
                                label="Inventory"
                                key="inventoryId"
                                {...getFieldProps(`activities[${index}].inventoryId`)}
                                placeholder="Select Inventory"
                                onChange={(e) => {
                                  handleInventoryChange(e, p, index);
                                }}
                                InputLabelProps={{
                                  shrink: p.inventoryId ? true : false,
                                }}
                                fullWidth
                                required
                              >
                                {p?.inventoryMasterList?.map((option) => (
                                  <MenuItem
                                    key={option.inventoryType}
                                    value={option.id}
                                    disabled={option.inventoryQuantity == 0}
                                  >
                                    {option.inventoryType}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <ErrorMessage
                                name={`activities[${index}].inventoryId`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </Grid>
                            <Grid item md={4}>
                              <TextField
                                id="inventoryToSend"
                                label={`Available: ${p.availableInventory}`}
                                name={`activities[${index}].inventoryToSend`}
                                {...getFieldProps(`activities[${index}].inventoryToSend`)}
                                InputLabelProps={{
                                  shrink: p.inventoryToSend ? true : false,
                                }}
                                onInput={(e) => {
                                  const target = e.target;
                                  target.value = e.target.value.replace(/[^0-9]/g, "");
                                  if (target.value > p.availableInventory) {
                                    target.value = p.availableInventory;
                                    formik.setFieldValue(
                                      `activities[${index}].inventoryToSend`,
                                      target.value,
                                    );
                                  }
                                }}
                                InputProps={{
                                  inputProps: {
                                    type: "number",
                                    min: 1,
                                  },
                                }}
                                fullWidth
                                required
                              />
                              <ErrorMessage
                                name={`activities[${index}].inventoryToSend`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </Grid>
                            <Grid item md={4}>
                              <TextField
                                id="activityStatusId"
                                select
                                label="Status"
                                key="activityStatusId"
                                {...getFieldProps(`activities[${index}].activityStatusId`)}
                                placeholder="Status"
                                InputLabelProps={{
                                  shrink: p.activityStatusId ? true : false,
                                }}
                                fullWidth
                                required
                              >
                                {activityStatuses?.map((option) => (
                                  <MenuItem key={option.name} value={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <ErrorMessage
                                name={`activities[${index}].activityStatusId`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </Grid>
                            <Grid item md={4}>
                              <TextField
                                id="progress"
                                label="Progress"
                                key="progress"
                                name={`activities[${index}].progress`}
                                value={p.progress}
                                placeholder="Progress"
                                onChange={formik.handleChange}
                                InputLabelProps={{
                                  shrink: p.progress ? true : false,
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
                                fullWidth
                              />
                            </Grid>
                            <Grid item md={4}>
                              <TextField
                                label="Expected Completion Date"
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{
                                  min: new Date().toISOString().split("T")[0],
                                }}
                                key="expectedCompletion"
                                {...getFieldProps(`activities[${index}].expectedCompletion`)}
                                fullWidth
                              />
                            </Grid>
                            <Grid item md={12}>
                              <TextField
                                label="Remarks (Optional)"
                                multiline
                                rows={3}
                                key="remarks"
                                {...getFieldProps(`activities[${index}].remarks`)}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                    {/* <Tooltip title="Add another activity.Please make sure to fill all fields before moving to the next activity">
                      <button
                        type="button"
                        onClick={() => {
                          handleActivityInsertion(push);
                          console.log(formik.isValid);
                        }}
                      >
                        <i className="fa-solid fa-plus" /> Add
                      </button>
                    </Tooltip> */}
                  </div>
                )}
              </FieldArray>
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
            {onEdit ? "Update" : "Take Action"}
            {isSubmitting && "ing..."}
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ActionDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onEdit: PropTypes.bool,
  onRefresh: PropTypes.func,
  row: PropTypes.object,
};
export default ActionDialog;
