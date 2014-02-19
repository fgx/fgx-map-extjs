
//====================================================
//= Base Layers: Landmass, OSM, Light
function make_base_layer(label, layer){
	if( !layer ){
		layer = label
	}
	var L;
	if(label == "Landmass"){
		return new OpenLayers.Layer.WMS(
					"Landmass",
					//"http://mapnik.fgx.ch:81/tilecache.py?",
                    "http://localhost:8000?",
					{layers: "osm_coastline" , isBaselayer: "True", format: "image/png"}, 
					{visibility: false}
		);
	}else if(label === "Light"){
		var L = new OpenLayers.Layer.OSM.Mapnik( "Light" );
		L.setOpacity(0.4);
		return L
	}
	var layy = new OpenLayers.Layer.OSM.Mapnik( "OSM" );
    //console.log(layy);
	return layy
}

//====================================================
//= Overlays and Gral specialz ;-)
function make_wms_layer(label, layer){
	if( !layer ){
		layer = label
	}
	return new OpenLayers.Layer.WMS(
			label,
			//"http://mapnik.fgx.ch:81/tilecache.py?",
            "http://localhost:8000?",
			{layers: layer , transparent: "True" , format: "image/png",  DEADsrs: 'EPSG:3857',}, 
			{visibility: false}
		);
}


