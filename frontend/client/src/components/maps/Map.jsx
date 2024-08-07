import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMapEvents,
  } from "react-leaflet"
  import "leaflet/dist/leaflet.css"
  import { memo } from "react"
  
  const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  
  const Map = ({
    center = [10.7763897, 106.7011391],
    address = "",
    zoom = 12,
  }) => {
    return (
      <>
        {center && (
          <MapContainer
            center={center}
            key={JSON.stringify(center)}
            zoom={zoom}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer url={url} attribution={attribution} />
            {center && (
              <Marker position={center}>
                <Popup>
                  <b>{address}</b>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
        {!center && <span>Bản đồ bị lỗi</span>}
      </>
    )
  }
  
  export default memo(Map)
  