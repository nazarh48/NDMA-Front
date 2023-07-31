import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import _axios from "../../../../components/Axios";
import CloseButton from "../../../../components/CloseButton";
import Loader from "../../../../components/Loader";
import SubmitButton from "../../../../components/SubmitButton";
const AddUpdateDialog = ({ open, onClose, onEdit, onRefresh, row }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [alertTypes, setAlertTypes] = React.useState([]);
  const [alertSeverities, setAlertSeverities] = React.useState([]);
  const [hazards, setHazards] = React.useState([]);
  const [tiers, setTiers] = React.useState([]);
  const [reportingSources, setReportingSources] = React.useState([]);
  const [vulnerableEntities, setVulnerableEntities] = React.useState([]);
  const [eventSeverities, setEventSeverities] = React.useState([]);
  const [alignment, setAlignment] = React.useState("left");

  const eventTypes = [
    { id: 1, name: "Incident" },
    { id: 2, name: "Alert" },
  ];
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  useEffect(() => {
    getHazards();
    getTiers();
    getReportingSources();
    getVulnerableEntities();
    getEventSeverities();
  }, []);
  const getHazards = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Hazard/getHazards`);
      if (response.status === 200) {
        setHazards(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getTiers = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Tier/getTiers`);
      if (response.status === 200) {
        setTiers(response.data.data);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getReportingSources = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/ReportingSource/getReportingSources`);
      if (response.status === 200) {
        setReportingSources(response.data.data);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getVulnerableEntities = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/VulnerableEntity/getVulnerableEntities`);
      if (response.status === 200) {
        setVulnerableEntities(response.data.data);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getEventSeverities = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/EventSeverity/getEventSeverities`);
      if (response.status === 200) {
        setEventSeverities(response.data.data);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    eventType: Yup.string().required(),
    hazardId: Yup.number().required(),
    hazardIdTemp: Yup.number().required(),
    reportingTime: Yup.date().required(),
    reportingSourceId: Yup.number().required(),
    reportingSourceIdTemp: Yup.number().required(),

    tierId: Yup.number().required(),
    tierIdTemp: Yup.number().required(),

    eventSeverityId: Yup.number().required(),
    eventSeverityIdTemp: Yup.number().required(),

    description: Yup.string().nullable(),
    startTime: Yup.date().nullable(),
    endTime: Yup.date().nullable(),
    mapGeometry: Yup.string().nullable(),
    latitude: Yup.number().nullable(),
    longitude: Yup.number().nullable(),
    eventImpacts: Yup.array()
      .of(
        Yup.object().shape({
          affectedRegionId: Yup.number().required(),
          affectedTehsilId: Yup.number().required(),
          vulnerableEntityId: Yup.number().required(),
          impactSeverityId: Yup.number().required(),
          casualities: Yup.number().required(),
          affected: Yup.number().required(),
          displacements: Yup.number().required(),
          expectedLoss: Yup.number().required(),
          estimatedResourceAllocation: Yup.number().required(),
          eventId: Yup.number().required(),
        }),
      )
      .required(),
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

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
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
                    fullWidth
                    label="Event Type"
                    {...getFieldProps("eventType")}
                    error={Boolean(touched.eventType && errors.eventType)}
                    helperText={touched.eventType && errors.eventType}
                    select
                  >
                    {eventTypes.map((option) => (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Autocomplete
                    fullWidth
                    value={formik.values.hazardId || ""}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("hazardId", newValue);
                      console.log(formik.values);
                    }}
                    inputValue={formik.values.hazardIdTemp || ""}
                    onInputChange={(event, newInputValue) => {
                      formik.setFieldValue("hazardIdTemp", newInputValue);
                    }}
                    options={hazards}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => <TextField {...params} label="Hazard" />}
                  />
                  <Autocomplete
                    fullWidth
                    value={formik.values.reportingSourceId || ""}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("reportingSourceId", newValue);
                      console.log(formik.values);
                    }}
                    inputValue={formik.values.reportingSourceIdTemp || ""}
                    onInputChange={(event, newInputValue) => {
                      formik.setFieldValue("reportingSourceIdTemp", newInputValue);
                    }}
                    options={reportingSources}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => <TextField {...params} label="Reporting Source" />}
                  />
                  <Autocomplete
                    fullWidth
                    value={formik.values.tierId || ""}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("tierId", newValue);
                      console.log(formik.values);
                    }}
                    inputValue={formik.values.tierIdTemp || ""}
                    onInputChange={(event, newInputValue) => {
                      formik.setFieldValue("tierIdTemp", newInputValue);
                    }}
                    options={tiers}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => <TextField {...params} label="Tier" />}
                  />
                  <Autocomplete
                    fullWidth
                    value={formik.values.eventSeverityId || ""}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("eventSeverityId", newValue);
                      console.log(formik.values);
                    }}
                    inputValue={formik.values.eventSeverityIdTemp || ""}
                    onInputChange={(event, newInputValue) => {
                      formik.setFieldValue("eventSeverityIdTemp", newInputValue);
                    }}
                    options={eventSeverities}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => <TextField {...params} label="Event Severity" />}
                  />
                  <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                    }}
                    {...getFieldProps("startDate")}
                    error={Boolean(touched.startTime && errors.startTime)}
                    helperText={touched.startTime && errors.startTime}
                    fullWidth
                  />
                  <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                    }}
                    {...getFieldProps("endDate")}
                    error={Boolean(touched.endTime && errors.endTime)}
                    helperText={touched.endTime && errors.endTime}
                    fullWidth
                  />
                  <TextField
                    label="Description (Optional)"
                    multiline
                    value={formik.values.description || ""}
                    onChange={formik.handleChange}
                    rows={4}
                    fullWidth
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
      )}
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
