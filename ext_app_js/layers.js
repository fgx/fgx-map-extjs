
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
					"http://mapnik.fgx.ch:81/tilecache.py?",
					{layers: "osm_coastline" , isBaselayer: "True", format: "image/png"}, 
					{visibility: false}
		);
	}else if(label === "Light"){
		var L = new OpenLayers.Layer.OSM.Mapnik( "Light" );
		L.setOpacity(0.4);
		return L
	}
	return new OpenLayers.Layer.OSM.Mapnik( "OSM" );
}

//====================================================
//= Overlays and Gral specialz ;-)
function make_wms_layer(label, layer){
	if( !layer ){
		layer = label
	}
	return new OpenLayers.Layer.WMS(
			label,
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: layer , transparent: "True" , format: "image/png"}, 
			{visibility: false}
		);
}


