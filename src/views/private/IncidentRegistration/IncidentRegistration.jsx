import { useState, useEffect } from "react";
import _axios from "../../../components/Axios";
import Preloader from "../../../components/Preloader";
import { RiFileEditFill } from 'react-icons/ri';
import { toast } from 'react-toastify';


export default function IncidentRegistration() {

    let [fileName, setFileName] = useState(null);

    let [preloader, togglePreloader] = useState(false);

    let [latitude, setLatitude] = useState(null);


    let [longitude, setLongitude] = useState(null);


    let [cityArr, setCityArr] = useState([]);


    useEffect(() => {
        getLocation();
        getCityData();
    }, []);



    const getCityData = () => {
        _axios("get", 'CityMasters/GetCityMaster').then((res) => {
            cityArr = res.data;
            setCityArr(cityArr);

        },
            (error) => {
                toast.error("Something went wrong, Cannot Get Cities!");
            });
    }

    const getFileName = (event) => {
        const file = event.target.files[0];
        const fileName = file.name;
        setFileName(fileName);
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setLatitude(latitude);
                    setLongitude(longitude);
                });
        }
        // else {
        //     fetch('https://api.ipify.org?format=json').then(
        //         resIp => resIp.json()
        //     ).then(d => {
        //         fetch(`https://ipapi.co/${d.ip}/json/`)
        //         .then(response => response.json())
        //         .then(data => {
        //             var latitude = data.latitude;
        //             var longitude = data.longitude;
        //             setLatitude(latitude);
        //             setLongitude(longitude);
        //         })
        //         .catch(error => {
        //             console.log("Error fetching location: " + error);
        //         });
        //     });

        //}
    }

    const sendIncident = () => {
        togglePreloader(true);
        let imgInput = document.getElementById('imageInput');
        let incidentDesc = document.getElementById('incidentDesc');
        if (imgInput && incidentDesc) {
            imgInput = imgInput.files[0];
            incidentDesc = incidentDesc.value;
        }

        if (imgInput && incidentDesc) {


            let incident = {
                Image: null,
                IncidentDescription: incidentDesc,
                Latitude: !document.getElementById('lat').value ? latitude : document.getElementById('lat').value,
                Longitude: !document.getElementById('long').value ? longitude : document.getElementById('long').value
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                incident.Image = event.target.result;

                _axios("post", 'Incidents/PostIncident', incident).then((res) => {
                    togglePreloader(false);
                    toast.success("Incident Reported");
                    document.getElementById("imageInput").value = null;
                    fileName = null;
                    setFileName(fileName);
                    document.getElementById('incidentDesc').value = null;
                    document.getElementById('citySelect').selectedIndex = 0;
                    document.getElementById('latContainer').style.display = 'none';

                    document.getElementById('lat').value = null;
                    document.getElementById('longContainer').style.display = 'none';

                    document.getElementById('long').value = null;

                    getLocation();

                },
                    (error) => {
                        togglePreloader(false);
                        toast.error("Something went wrong, Cannot Report Incident!");
                    });

                // Use the base64String as needed (e.g., send it in the request payload)
            };

            reader.readAsDataURL(imgInput);



        }
        else if (incidentDesc) {
            togglePreloader(false);
            toast.error("Please Add Image !");
        }
        else if (imgInput) {

            togglePreloader(false);
            toast.error("Please Add Incident Description !");
        }
        else {

            togglePreloader(false);
            toast.error("Please Add Incident Description and Image !");
        }
    }

    const invokeLatLong = (event) => {
        if (event.target.value) {
            document.getElementById("latContainer").style.display = "block";
            document.getElementById("longContainer").style.display = "block";
            let cityObj = cityArr.find(x => x.cityId == event.target.value);

            document.getElementById("lat").value = cityObj.lat;
            document.getElementById("long").value = cityObj.lng;

            latitude = cityObj.lat;
            longitude = cityObj.lng;
            setLatitude(latitude);
            setLongitude(longitude);
        }

    }

    return (
        <div className="pageWrapper">
            <Preloader togglePreloader={preloader} />
            {/* <div className="headerContainerWrapper">
                <div className="headerContainer">
                    <span className="mr-2"><RiFileEditFill /> </span>  Disaster Registration
                </div>
            </div> */}

            <form className="entryForm mt-24" style={{ height: 380 }}>
                <textarea id="incidentDesc" className="h-44 w-full border border-gray-500 rounded-md p-2" placeholder="Provide Incident Description"></textarea>

                <div className="flex mt-4 items-center">
                    <select id="citySelect" onChange={(event) => invokeLatLong(event)}>
                        <option value={null} selected disabled>Select City</option>
                        {
                            cityArr != null && cityArr.length > 0 ?
                                cityArr.map(x =>
                                    <option value={x.cityId}>{x.name}</option>
                                ) : <option></option>
                        }
                    </select>


                    <div id="latContainer" style={{ display: 'none' }}>
                        <label className="ml-4">Latitude:</label>
                        <input type='text' className="border border-gray-300 rounded-md shadow-md p-4 ml-2" id="lat" />
                    </div>

                    <div id="longContainer" style={{ display: 'none' }}>
                        <label className="ml-2">Longitude:</label>
                        <input type='text' className="border border-gray-300 rounded-md shadow-md p-4 ml-2" id="long" />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>

                    <label className="bg-emerald-800 p-2 rounded-md text-center mt-4 mr-auto rouned-md shadow-md text-white text-semibold hover:cursor-pointer hover:bg-transparent hover:text-emerald-600 focus:bg-transparent focus:text-emerald-600 focus:outline-none focus:border-emerald-600 duration-300 border-2 border-emerald-600" for="imageInput" class="custom-file-upload">
                        Add Image
                    </label>

                    {fileName && (<div>{fileName} uploaded</div>)}

                    <input className="border border-2 border-gray-300 rounded-md shadow-md" onInput={(event) => { getFileName(event) }} style={{ visibility: "hidden", width: '2px' }} type="file" id="imageInput" accept="image/*" />



                    <button onClick={sendIncident} type='button' className="bg-emerald-800 p-2  rouned-md text-center w-24 mt-4 ml-auto rouned-md shadow-md text-white text-semibold hover:cursor-pointer hover:bg-transparent hover:text-emerald-600 focus:bg-transparent focus:text-emerald-600 focus:outline-none focus:border-emerald-600 duration-300 border-2 border-emerald-600">
                        Send
                    </button>
                </div>
            </form>

        </div>
    )
}