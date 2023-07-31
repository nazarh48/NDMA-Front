import { useState, useEffect } from "react";
import _axios from "../../../components/Axios";
import Preloader from "../../../components/Preloader";
import { animated, useSpring } from '@react-spring/web'
import { RiFileEditFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Slider from '@mui/material/Slider';

export default function DisasterRegistration() {

    let [preloader, togglePreloader] = useState(false);

    let [regionsArr, setRegions] = useState([]);

    let [impactTypesArr, setImpactTypesArr] = useState([]);


    let [impactObjectsArr, setImpactObjectsArr] = useState([]);


    let [impactSeverityArr, setImpactSeverityArr] = useState([]);

    let [weatherTypeArr, setWeatherTypeArr] = useState([]);

    let [selectedRegion, setSelectedRegion] = useState([]);

    let [districtArr, setDistricts] = useState([]);

    let [selectedDistrictArr, setSelectedDistricts] = useState([]);

    let [alertArr, setAlerts] = useState([]);

    let [selectedAlert, setSelectedAlert] = useState({ disasterAlertId: null, disasterDesc: null, weatherType: null, durationFrom: null, durationTo: null, impactObjects: null, impactSeverity: null, alertDescription: null });


    let [distrcitShow, toggleDistrictShow] = useState(false);


    let [alertShow, toggleAlertShow] = useState(false);


    let [disasterDescShow, toggleDisasterDescShow] = useState(false);

    let [disasterDesc, setDisasterDesc] = useState(null);


    let [saveBtnShow, toggleSaveBtnShow] = useState(false);

    let [temperatureValue, setTemperatureValue] = useState([0, 37]);

    let [sliderToggle, setSliderToggle] = useState(false);

    let tempMarks = [
        {
            "value": 0,
            "label": "0°C"
        },
        {
            "value": 10,
            "label": "10°C"
        },
        {
            "value": 20,
            "label": "20°C"
        },
        {
            "value": 30,
            "label": "30°C"
        },
        {
            "value": 40,
            "label": "40°C"
        },
        {
            "value": 50,
            "label": "50°C"
        },
        {
            "value": 60,
            "label": "60°C"
        },
        {
            "value": 70,
            "label": "70°C"
        },
        {
            "value": 80,
            "label": "80°C"
        },
        {
            "value": 90,
            "label": "90°C"
        },
        {
            "value": 100,
            "label": "100°C"
        }
    ]



    useEffect(() => {
        togglePreloader(true);
        getImpactObjects();
        getImpactTypes();
        getImpactSeverity();
        getWeatherType();
        getRegions();
    }, []);



    const getRegions = () => {

        _axios("get", 'Regions/GetRegions').then((res) => {
            setRegions(res.data);
            togglePreloader(false);
        },
            (error) => {
                togglePreloader(false);
                toast.error("Something went wrong !");
            });
    }


    const getWeatherType = () => {
        _axios("get", 'WeatherTypes/GetWeatherTypes').then((res) => {
            setWeatherTypeArr(res.data);
            togglePreloader(false);
        },
            (error) => {
                togglePreloader(false);
                toast.error("Something went wrong !");
            });
    }

    const getImpactObjects = () => {
        _axios("get", 'ImpactObjects/GetImpactObjects').then((res) => {
            setImpactObjectsArr(res.data);
            togglePreloader(false);
        },
            (error) => {
                togglePreloader(false);
                toast.error("Something went wrong !");
            });
    }

    const getImpactTypes = () => {
        _axios("get", 'ImpactTypes/GetImpactTypes').then((res) => {
            setImpactTypesArr(res.data);
            togglePreloader(false);
        },
            (error) => {
                togglePreloader(false);
                toast.error("Something went wrong !");
            });
    }


    const getImpactSeverity = () => {
        _axios("get", 'ImpactSeverities/GetImpactSeverity').then((res) => {
            setImpactSeverityArr(res.data);
            togglePreloader(false);
        },
            (error) => {
                togglePreloader(false);
                toast.error("Something went wrong !");
            });
    }

    const getDistrictsByRegion = (regionIds) => {
        let key = {
            regionIds: regionIds
        }
        _axios("post", 'Districts/GetDistrictsByRegion', key).then((res) => {
            setDistricts(res.data);
            togglePreloader(false);
        },
            (error) => {
                togglePreloader(false);
                toast.error("Something went wrong !");
            });

    }

    const getAlerts = () => {
        _axios("get", 'DisasterAlertMasters/GetDisasterAlertMasters').then((res) => {
            setAlerts(res.data);
            togglePreloader(false);
        },
            (error) => {
                togglePreloader(false);
                toast.error("Something went wrong !");
            });
    }

    const districtProps = useSpring({
        height: distrcitShow ? 250 : 0,
    });

    const alertProps = useSpring({
        height: alertShow ? 500 : 0
    });

    const disasterDescProps = useSpring({
        height: disasterDescShow ? 400 : 0
    });


    const saveBtnProps = useSpring({
        opacity: saveBtnShow ? 0 : '100%'
    });


    const invokeDistricts = (regionObj) => {

        let regionCbox = document.getElementsByClassName('regionCbox');

        if(!selectedRegion){
            selectedRegion = [];
            getRegions();
        }

        // for (var i = 0; i < regionCbox.length; i++) {
        //     if (regionObj && regionCbox[i].nextSibling.textContent != regionObj.regionName) {
        //         regionCbox[i].checked = false;
        //     }
        // }

        if (regionObj) {
            document.getElementById('districtContainer').style.display = 'block';
            toggleDistrictShow(true);

            if (selectedRegion.length > 0 && selectedRegion.some(x => x.regionId == regionObj.regionId)) {
                selectedRegion = selectedRegion.filter(x => x.regionId != regionObj.regionId);
                setSelectedRegion(selectedRegion);
                for (var i = 0; i < regionCbox.length; i++) {
                    if (regionObj && regionCbox[i].nextSibling.textContent == regionObj.regionName) {
                        regionCbox[i].checked = false;
                    }
                }
                return true;
            }

            selectedRegion.push(regionObj);

            setSelectedRegion(selectedRegion);

            togglePreloader(true)

            getDistrictsByRegion(selectedRegion.map(x => x.regionId));

            setTimeout(() => {
                document.getElementById('districtContainer').children[0].style.display = 'block';
                window.scrollTo(0, document.body.scrollHeight);
            }, 200);
        }
        else {

            setDistricts([]);
            setSelectedRegion(null);
            document.getElementById('selectAllDistCbox').checked = false;

            toggleDistrictShow(false);
            toggleAlertShow(false);
            toggleDisasterDescShow(false);

            setSelectedDistricts([]);
            setSelectedAlert({ disasterAlertId: null, disasterDesc: null });
            setDisasterDesc(null);

            document.getElementById('districtContainer').children[0].style.display = 'none';
            document.getElementById('alertSelectBar').selectedIndex = 0;
            
            document.getElementById('weatherType').selectedIndex = 0;
            document.getElementById('durationFrom').value = null;
            document.getElementById('durationTo').value = null;
            document.getElementById('impactObject').selectedIndex = 0;
            document.getElementById('impactType').selectedIndex = 0;
            document.getElementById('impactSeverity').selectedIndex = 0;
            document.getElementById('alertTextArea').value = null;
            document.getElementById('alertContainer').children[0].style.display = 'none';
            document.getElementById('disasterDescContainer').children[0].style.display = 'none';
            document.getElementById('disasterDescTextArea').value = null;

            for (var i = 0; i < regionCbox.length; i++) {
                regionCbox[i].checked = false;
            }

            setTimeout(() => {
                document.getElementById('districtContainer').style.display = 'none';
                document.getElementById('alertContainer').style.display = 'none';
                document.getElementById('saveContainer').style.display = "none";
                document.getElementById('disasterDescContainer').style.display = 'none';
            }, 200);
        }

    }


    const selectAllDistricts = (event) => {

        selectedDistrictArr = [];
        setSelectedDistricts(selectedDistrictArr);

        let districtCbox = document.getElementsByClassName('districtCbox');


        for (var i = 0; i < districtCbox.length; i++) {

            districtCbox[i].checked = event.target.checked;


            let districtObj = districtArr[i];

            selectedDistrictArr.push(districtObj)
            setSelectedDistricts(selectedDistrictArr);


            if (event.target.checked == true) {

                document.getElementById('alertContainer').style.display = 'block';

                togglePreloader(true);

                getAlerts();

                toggleAlertShow(true);

                setTimeout(() => {
                    document.getElementById('alertContainer').children[0].style.display = 'block';

                }, 200);

                scrollDown();
            }
            else {

                toggleAlertShow(false);
                toggleDisasterDescShow(false);

                setSelectedAlert({ disasterAlertId: null, disasterDesc: null });
                setDisasterDesc(null);

                document.getElementById('alertContainer').children[0].style.display = 'none';
                document.getElementById('alertSelectBar').selectedIndex = 0;
                document.getElementById('weatherType').selectedIndex = 0;
                document.getElementById('durationFrom').value = null;
                document.getElementById('durationTo').value = null;
                document.getElementById('impactObject').selectedIndex = 0;
                document.getElementById('impactType').selectedIndex = 0;
                document.getElementById('impactSeverity').selectedIndex = 0;
                document.getElementById('alertTextArea').value = null;
                document.getElementById('disasterDescContainer').children[0].style.display = 'none';
                document.getElementById('disasterDescTextArea').value = null;

                setTimeout(() => {
                    document.getElementById('alertContainer').style.display = 'none';
                    document.getElementById('disasterDescContainer').style.display = 'none';
                    document.getElementById('saveContainer').style.display = "none";
                    document.getElementById('disasterDescContainer').style.display = 'none';
                }, 200);
            }

        }

    }

    const scrollDown = () => {
        setTimeout(() => {
            const pageWrapper = document.window//getElementsByClassName('pageWrapper')[0];
            //const scrollToHeight =  document.window.scrollHeight + 500;

            // pageWrapper.scrollTo({
            //     top: scrollToHeight,
            //     behavior: 'smooth'
            // });
            window.scrollTo({
                top: document.body.scrollHeight + 50,
                behavior: 'smooth'
            });

        }, 400);
    }

    const invokeAlert = async (districtObj) => {

        if (selectedDistrictArr.some(x => x.districtId == districtObj.districtId)) {
            selectedDistrictArr = selectedDistrictArr.filter(x => x.districtId != districtObj.districtId)
            setSelectedDistricts(selectedDistrictArr);
        }
        else {
            selectedDistrictArr.push(districtObj)
            setSelectedDistricts(selectedDistrictArr);
        }


        if (selectedDistrictArr.length < document.getElementsByClassName('districtCbox').length) {
            document.getElementById('selectAllDistCbox').checked = false;
        }
        else {
            document.getElementById('selectAllDistCbox').checked = true;
        }

        if (selectedDistrictArr.length > 0) {

            document.getElementById('alertContainer').style.display = 'block';

            togglePreloader(true);

            getAlerts();

            toggleAlertShow(true);

            setTimeout(() => {
                document.getElementById('alertContainer').children[0].style.display = 'block';

            }, 200);

            scrollDown();
        }
        else {

            toggleAlertShow(false);
            toggleDisasterDescShow(false);

            setSelectedAlert({ disasterAlertId: null, disasterDesc: null });
            setDisasterDesc(null);

            document.getElementById('alertContainer').children[0].style.display = 'none';
            document.getElementById('alertSelectBar').selectedIndex = 0;
            
            document.getElementById('weatherType').selectedIndex = 0;
            document.getElementById('durationFrom').value = null;
            document.getElementById('durationTo').value = null;
            document.getElementById('impactObject').selectedIndex = 0;
            document.getElementById('impactType').selectedIndex = 0;
            document.getElementById('impactSeverity').selectedIndex = 0;
            document.getElementById('alertTextArea').value = null;
            document.getElementById('disasterDescContainer').children[0].style.display = 'none';
            document.getElementById('disasterDescTextArea').value = null;

            setTimeout(() => {
                document.getElementById('alertContainer').style.display = 'none';
                document.getElementById('disasterDescContainer').style.display = 'none';
                document.getElementById('saveContainer').style.display = "none";
                document.getElementById('disasterDescContainer').style.display = 'none';
            }, 200);
        }
    }

    const invokeDisasterDesc = (event, key) => {
        if (key == "alertType") {
            let alertType = alertArr.find(x => x.disasterAlertId == event.target.value).disasterAlertId;
            selectedAlert.disasterAlertId = alertType;
        }
        else if (key == "alertDesc") {
            selectedAlert.alertDescription = event.target.value;
        }
        else if (key == "weatherType") {
            selectedAlert.weatherType = event.target.value;
            if(parseInt(selectedAlert.weatherType) == 4 || parseInt(selectedAlert.weatherType) == 5){
                setSliderToggle(true);
            }
            else{
                setSliderToggle(false);
            }
        }
        else if (key == "durationFrom") {
            selectedAlert.durationFrom = event.target.value;
        }
        else if (key == "durationTo") {
            selectedAlert.durationTo = event.target.value;
        }
        else if (key == "impactObject") {
            selectedAlert.impactObjects = event.target.value;
        }
        else if (key == "impactType") {
            selectedAlert.impactType = event.target.value;
        }
        else if (key == "impactSeverity") {
            selectedAlert.impactSeverity = event.target.value;
        }

        setSelectedAlert(selectedAlert);

        if (selectedAlert.disasterAlertId && selectedAlert.alertDescription && selectedAlert.weatherType && selectedAlert.durationFrom && selectedAlert.durationTo
            && selectedAlert.impactObjects && selectedAlert.impactType && selectedAlert.impactSeverity) {

            document.getElementById('disasterDescContainer').style.display = 'block';

            toggleDisasterDescShow(true);

            setTimeout(() => {
                document.getElementById('disasterDescContainer').children[0].style.display = 'block';
            }, 200);

            scrollDown();
        }
        else {
            document.getElementById('disasterDescContainer').children[0].style.display = 'none';
            document.getElementById('disasterDescContainer').style.display = 'none';
            toggleDisasterDescShow(false);
        }
    }

    const invokeSave = (event) => {
        if (event.target.value) {
            setDisasterDesc(event.target.value);
            document.getElementById('saveContainer').style.display = 'block';
        }
        else {

            setDisasterDesc(null);
            document.getElementById('saveContainer').style.display = 'none';
        }
    }

    const saveDisaster = () => {
        togglePreloader(true);
        console.log(selectedRegion);

        for (var data of selectedRegion) {
            const disaster = {
                regionId: data.regionId,
                districtId: selectedDistrictArr.filter(x=>x.regionId == data.regionId).map(x => x.districtId),
                disasterAlertId: selectedAlert.disasterAlertId,
                weatherType: selectedAlert.weatherType,
                impactObject: selectedAlert.impactObjects,
                impactType: selectedAlert.impactType,
                impactSeverity: selectedAlert.impactSeverity,
                durationFrom: new Date(selectedAlert.durationFrom).toISOString(),
                durationTo: new Date(selectedAlert.durationTo).toISOString(),
                alertDescription: selectedAlert.alertDescription,
                disasterDescription: disasterDesc
            }

            _axios("post", "Disasters/PostDisaster", disaster).then((res) => {
                if (res.data.regionId) {
                }
            },
                (error) => {
                    togglePreloader(false);
                    toast.error("Something went wrong !");
                    return;
                });
        }

        
        toast.success("Disaster Registered");
        togglePreloader(false);
        setSelectedRegion([]);
        invokeDistricts(null);
    }

    const getTempValue = (val) => {
        return val;
    }

    return (
        <div className="pageWrapper">
            <Preloader togglePreloader={preloader} />
            <div className="headerContainerWrapper">
                <div className="headerContainer">
                    <span className="mr-2"><RiFileEditFill /> </span>  Disaster Registration
                </div>
            </div>

            <form className="entryForm mt-4" style={{ height: 250 }}>
                <div className="text-xl font-semibold w-full border-b-2 border-emerald-600 mb-8 py-2">Select Region</div>
                <div className="grid grid-cols-4 gap-4">
                    {
                        regionsArr != null && regionsArr.length > 0 ?
                            regionsArr.map(x =>
                                <div>
                                    <input className="regionCbox" onInput={(event) => { invokeDistricts(event.target.checked ? x : null) }} type="checkbox" />
                                    <label>{x.regionName}</label>
                                </div>
                            ) : <span />
                    }
                </div>
            </form>

            <animated.div className="entryForm hidden mt-4 relative overflow-y-auto" style={districtProps} id="districtContainer">

                <div style={{ display: 'none' }}>
                    <div className="text-xl font-semibold w-full border-b-2 border-emerald-600 mb-8 py-2 flex w-full">
                        <div>Select District</div>
                        <div className="ml-auto">
                            <input id="selectAllDistCbox" onChange={selectAllDistricts} type="checkbox" />
                            <label className="font-normal text-base">Select All</label>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {
                            districtArr != null && districtArr.length > 0 ?
                                districtArr.map(x =>
                                    <div>
                                        <input onChange={() => invokeAlert(x)} className="districtCbox" type="checkbox" />
                                        <label>{x.districtName}</label>
                                    </div>
                                ) : <span />
                        }
                    </div>
                </div>

            </animated.div>

            <animated.div className="entryForm hidden mt-4 relative overflow-y-auto p-4" style={alertProps} id="alertContainer">

                <div style={{ display: 'none' }}>
                    <div className="text-xl font-semibold w-full border-b-2 border-emerald-600 mb-8 py-2 flex w-full">
                        Select Alert / Impact
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="flex flex-col">
                            <label>Alert Type</label>
                            <select id="alertSelectBar" onChange={(event) => invokeDisasterDesc(event, "alertType")}>
                                <option value={null} selected disabled>Select Alert Type</option>
                                {
                                    alertArr != null && alertArr.length > 0 ?
                                        alertArr.map(x =>
                                            <option value={x.disasterAlertId} onChange={(event) => invokeDisasterDesc(event, "alertType")}>{x.disasterAlertName}</option>
                                        ) : <option></option>
                                }
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label>Weather Type / Intensity</label>
                            <select id='weatherType' onChange={(event) => invokeDisasterDesc(event, "weatherType")}>
                                <option selected disabled value={null}>Select Weather Type</option>
                                {
                                    weatherTypeArr != null && weatherTypeArr.length > 0 ?
                                        weatherTypeArr.map(x =>
                                            <option value={x.weatherTypeId}>{x.weatherTypeName}</option>
                                        ) : <option></option>
                                }
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label>From Date / Time</label>
                                <input id='durationFrom' className="border border-2 border-gray-300 rounded-md shadow-md" style={{height: '3.3rem'}} onInput={(event) => invokeDisasterDesc(event, "durationFrom")} type="datetime-local" placeholder="From Date/Time" />
                            </div>
                            <div>
                                <label>To Date / Time</label>
                                <input id='durationTo' className="border border-2 border-gray-300 rounded-md shadow-md" style={{height: '3.3rem'}} onInput={(event) => invokeDisasterDesc(event, "durationTo")} type="datetime-local" placeholder="To Date/Time" />
                            </div>
                        </div>

                        <div className="col-span-3 px-4 mt-4">
                        {sliderToggle && (<label>Temperature Range</label>)}
                            {sliderToggle && (
                                <Slider
                                    getAriaLabel={() => 'Temperature range'}
                                    defaultValue={temperatureValue}
                                    getAriaValueText={getTempValue}
                                    step={1}
                                    valueLabelDisplay="auto"
                                    marks={tempMarks}
                                    className="w-full"
                                />
                            )}

                        </div>

                        <div className="flex flex-col">
                            <label>Impact On</label>
                            <select id='impactObject' onChange={(event) => invokeDisasterDesc(event, "impactObject")}>
                                <option value={null} selected disabled>Select Impact Object</option>
                                {
                                    impactObjectsArr != null && impactObjectsArr.length > 0 ?
                                        impactObjectsArr.map(x =>
                                            <option value={x.impactObjectId}>{x.impactObjectName}</option>
                                        ) : <option></option>
                                }
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label>Impact Type</label>
                            <select id='impactType' onChange={(event) => invokeDisasterDesc(event, "impactType")}>
                                <option value={null} selected disabled>Select Impact Type</option>
                                {
                                    impactTypesArr != null && impactTypesArr.length > 0 ?
                                        impactTypesArr.map(x =>
                                            <option value={x.impactTypeID}>{x.impactTypeName}</option>
                                        ) : <option></option>
                                }
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label>Impact Severity</label>
                            <select id="impactSeverity" onChange={(event) => invokeDisasterDesc(event, "impactSeverity")}>
                                <option value={null} selected disabled>Select Impact Severity</option>
                                {
                                    impactSeverityArr != null && impactSeverityArr.length > 0 ?
                                        impactSeverityArr.map(x =>
                                            <option value={x.impactSeverityId}>{x.impactSeverityName}</option>
                                        ) : <option></option>
                                }
                            </select>
                        </div>

                        <div className="flex flex-col col-span-3">
                            <label>Alert Description</label>
                            <textarea id="alertTextArea" onInput={(event) => invokeDisasterDesc(event, "alertDesc")} className="h-44 p-2 rounded-md shadow-md border-2 border-gray-200" placeholder="Provide Alert Description"></textarea>
                        </div>

                    </div>
                </div>

            </animated.div>




            <animated.div className="entryForm hidden mt-4 relative overflow-y-auto" style={disasterDescProps} id="disasterDescContainer">

                <div style={{ display: 'none' }}>
                    <div className="text-xl font-semibold w-full border-b-2 border-emerald-600 mb-8 py-2 flex w-full">
                        Disaster Description
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <textarea id="disasterDescTextArea" onInput={(event) => invokeSave(event)} className="h-44 p-2 rounded-md shadow-md border-2 border-gray-200" placeholder="Provide Disaster Description"></textarea>
                    </div>
                </div>


                <animated.button onClick={saveDisaster} className="bg-emerald-800 p-2 rouned-md text-center w-24 mt-4 ml-auto rouned-md shadow-md text-white text-semibold hidden hover:cursor-pointer hover:bg-transparent hover:text-emerald-600 focus:bg-transparent focus:text-emerald-600 focus:outline-none focus:border-emerald-600 duration-300 border-2 border-emerald-600" style={saveBtnProps} id="saveContainer">
                    Save
                </animated.button>


            </animated.div>

        </div>
    )
}