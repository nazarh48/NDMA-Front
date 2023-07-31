import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import { ErrorMessage, FieldArray, Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import _axios from "../../../../components/Axios";
import CloseButton from "../../../../components/CloseButton";
import Loader from "../../../../components/Loader";
import SubmitButton from "../../../../components/SubmitButton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibreGl from "maplibre-gl";
import { Map, ScaleControl, Source } from "react-map-gl";
import { signal } from "@preact/signals";
import MapDialog from "./MapDemo";
import { useLocation, useNavigate, useParams } from "react-router-dom";
export const mapStyle = signal(
  "https://api.maptiler.com/maps/outdoor/style.json?key=Fbb9bsvj7tIEC7vzB2TD",
);
const AddUpdateEvent = () => {
  const params = useParams();
  const { id } = params;
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [hazards, setHazards] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [reportingSources, setReportingSources] = useState([]);
  const [vulnerableEntities, setVulnerableEntities] = useState([]);
  const [eventSeverities, setEventSeverities] = useState([]);
  const [edit, setEdit] = useState(false);
  const [regions, setRegions] = useState([]);
  const [impactSeverities, setImpactSeverities] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGeoJson, setCurrentGeoJson] = useState(null);
  const eventTypes = [
    { id: 1, name: "Incident" },
    { id: 2, name: "Alert" },
  ];

  useEffect(() => {
    getHazards();
    getTiers();
    getReportingSources();
    getVulnerableEntities();
    getEventSeverities();
    getRegions();
    getImpactSeverities();
    if (location.pathname.includes("edit-event")) {
      getEventById();
    }
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
  const getRegions = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Regions/GetRegions`);
      console.log({ response });
      if (response.status === 200) {
        setRegions(response.data);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getTehsilsByRegionsId = async (regionId, index) => {
    try {
      setIsLoading(true);
      formik.setFieldValue(`eventImpacts[${index}].tehsilMasterList`, []);
      formik.setFieldValue(`eventImpacts[${index}].affectedTehsilId`, {});

      formik.setFieldValue(`eventImpacts[${index}].affectedTehsilIdTemp`, "");

      const response = await _axios("get", `/Tehsil/getTehsilsByRegionId/${regionId}`);
      if (response.status === 200) {
        formik.setFieldValue(`eventImpacts[${index}].tehsilMasterList`, response.data.data);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getImpactSeverities = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/ImpactSeverities/GetImpactSeverity`);
      if (response.status === 200) {
        setImpactSeverities(response.data);
      }
    } catch (error) {
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getEventById = async () => {
    try {
      setIsLoading(true);
      const response = await _axios("get", `/Event/getEventById/${id}`);
      if (response.status === 200) {
        const { data } = response;
        const {
          id,
          name,
          description,
          startTime,
          endTime,
          eventType,
          hazardId,
          reportingSourceId,
          tierId,
          eventSeverityId,
          eventImpacts,
        } = data.data;
        formik.setFieldValue("id", id);
        formik.setFieldValue("name", name);
        formik.setFieldValue("description", description);
        formik.setFieldValue("startTime", new Date(startTime).toISOString().split("T")[0]);
        formik.setFieldValue("endTime", new Date(endTime).toISOString().split("T")[0]);
        formik.setFieldValue("eventType", eventType);
        formik.setFieldValue("hazardId", hazardId);
        formik.setFieldValue("hazardIdTemp", hazardId);
        formik.setFieldValue("reportingSourceId", reportingSourceId);
        formik.setFieldValue("reportingSourceIdTemp", reportingSourceId);
        formik.setFieldValue("tierId", tierId);
        formik.setFieldValue("tierIdTemp", tierId);
        formik.setFieldValue("eventSeverityId", eventSeverityId);
        formik.setFieldValue("eventSeverityIdTemp", eventSeverityId);
        formik.setFieldValue("eventImpacts", eventImpacts);
        setEdit(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("required"),
    eventType: Yup.string().required("required"),
    hazardId: Yup.object().required("required"),
    hazardIdTemp: Yup.string().required("required"),
    reportingSourceId: Yup.object().required("required"),
    reportingSourceIdTemp: Yup.string().required("required"),

    tierId: Yup.object().required("required"),
    tierIdTemp: Yup.string().required("required"),

    eventSeverityId: Yup.object().required("required"),
    eventSeverityIdTemp: Yup.string().required("required"),

    description: Yup.string().nullable(),
    startTime: Yup.date().nullable(),
    endTime: Yup.date().nullable(),
    eventImpacts: Yup.array()
      .of(
        Yup.object().shape({
          tehsilMasterList: Yup.array(),

          vulnerableEntityId: Yup.object().required("required"),
          vulnerableEntityIdTemp: Yup.string().required("required"),

          impactSeverityId: Yup.object().required("required"),
          impactSeverityIdTemp: Yup.string().required("required"),

          casualities: Yup.number().required("required"),
          affected: Yup.number().required("required"),
          displacements: Yup.number().required("required"),
          expectedLoss: Yup.number().required("required"),
        }),
      )
      .required("required"),
  });
  const eventImpact = {
    hasGeometry: false,
    affectedRegionId: null,
    affectedRegionIdTemp: null,

    affectedTehsilId: null,
    affectedTehsilIdTemp: null,

    vulnerableEntityId: null,
    vulnerableEntityIdTemp: null,

    impactSeverityId: null,
    impactSeverityIdTemp: null,
    casualities: 0,
    affected: 0,
    displacements: 0,
    expectedLoss: 0,
    features: [],
  };

  const initialValues = {
    id: null,
    name: "",
    eventType: "",
    hazardId: null,
    hazardIdTemp: null,
    reportingSourceId: null,
    reportingSourceIdTemp: null,
    tierId: null,
    tierIdTemp: null,
    eventSeverityId: null,
    eventSeverityIdTemp: null,
    description: null,
    startTime: null,
    endTime: null,
    eventImpacts: [eventImpact],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      console.log(values);
      const _values = {
        ...values,
        hazardId: values.hazardId.id,
        reportingSourceId: values.reportingSourceId.id,
        tierId: values.tierId.id,
        eventSeverityId: values.eventSeverityId.id,
        eventImpacts: values.eventImpacts.map((impact) => {
          console.log(impact);
          return {
            ...impact,
            affectedRegionId: impact?.affectedRegionId?.regionId,
            affectedTehsilId: impact?.affectedTehsilId?.id,
            vulnerableEntityId: impact.vulnerableEntityId.id,
            impactSeverityId: impact.impactSeverityId.impactSeverityId,
          };
        }),
      };
      if (edit) {
        handleUpdate(_values);
      } else {
        handleSave(_values);
      }
    },
  });

  const handleSave = async (values) => {
    try {
      const response = await _axios("post", `/Event/createEvent`, values);
      if (response.status === 200) {
        toast.success("Event Created Successfully");
        formik.resetForm();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const handleUpdate = async (values) => {
    try {
      const response = await _axios("put", `/Event/updateEvent/${values.id}`, values);
      if (response.status === 200) {
        toast.success("Event Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleClose = () => {
    formik.resetForm();
  };
  const handleGeojsonChange = (e) => {
    console.log(e);
    console.log(currentIndex);
    const geometry = e.map((feature) => {
      return {
        geometry: JSON.stringify(feature),
      };
    });
    formik.setFieldValue(`eventImpacts[${currentIndex}].features`, geometry);
  };
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <MapDialog
            open={open}
            onClose={() => {
              setOpen(false);
            }}
            geojson={(e) => {
              console.log(currentIndex);

              handleGeojsonChange(e);
            }}
            currentGeometry={currentGeoJson}
            title="Draw Polygon over the affected areas"
          />
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Name"
                    {...getFieldProps("name")}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Hazard"
                        {...getFieldProps("hazardId")}
                        error={Boolean(touched.hazardId && errors.hazardId)}
                        helperText={touched.hazardId && errors.hazardId}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Reporting Source"
                        {...getFieldProps("reportingSourceId")}
                        error={Boolean(touched.reportingSourceId && errors.reportingSourceId)}
                        helperText={touched.reportingSourceId && errors.reportingSourceId}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {" "}
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tier"
                        {...getFieldProps("tierId")}
                        error={Boolean(touched.tierId && errors.tierId)}
                        helperText={touched.tierId && errors.tierId}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Event Severity"
                        {...getFieldProps("eventSeverityId")}
                        error={Boolean(touched.eventSeverityId && errors.eventSeverityId)}
                        helperText={touched.eventSeverityId && errors.eventSeverityId}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                    }}
                    {...getFieldProps("startTime")}
                    error={Boolean(touched.startTime && errors.startTime)}
                    helperText={touched.startTime && errors.startTime}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                    }}
                    {...getFieldProps("endTime")}
                    error={Boolean(touched.endTime && errors.endTime)}
                    helperText={touched.endTime && errors.endTime}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    label="Description (Optional)"
                    multiline
                    {...getFieldProps("description")}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    rows={4}
                    fullWidth
                  />
                </Grid>
              </Grid>
              {/* Event Impacts */}
              <div className="mt-2">
                <p className="text-2xl font-bold mb-1">Event Impacts</p>
                <FieldArray name="eventImpacts">
                  {({ remove, push }) => {
                    return (
                      <>
                        {formik.values.eventImpacts.map((impact, index) => (
                          <div key={index} className="p-3 border border-gray-300 rounded mt-2">
                            {formik.values.eventImpacts.length > 1 && (
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
                            <Grid container spacing={3} alignItems="center">
                              <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                  fullWidth
                                  value={impact.affectedRegionId || ""}
                                  id={`eventImpacts[${index}]-affectedRegionId`}
                                  name={`eventImpacts[${index}]-affectedRegionId`}
                                  onChange={(event, newValue) => {
                                    console.log(event, newValue, index);
                                    formik.setFieldValue(
                                      `eventImpacts[${index}].affectedRegionId`,
                                      newValue,
                                    );
                                    getTehsilsByRegionsId(newValue.regionId, index);
                                    console.log(formik.values);
                                  }}
                                  inputValue={impact.affectedRegionIdTemp || ""}
                                  onInputChange={(event, newInputValue) => {
                                    formik.setFieldValue(
                                      `eventImpacts[${index}].affectedRegionIdTemp`,
                                      newInputValue,
                                    );
                                  }}
                                  options={regions}
                                  getOptionLabel={(option) => option.regionName || ""}
                                  isOptionEqualToValue={(option, value) =>
                                    option.regionId === value.regionId
                                  }
                                  disabled={formik.values.eventImpacts[index].hasGeometry}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Affected Region"
                                      {...getFieldProps(
                                        `eventImpacts[${index}].affectedRegionIdTemp`,
                                      )}
                                      error={Boolean(
                                        touched.eventImpacts &&
                                          touched.eventImpacts[index] &&
                                          touched.eventImpacts[index].affectedRegionIdTemp &&
                                          errors.eventImpacts &&
                                          errors.eventImpacts[index] &&
                                          errors.eventImpacts[index].affectedRegionIdTemp,
                                      )}
                                      helperText={
                                        touched.eventImpacts &&
                                        touched.eventImpacts[index] &&
                                        touched.eventImpacts[index].affectedRegionIdTemp &&
                                        errors.eventImpacts &&
                                        errors.eventImpacts[index] &&
                                        errors.eventImpacts[index].affectedRegionIdTemp
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                {" "}
                                <Autocomplete
                                  fullWidth
                                  value={impact.affectedTehsilId || ""}
                                  onChange={(event, newValue) => {
                                    formik.setFieldValue(
                                      `eventImpacts[${index}].affectedTehsilId`,
                                      newValue,
                                    );
                                    console.log(formik.values);
                                  }}
                                  disabled={formik.values.eventImpacts[index].hasGeometry}
                                  inputValue={impact.affectedTehsilIdTemp || ""}
                                  onInputChange={(event, newInputValue) => {
                                    formik.setFieldValue(
                                      `eventImpacts[${index}].affectedTehsilIdTemp`,
                                      newInputValue,
                                    );
                                  }}
                                  options={impact.tehsilMasterList || []}
                                  getOptionLabel={(option) => option.name || ""}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Affected Tehsil"
                                      {...getFieldProps(`eventImpacts[${index}].affectedTehsilId`)}
                                      error={Boolean(
                                        touched.eventImpacts &&
                                          touched.eventImpacts[index] &&
                                          touched.eventImpacts[index].affectedTehsilId &&
                                          errors.eventImpacts &&
                                          errors.eventImpacts[index] &&
                                          errors.eventImpacts[index].affectedTehsilId,
                                      )}
                                      helperText={
                                        touched.eventImpacts &&
                                        touched.eventImpacts[index] &&
                                        touched.eventImpacts[index].affectedTehsilId &&
                                        errors.eventImpacts &&
                                        errors.eventImpacts[index] &&
                                        errors.eventImpacts[index].affectedTehsilId
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={2}>
                                <input
                                  type="checkbox"
                                  id={`HasGeometry-${index}`}
                                  onChange={(event) => {
                                    formik.setFieldValue(
                                      `eventImpacts[${index}].hasGeometry`,
                                      event.target.checked,
                                    );
                                    //remove yup validation
                                    if (event.target.checked) {
                                      formik.setFieldError(
                                        `eventImpacts[${index}].affectedRegionIdTemp`,
                                        "",
                                      );
                                      formik.setFieldError(
                                        `eventImpacts[${index}].affectedTehsilIdTemp`,
                                        "",
                                      );
                                    }
                                    console.log(formik.values);
                                  }}
                                  checked={formik.values.eventImpacts[index].hasGeometry}
                                />

                                <label for={`HasGeometry-${index}`}>Select from map instead</label>
                              </Grid>
                              <Grid item xs={12} sm={6} md={2}>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    className={`bg-gray-200 text-sm text-black px-3 py-2 ${
                                      formik.values.eventImpacts[index].hasGeometry ? "" : "hidden"
                                    }`}
                                    disabled={!formik.values.eventImpacts[index].hasGeometry}
                                    onClick={() => {
                                      setOpen(true);
                                      setCurrentIndex(index);
                                      setCurrentGeoJson(null);
                                      console.log({ index });
                                    }}
                                  >
                                    Open Map
                                  </button>
                                  {edit && impact.features.length > 0 && (
                                    <button
                                      type="button"
                                      className={`bg-gray-200 text-sm text-black px-3 py-2 ${
                                        formik.values.eventImpacts[index].hasGeometry
                                          ? ""
                                          : "hidden"
                                      }`}
                                      disabled={!formik.values.eventImpacts[index].hasGeometry}
                                      onClick={() => {
                                        setOpen(true);
                                        setCurrentIndex(index);
                                        console.log(
                                          impact.features.map((x) => JSON.parse(x.geometry)),
                                        );
                                        setCurrentGeoJson({
                                          type: "FeatureCollection",
                                          features: impact.features.map((x) =>
                                            JSON.parse(x.geometry),
                                          ),
                                        });
                                      }}
                                    >
                                      View Map
                                    </button>
                                  )}
                                </div>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                  fullWidth
                                  value={impact.vulnerableEntityId || ""}
                                  onChange={(event, newValue) => {
                                    formik.setFieldValue(
                                      `eventImpacts[${index}].vulnerableEntityId`,
                                      newValue,
                                    );
                                    console.log(formik.values);
                                  }}
                                  inputValue={impact.vulnerableEntityIdTemp || ""}
                                  onInputChange={(event, newInputValue) => {
                                    formik.setFieldValue(
                                      `eventImpacts[${index}].vulnerableEntityIdTemp`,
                                      newInputValue,
                                    );
                                  }}
                                  options={vulnerableEntities}
                                  getOptionLabel={(option) => option.name || ""}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Impact on"
                                      onChange={formik.handleChange}
                                      {...getFieldProps(
                                        `eventImpacts[${index}].vulnerableEntityId`,
                                      )}
                                      errsetCurrentGeoJsonor={Boolean(
                                        touched.eventImpacts &&
                                          touched.eventImpacts[index] &&
                                          touched.eventImpacts[index].vulnerableEntityId &&
                                          errors.eventImpacts &&
                                          errors.eventImpacts[index] &&
                                          errors.eventImpacts[index].vulnerableEntityId,
                                      )}
                                      helperText={
                                        touched.eventImpacts &&
                                        touched.eventImpacts[index] &&
                                        touched.eventImpacts[index].vulnerableEntityId &&
                                        errors.eventImpacts &&
                                        errors.eventImpacts[index] &&
                                        errors.eventImpacts[index].vulnerableEntityId
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                  fullWidth
                                  value={impact.impactSeverityId || ""}
                                  onChange={(event, newValue) => {
                                    console.log(newValue);
                                    formik.setFieldValue(
                                      `eventImpacts[${index}].impactSeverityId`,
                                      newValue,
                                    );
                                  }}
                                  inputValue={impact.impactSeverityIdTemp || ""}
                                  onInputChange={(event, newInputValue) => {
                                    formik.setFieldValue(
                                      `eventImpacts[${index}].impactSeverityIdTemp`,
                                      newInputValue,
                                    );
                                  }}
                                  options={impactSeverities || []}
                                  getOptionLabel={(option) => option.impactSeverityName || ""}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Impact Severity"
                                      {...getFieldProps(`eventImpacts[${index}].impactSeverityId`)}
                                      error={Boolean(
                                        touched.eventImpacts &&
                                          touched.eventImpacts[index] &&
                                          touched.eventImpacts[index].impactSeverityId &&
                                          errors.eventImpacts &&
                                          errors.eventImpacts[index] &&
                                          errors.eventImpacts[index].impactSeverityId,
                                      )}
                                      helperText={
                                        touched.eventImpacts &&
                                        touched.eventImpacts[index] &&
                                        touched.eventImpacts[index].impactSeverityId &&
                                        errors.eventImpacts &&
                                        errors.eventImpacts[index] &&
                                        errors.eventImpacts[index].impactSeverityId
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  fullWidth
                                  label="Casualities"
                                  value={impact.casualities || ""}
                                  onChange={formik.handleChange}
                                  {...getFieldProps(`eventImpacts[${index}].casualities`)}
                                  error={Boolean(
                                    touched.eventImpacts &&
                                      touched.eventImpacts[index] &&
                                      touched.eventImpacts[index].casualities &&
                                      errors.eventImpacts &&
                                      errors.eventImpacts[index] &&
                                      errors.eventImpacts[index].casualities,
                                  )}
                                  helperText={
                                    touched.eventImpacts &&
                                    touched.eventImpacts[index] &&
                                    touched.eventImpacts[index].casualities &&
                                    errors.eventImpacts &&
                                    errors.eventImpacts[index] &&
                                    errors.eventImpacts[index].casualities
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  fullWidth
                                  label="Affected"
                                  value={impact.affected || ""}
                                  onChange={formik.handleChange}
                                  {...getFieldProps(`eventImpacts[${index}].affected`)}
                                  error={Boolean(
                                    touched.eventImpacts &&
                                      touched.eventImpacts[index] &&
                                      touched.eventImpacts[index].affected &&
                                      errors.eventImpacts &&
                                      errors.eventImpacts[index] &&
                                      errors.eventImpacts[index].affected,
                                  )}
                                  helperText={
                                    touched.eventImpacts &&
                                    touched.eventImpacts[index] &&
                                    touched.eventImpacts[index].affected &&
                                    errors.eventImpacts &&
                                    errors.eventImpacts[index] &&
                                    errors.eventImpacts[index].affected
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  fullWidth
                                  label="Displacements"
                                  value={impact.displacements || ""}
                                  onChange={formik.handleChange}
                                  {...getFieldProps(`eventImpacts[${index}].displacements`)}
                                  error={Boolean(
                                    touched.eventImpacts &&
                                      touched.eventImpacts[index] &&
                                      touched.eventImpacts[index].displacements &&
                                      errors.eventImpacts &&
                                      errors.eventImpacts[index] &&
                                      errors.eventImpacts[index].displacements,
                                  )}
                                  helperText={
                                    touched.eventImpacts &&
                                    touched.eventImpacts[index] &&
                                    touched.eventImpacts[index].displacements &&
                                    errors.eventImpacts &&
                                    errors.eventImpacts[index] &&
                                    errors.eventImpacts[index].displacements
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                  fullWidth
                                  label="Estimated Loss"
                                  value={impact.expectedLoss || ""}
                                  onChange={formik.handleChange}
                                  {...getFieldProps(`eventImpacts[${index}].expectedLoss`)}
                                  error={Boolean(
                                    touched.eventImpacts &&
                                      touched.eventImpacts[index] &&
                                      touched.eventImpacts[index].expectedLoss &&
                                      errors.eventImpacts &&
                                      errors.eventImpacts[index] &&
                                      errors.eventImpacts[index].expectedLoss,
                                  )}
                                  helperText={
                                    touched.eventImpacts &&
                                    touched.eventImpacts[index] &&
                                    touched.eventImpacts[index].expectedLoss &&
                                    errors.eventImpacts &&
                                    errors.eventImpacts[index] &&
                                    errors.eventImpacts[index].expectedLoss
                                  }
                                />
                              </Grid>
                            </Grid>
                          </div>
                        ))}

                        <button
                          onClick={() => {
                            push(eventImpact);
                          }}
                          className="bg-gray-200 text-gray-700 hover:bg-gray-300  rounded-md float-right px-3 text-sm mt-3 "
                        >
                          Add
                        </button>
                      </>
                    );
                  }}
                </FieldArray>
              </div>
            </Form>
          </FormikProvider>
          <div className="mt-3 flex gap-4">
            <CloseButton onClick={handleClose}>Cancel</CloseButton>
            <SubmitButton
              onClick={() => {
                console.log("clicked");
                console.log(formik.values);
                const invalidFields = Object.keys(formik.errors).filter(
                  (field) => formik.touched[field],
                );
                console.log(invalidFields);
                handleSubmit();
              }}
            >
              {edit ? "Update" : "Submit"}
              {isSubmitting && "ing..."}
            </SubmitButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AddUpdateEvent;
