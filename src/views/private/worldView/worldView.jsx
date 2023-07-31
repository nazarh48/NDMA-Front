import appConfig from "../../../config/appConfig";
export default function WorldView() {
    return (
        <div style={{ width: '100vw', height: '100%', position: 'absolute' }}>
            <iframe src={appConfig.worldViewURL + '?v=53.92551902562246,21.126363034233517,86.76302992424885,37.22443966617732&s=70.2101,30.3143&t=2023-06-01-T16%3A53%3A49Z'} style={{ width: '100vw', height: '100vh', marginTop: '0' }}></iframe>
        </div>
    )
}