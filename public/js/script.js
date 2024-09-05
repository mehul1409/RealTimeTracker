const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords;
        socket.emit("send-location",{latitude,longitude});
    },(error)=>{
        console.error(`Error: ${error}`);
    },
    {
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:5000
    });
}

const map = L.map("map").setView([0,0],16);

L.tileLayer("https://tile.openstreetmap.de/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap",
}).addTo(map)

const markers = {};

console.log(markers);

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnect",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})