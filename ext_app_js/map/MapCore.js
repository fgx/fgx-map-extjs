/*global Ext: false, console: false, FGx: false */


Ext.define("FGx.map.MapCore", {

extend: "GeoExt.panel.Map", 

L: {blip: null, line: null},

get_display_projection: function(){
	return new OpenLayers.Projection("EPSG:4326");
},



get_map: function(){
	if(!this.xxxxMap){
		this.xxxxMap =  new OpenLayers.Map({
			allOverlays: false,
			units: 'm',
			// this is the map projection here
			projection: new OpenLayers.Projection("EPSG:3857"), // this.get_projection(),
			//sphericalMercator: true,
			
			// this is the display projection, I need that to show lon/lat in degrees and not in meters
			displayProjection: this.get_display_projection(),
			
			// the resolutions are calculated by tilecache, when there is no resolution parameter but a bbox in
			// tilecache.cfg it shows you resolutions for all calculated zoomlevels in your browser: 
			// by http://yoururltothemap.org/tilecache.py/1.0.0/layername/ etc.
			// (This would not be necessary for 4326/900913 because this values are widely spread in
			// openlayer/osm/google threads, you will find the resolutions there)
			resolutions: [
				//156543.03390625, 
				//78271.516953125, 
				//39135.7584765625, 
				19567.87923828125, 
				9783.939619140625, 
				4891.9698095703125, 
				2445.9849047851562, 
				1222.9924523925781, 
				611.4962261962891, 
				305.74811309814453, 
				152.87405654907226, 
				76.43702827453613, 
				38.218514137268066, 
				19.109257068634033, 
				9.554628534317017, 
				4.777314267158508, 
				2.388657133579254, 
				1.194328566789627, 
				0.5971642833948135, 
				0.29858214169740677
			],
			
			// I set a max and min resolution, means setting available zoomlevels by default
			//maxResolution: 19567.87923828125, //156543.03390624999883584678,
			//minResolution: 0.29858214169740676658,
			
			// i.e. maxExtent for EPSG 3572 is derived by browsing the very useful map at
			// http://nsidc.org/data/atlas/epsg_3572.html. I tried to get this values with mapnik2 and
			// proj4, but the values I get back with box2d are not very useful at the moment
			maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
			
			//TODO make a config zoomlevels 0-13 = 14 levels ?
			zoomLevels: 17, 
			//layers: this.get_layers()
		});
	}
	return this.xxxxMap;
},





//======================================================
// Create the Layers
DEADget_layers: function(){
	this.L = {};
	this.L.lite = new OpenLayers.Layer.OSM.Mapnik( "Light" );
	this.L.lite.setOpacity(0.4);	
		
	this.L.blip = new OpenLayers.Layer.Vector("HighLight Markers");
	this.L.track = new OpenLayers.Layer.Vector("Track Lines Layer");	
	this.L.fpLine = new OpenLayers.Layer.Vector("Flight Plan Line");
	this.L.fpLbl = new OpenLayers.Layer.Vector("Flight Plan Labels", 
			{
                styleMap: new OpenLayers.StyleMap({'default':{
                    strokeColor: "black",
                    strokeOpacity: 1,
                    strokeWidth: 3,
                    fillColor: "#FF5500",
                    fillOpacity: 0.5,
                    pointRadius: 6,
                    pointerEvents: "visiblePainted",
                    // label with \n linebreaks
                    label : "${ident}",
                    
                    fontColor: "red",
                    fontSize: "12px",
                    fontFamily: "Courier New, monospace",
                    fontWeight: "bold",
                    labelAlign: "${align}",
                    labelXOffset: "${xOffset}",
                    labelYOffset: "${yOffset}",
                    labelOutlineColor: "white",
                    labelOutlineWidth: 3
                }})
                //renderers: renderer
            }
	);
	this.L.awyLine = new OpenLayers.Layer.Vector("Airway Line");
	this.L.awyLbl = new OpenLayers.Layer.Vector("Airway Labels", 
			{
                styleMap: new OpenLayers.StyleMap({'default':{
                    strokeColor: "black",
                    strokeOpacity: 1,
                    strokeWidth: 3,
                    fillColor: "red",
                    fillOpacity: 0.5,
                    pointRadius: 3,
                    pointerEvents: "visiblePainted",
                    // label with \n linebreaks
                    label : "${ident}",
                    
                    fontColor: "white",
                    fontSize: "12px",
                    fontFamily: "Courier New, monospace",
                    fontWeight: "bold",
                    //labelAlign: "${align}",
                    labelXOffset: "10",
                    labelYOffset: "10",
                    labelOutlineColor: "black",
                    labelOutlineWidth: 1
                }})
                //renderers: renderer
            }
	);
	this.L.radarBlip = new OpenLayers.Layer.Vector(
		"Radar Markers", 
		{styleMap: new OpenLayers.StyleMap({
				"default": {
					strokeColor: "lime",
					strokeWidth: 1,
					fillColor: "lime",

					externalGraphic: "/images/radar_blip2.png",
					graphicWidth: 8,
					graphicHeight: 24,
					graphicOpacity: 1,
					graphicXOffset: 0,
					graphicYOffset: -20,
					
					fontColor: "black",
					fontSize: "12px",
					fontFamily: "Helvetica, Arial, sans-serif",
					fontWeight: "bold",
					rotation : "${hdg}"
				},
				"select": {
					fillColor: "black",
					strokeColor: "yellow",
					pointRadius: 12,
					fillOpacity: 1
				}
			})
		}, {  visibility: true}
	);

	this.L.radarLbl =  new OpenLayers.Layer.Vector(
		"Radar Label", 
		{
			styleMap:  new OpenLayers.StyleMap({
				"default": {
					fill: true,
					fillOpacity: 1,
					fillColor: "black",
					strokeColor: "green",
					strokeWidth: 1,

					//graphic: false,
					externalGraphic: "/images/fgx-background-black.png",
					graphicWidth: 50,
					graphicHeight: 12,
					graphicOpacity: 0.8,
					graphicXOffset: "${gxOff}",
					graphicYOffset: "${gyOff}",
					
					
					fontColor: "white",
					fontSize: "10px",
					fontFamily: "sans-serif",
					fontWeight: "bold",
					labelAlign: "left",
					labelXOffset: "${lxOff}", 
					labelYOffset: "${lyOff}", 
					label : "${callsign}"
					//rotation : "${planerotation}",

				},
				"select": {
					fillColor: "black",
					strokeColor: "yellow",
					pointRadius: 12,
					fillOpacity: 1
				}

			})
		}
	);

	var LAYERS = [
		//=================================================
		// Overlay
		//=================================================
		/*new OpenLayers.Layer.WMS( 
			"Reliefs", 
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: ['N55W010','N55W005','N55E000','N55E005','N55E010','N55E015','N55E020','N55E025','N55E030',
					'N50W010','N50W005','N50E000','N50E005','N50E010','N50E015','N50E020','N50E025','N50E030',
					'N45W010','N45W005','N45E000','N45E005','N45E010','N45E015','N45E020','N45E025','N45E030',
					'N40W010','N40W005','N40E000','N40E005','N40E010','N40E015','N40E020','N40E025','N40E030',
					'N35W010','N35W005','N35E000','N35E005','N35E010','N35E015','N35E020','N35E025','N35E030'],
			format: 'image/png', 
			transparent: true,
			visibility: false
			},
			{
			maxResolution: 19567.87923828125, */   /* start zoom level 0 */
			/*minResolution: 152.87405654907226 */    /* stop zoom level 7 */
			/*}
			),	*/
		
		new OpenLayers.Layer.WMS(
			"DME",
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: "DME" , transparent: "True" , format: "image/png"}, 
			{ visibility: false}
		),
		new OpenLayers.Layer.WMS(
			"ILS Info",
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: "ILS_Info" , transparent: "True" , format: "image/png"}, 
			{visibility: false}
		),
		new OpenLayers.Layer.WMS(
			"Runway",
			"http://mapnik.fgx.ch:81/tilecache.py?",
				{layers: "Runway" , transparent: "True" , format: "image/png" 
				}, {  visibility: false}
		),
		new OpenLayers.Layer.WMS(
			"NDB",
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: "NDB" , transparent: "True" , format: "image/png" 
			}, {  visibility: false}
		),
		new OpenLayers.Layer.WMS(
			"ILS Marker",
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: "ILS_Marker" , transparent: "True" , format: "image/png" 
			}, {  visibility: false}
		),
		new OpenLayers.Layer.WMS(
			"Airport",
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: "Airport" , transparent: "True" , format: "image/png" 
			}, {  visibility: false}
		),
				  
		new OpenLayers.Layer.WMS(
			"Seaport",
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: "Seaport" , transparent: "True" , format: "image/png" 
			}, {  visibility: false}
		),
				  
		new OpenLayers.Layer.WMS(
		"Heliport",
		"http://mapnik.fgx.ch:81/tilecache.py?",
		{layers: "Heliport" , transparent: "True" , format: "image/png" 
		}, {  visibility: false}
		),
				  
		new OpenLayers.Layer.WMS(
			"ILS",
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: "ILS" , transparent: "True" , format: "image/png" 
			}, {  visibility: false}
		),
		new OpenLayers.Layer.WMS(
			"VOR",
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: "VOR" , transparent: "True" , format: "image/png" 
			}, {  visibility: false}
		),
		new OpenLayers.Layer.WMS(
			"FIX",
			"http://mapnik.fgx.ch:81/tilecache.py?",
			{layers: "FIX" , transparent: "True" , format: "image/png" 
			}, {  visibility: false}
		),
				  
		/* This works for a relief when it is 3857 projection, mapnik itself can do reprojection directly,
		but communication between tilecache and openlayers not. Has to be the same resolution. */
				  
		
				  
				  
		
		/// Underlays
		this.L.lite,
		new OpenLayers.Layer.OSM.Mapnik( "OSM" ),
		
		new OpenLayers.Layer.WMS(
			"Landmass",
			"http://mapnik.fgx.ch:81/tilecache.py?",
				{layers: "osm_coastline" , isBaselayer: "True", format: "image/png" 
				}, {  visibility: false}
		),
				  

				  
		
				  
		
		this.L.blip,
		this.L.track,
		this.L.radarLbl, this.L.radarBlip, 
		this.L.awyLbl, this.L.awyLine, 
		this.L.fpLbl, this.L.fpLine
		
	];
	//console.log("get_LAyers");
	return LAYERS;
},

get_store: function(){
	
	if(!this.xFlightsStore){
		this.xFlightsStore = Ext.StoreMgr.lookup("flights_store");
		this.xFlightsStore.on("load", function(sto, recs){
			//console.log("xFlightsStore.load");
			this.L.radarBlip.removeAllFeatures();
			this.L.radarLbl.removeAllFeatures();
			var i, r;
			var rec_len = recs.length;
			for(i=0; i < rec_len; i++){
				r = recs[i].data;
				this.show_radar(r.callsign, r.lat, r.lon, r.hdg, r.altitude);
			}
		}, this);
	}
	return this.xFlightsStore;
},
	
//===========================================================
initComponent: function() {
	
	var config = this.xConfig;
	
	var ll;
	if( config.lat && config.lon){
		ll =  new OpenLayers.Geometry.Point(config.lon, config.lat
			).transform(this.get_display_projection(), this.get_map().getProjectionObject() ); 
		ll.xFlag = "  SET:";
	}else{
		ll = new OpenLayers.LonLat(939262.20344, 5938898.34882);
		ll.xFlag = "DEAFAUT: "
	}

	Ext.apply(this, {
		DEADfgxType: "INHERITED MapCore",
		frame: false, border: false, bodyBorder: false,
		map: this.get_map(),
		center:  ll, 
		zoom:  5,
	});
	this.callParent();

	this.map.addLayer( make_base_layer("OSM") );
	this.set_base_layer("OSM");
	
	this.L.blip = new OpenLayers.Layer.Vector("Blip");
	this.map.addLayer(  this.L.blip );
	
	this.L.line = new OpenLayers.Layer.Vector("Line");	
	this.map.addLayer( this.L.line );
	
}, // << initComponent	


set_base_layer: function(layer_name){
	var layer = this.map.getLayersByName(layer_name)[0];
	this.map.setBaseLayer( layer );
},


pan_to: function(obj){
	var lonLat = new OpenLayers.LonLat(obj.lon, obj.lat
			).transform(this.get_display_projection(),  this.get_map().getProjectionObject() );
	this.map.setCenter(lonLat, zoom);
	
},

show_blip: function(obj){
	
	this.L.blip.removeAllFeatures();
	if(!obj){
		return;
	}
	var lonLat = new OpenLayers.LonLat(obj.lon, obj.lat
		).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:3857"));
	this.map.panTo( lonLat );
	
	var pt =  new OpenLayers.Geometry.Point(obj.lon, obj.lat
				).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:3857") );	
	var circle = OpenLayers.Geometry.Polygon.createRegularPolygon(
		pt,
			0, // wtf. .I want a larger cicle
			20
	);
	var style = {
		strokeColor: "red",
		strokeOpacity: 1,
		strokeWidth: 4,
		fillColor: "yellow",
		fillOpacity: 0.8 
	};
	var feature = new OpenLayers.Feature.Vector(circle, null, style);
	this.L.blip.addFeatures( [feature] );
}


});
