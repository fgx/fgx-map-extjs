/*global Ext: false, console: false, FGx: false */


Ext.define("FGx.map.MapBasic", {

extend: "FGx.map.MapCore", 


get_bookmark_button: function(){
		if(!this.xBookMarkButton){
		this.xBookMarkButton = Ext.create("Ext.Button", {
			text: "Bookmark",
			iconCls: "icoBookMarkAdd",
			scope: this,
			handler: function(){
				var d = Ext.create("FGx.bookmark.BookMarkDialog", {bookmark_pk: 0});
				d.run_show();
				
			}
		});
	}
	return this.xBookMarkButton;
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
	
	//console.log(">> MapPanel.constructor", this.xConfig);
	//return;
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
	//console.log(ll.xFlag, ll.x, ll.y, config);
	Ext.apply(this, {
		
		fgxType: "MapPanel",
		ssiconCls: "icoMap",
		frame: false, plain: true,border: 0,	bodyBorder: false,

		//layers: this.get_layers(),
		//xFlightsStore: this.get_store(),
		tbar: [
		
			//== Map Type  
			{xtype: 'buttongroup', 
				title: 'Base Layer',
				columns: 1,
				items: [
					{text: "Light", iconCls: "icoYellow", width: 90, 
						id: this.getId() + "map-base-button",
						menu: [
							//{text: "Relief", group: "map_core", checked: false, xiconCls: "icoBlue",
							//   xLayer: "Reliefs", handler: this.on_base_layer, scope: this, group: "xBaseLayer"
							//},
							{text: "Outline", group: "map_core", checked: false, xiconCls: "icoBlue",
								xLayer: "Landmass", handler: this.on_base_layer, scope: this, group: "xBaseLayer"
							},
							{text: "Normal", group: "map_core", checked: false, xiconCls: "icoGreen",
								xLayer: "OSM", handler: this.on_base_layer, scope: this, group: "xBaseLayer"
							},
							{text: "Light", group: "map_core", checked: true,  xiconCls: "icoYellow",
								xLayer: "Light", 
								handler: this.on_base_layer, scope: this, group: "xBaseLayer"
							}
						]
					}
				]   
			},
			
			{xtype: 'buttongroup',
				title: 'Navigation Aids',
				columns: 5,
				items: [
					{xtype: "splitbutton", text: "VOR", pressed: false, enableToggle: true,  iconCls: "icoOff", navaid: "VOR", 
						toggleHandler: this.on_nav_toggled, scope: this,
						menu: {
							items: [
								{text: "Show range - TODO", checked: false, disabled: true}
							]
						}
					},
					{xtype: "splitbutton", text: "DME", enableToggle: true,  iconCls: "icoOff", navaid: "DME", 
						toggleHandler: this.on_nav_toggled,  scope: this,
						menu: {
							items: [
								{text: "Show range - TODO", checked: false, disabled: true}
							]
						}
					},
					{text: "NDB&nbsp;", enableToggle: true, iconCls: "icoOff", navaid: "NDB", 
						toggleHandler: this.on_nav_toggled, scope: this
					},
					{text: "Fix&nbsp;&nbsp;&nbsp;", enableToggle: true, iconCls: "icoOff", navaid: "FIX", 
						toggleHandler: this.on_nav_toggled, scope: this
					}
					//{text: "VORTAC", enableToggle: true, iconCls: "icoOff", navaid: "NDB", 
					//	toggleHandler: this.on_nav_toggled, scope: this,
					//	hidden: true, id: "fgx-vortac"
					//}
				]   
			},
			{xtype: 'buttongroup', disabled: false,
				title: 'Airports', 
				columns: 6,
				items: [
					{text: "Airports", enableToggle: true, iconCls: "icoOff", apt: "Airport", 
						toggleHandler: this.on_apt_toggled, scope: this},
					{text: "Seaports", enableToggle: true, iconCls: "icoOff", apt: "Seaport", 
						toggleHandler: this.on_apt_toggled, scope: this},
					{text: "Heliports", enableToggle: true, iconCls: "icoOff", apt: "Heliport", 
						toggleHandler: this.on_apt_toggled, scope: this},
					//{text: "Minor", enableToggle: true, iconCls: "icoOff", apt: "minor", toggleHandler: this.on_apt_toggled},
					//{text: "Small", enableToggle: true, iconCls: "icoOff", apt: "small", toggleHandler: this.on_apt_toggled},
					//{text: "Military", enableToggle: true, iconCls: "icoOff", apt: "military", toggleHandler: this.on_apt_toggled,
					//	hidden: true, id: "fgx-mil-airports"},
					//{text: "Seaports", enableToggle: true, iconCls: "icoOff", apt: "seaports", toggleHandler: this.on_apt_toggled},
					//{text: "Heliports", enableToggle: true, iconCls: "icoOff", apt: "heliports", toggleHandler: this.on_apt_toggled},
				]   
			},
			/*{xtype: 'buttongroup', 
				title: 'Utils', 
				columns: 2,
				items: [
					this.get_bookmark_button()
				]
			}*/
		],
		
		//== Bottom Toolbar
		bbar: [

			{text: "Zoom", tooltip: "Click for default zoom",
				zoom: 4, handler: this.on_zoom_to, scope: this
			},
			Ext.create("GeoExt.slider.Zoom", {
				map: this.get_map(),
				fgxName: "zoomSlider",
				aggressive: true,                                                                                                                                                   
				width: 100,
				//plugins: Ext.create("GeoExt.slider.Tip", {
				//	TODOtemplate: "<div>Zoom Level: {zoom}</div>"
				//})
			}),
			{text: "100", zoom: 6, handler: this.on_zoom_to, scope: this},
			{text: "30", zoom: 10, handler: this.on_zoom_to, scope: this},
			{text: "10", zoom: 14, handler: this.on_zoom_to, scope: this},
			{text: "&nbsp;5&nbsp;", zoom: 16, handler: this.on_zoom_to, scope: this},
			{text: "&nbsp;2&nbsp;",  zoom: 17, handler: this.on_zoom_to, scope: this},
			"-",
			{text: "Opacity", tooltip: "Click for default opacity"},
			Ext.create("GeoExt.slider.LayerOpacity", {
				//l//ayer: this.L.lite(),
				aggressive: true, 
				width: 80,
				isFormField: true,
				inverse: true,
				fieldLabel: "opacity",
				ssrenderTo: "slider",
				//plugins: Ext.create("GeoExt.slider.Tip", {TODOtemplate: '<div>Transparency: {opacity}%</div>'})
			}),
			"-",
			{text: "Graticule", iconCls: "icoOff", enableToggle: true, pressed: false,
				scope: this, 
				toggleHandler: function(butt, checked){
					var grati = this.map.getControlsBy("fgxName","graticule")[0];
					if(checked){
						grati.activate();
					}else{
						grati.deactivate();
					}
					butt.setIconCls( checked ? "icoGreen" : "icoOff" );
				}
			},
			"-",
			"->",
			{text: "Lat: "}, {xtype: "displayfield", name: "lat", width: 100, value: "-"}, 
			{text: "Lon: "}, {xtype: "displayfield", name: "lon", width: 100, value: "-"}, 
			"-",
			{text: "DEV", scope: this,
				handler: function(){
					console.log(this.get_map().getExtent())
				}
			}
		
		]
	
	});

	this.callParent();
	
	//this.map.addLayer( make_base_layer("Light") );
	//this.set_base_layer("Light");
	
	//== Add the layers here
	var xLayers = ['VOR','DME','NDB','FIX', "Airport", "Seaport", "Heliport"];
	for(var i = 0; i< xLayers.length; i++){
		this.map.addLayer( make_wms_layer(xLayers[i]) );
	}
	
	this.map.addControl( 
		new OpenLayers.Control.Graticule({
			fgxName: "graticule",
			numPoints: 1, 
			autoActivate: false,
			labelled: true,
			lineSymbolizer:{strokeColor: "grey", strokeWidth: 1, strokeOpacity: 0.3},
			// WTF below dont work !
			labelSymbolizer:{strokeColor: "red", strokeWidth: 1, strokeOpacity: 0.5}
		}) 
	);
	
	this.map.events.register("mousemove", this, function (e) {
			var pos = this.map.getLonLatFromPixel(e.xy);
			pos.transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
			this.down("displayfield[name=lat]").setValue(pos.lat);
			this.down("displayfield[name=lon]").setValue(pos.lon);
	});

}, //< initComponent()



on_base_layer: function(butt, checked){
	//console.log(butt.xLayer);
	var bbButton = Ext.getCmp( this.getId() + "map-base-button");
	//if(checked){
	this.set_base_layer(butt.xLayer);
	//}
	bbButton.setIconCls(butt.xiconCls);
	bbButton.setText(butt.text);
},

on_nav_toggled: function(butt, checked){
	butt.setIconCls( checked ? "icoOn" : "icoOff" );
	this.map.getLayersByName(butt.navaid)[0].setVisibility(checked);
},

on_apt_toggled: function(butt, checked){
 	butt.setIconCls( checked ? "icoOn" : "icoOff" );
	this.map.getLayersByName(butt.apt)[0].setVisibility(checked);
},
		   
on_civmil_mode: function(butt, checked){
 // TODO
	console.log(butt.xCivMilMode);
	var show_mil = butt.xCivMilMode != "civilian";
	//Ext.getCmp("fgx-vortac").setVisible( show_mil )
	//Ext.getCmp("fgx-mil-airports").setVisible( show_mil )
},


on_zoom_to: function(butt){
	this.map.zoomTo( butt.zoom );
},


DEADpan_to: function(obj, zoom){
	var lonLat = new OpenLayers.LonLat(obj.lon, obj.lat
			).transform(this.get_display_projection(),  this.get_map().getProjectionObject() );
	
	this.map.setCenter(lonLat, zoom);
	
},

update_radar: function(recs){
	this.L.radarBlip.removeAllFeatures();
	this.L.radarLbl.removeAllFeatures();
	var recs_length = recs.length;
	for(var i = 0; i < recs_length; i++){
		var rec = recs[i];
		this.show_radar (rec.get("callsign"), rec.get("lat"), rec.get("lon"), rec.get("hdg"), rec.get("alt_ft") );
	};
},

//==========================================================
// Shows aircraft on the RADAR map, with callsign (two features, poor openlayer)
show_radar: function show_radar(mcallsign, mlat, mlon, mheading, maltitude){

	// remove xisting iamge/label if exist
	/*
	var existing_img = radarImageMarkers.getFeatureBy("_callsign", mcallsign);
	if(existing_img){
		radarImageMarkers.removeFeatures(existing_img);
	}
	var existing_lbl  = radarLabelMarkers.getFeatureBy("_callsign", mcallsign);
	if(existing_lbl){
		radarLabelMarkers.removeFeatures(existing_lbl);
	}
	*/
	//c//onsole.log(mcallsign, mlat, mlon, mheading, maltitude)
	var pointImg = new OpenLayers.Geometry.Point(mlon, mlat
						).transform(this.get_display_projection(), this.get_map().getProjectionObject() );	
	//if(!this.get_map().getExtent().containsPixel(pointImg, false)){
		//return; //alert(map.getExtent().containsLonLat(pointImg, false));
	//}

	// Add Image
	var imgFeat = new OpenLayers.Feature.Vector(pointImg, {
				hdg: mheading
				}); 
	imgFeat._callsign = mcallsign;
	this.L.radarBlip.addFeatures([imgFeat]);	
	//console.log(mcallsign, mlat, mlon, mheading, maltitude);
	
	var gxOff = 4;
	var gyOff = -8;

	var lxOff = 6;
	var lyOff = 2;
	
	// move the label offset
	if(mheading > 0  && mheading < 90){
		lyOff = lyOff - 15;
		gyOff = gyOff  + 15 ;
	}else if( mheading > 90 && mheading < 150){
		lyOff = lyOff + 5;
		gyOff = gyOff - 5;
	}else if( mheading > 270 && mheading < 360){
		lyOff = lyOff - 10;
		gyOff = gyOff  + 10;
		
	}

	// Add callsign label as separate feature, to have a background color (graphic) with offset
	var pointLabel = new OpenLayers.Geometry.Point(mlon, mlat
					).transform(this.get_display_projection(),  this.get_map().getProjectionObject() );
	var lblFeat = new OpenLayers.Feature.Vector(pointLabel, {
                callsign: mcallsign,
				lxOff: lxOff, lyOff: lyOff,
				gxOff: gxOff, gyOff: gyOff
				});
	lblFeat._callsign = mcallsign;
	this.L.radarLbl.addFeatures([lblFeat]);	
	
},

on_goto: function(butt){
	//var lonLat = new OpenLayers.LonLat(butt.lon, butt.lat
	//		).transform(this.get_display_projection(),  this.get_map().getProjectionObject() );
	this.fireEvent("OPEN_MAP", butt.text, true, butt.lon, butt.lat, butt.zoom);
},

load_tracker: function(tracks){
	
	this.L.track.removeAllFeatures();
	var trk_length = tracks.length;
	var points = [];
	//var points;
	var p;
	for(var i =0; i < trk_length; i++){
		p = tracks[i];
		points.push(
				new OpenLayers.Geometry.Point(p.lon, p.lat
					).transform(this.get_display_projection(),  this.get_map().getProjectionObject() )
			  );
	}
	var line = new OpenLayers.Geometry.LineString(points);

	var style = { 
		strokeColor: '#000066', 
		strokeOpacity: 0.5,
		strokeWidth: 1
	};

	//var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
	this.L.track.addFeatures([ new OpenLayers.Feature.Vector(line, null, style) ]);
	this.get_map().zoomToExtent(this.L.track.getDataExtent()); 
	this.get_map().zoomOut();
	
},

load_flight_plan: function(recs){
	//console.log("FP", recs);
	this.L.fpLine.removeAllFeatures();
	this.L.fpLbl.removeAllFeatures();
	
	var lenny = recs.length;
	var fpoints = [];
	var idx_dic = {};
	var navLabels = [];
	for(var i = 0; i < lenny; i++){
		var r = recs[i].data;
		if(r.lat && r.lon){
			var navPt = new OpenLayers.Geometry.Point(r.lon, r.lat
					).transform(this.get_display_projection(),  this.get_map().getProjectionObject() );
			var lbl = new OpenLayers.Feature.Vector(navPt);
			lbl.attributes = r;
			navLabels.push(lbl);
			//this.fpLabelsLayer.addFeatures( [lbl] );
			var ki =  r.idx;
			if(!idx_dic[ki]){
				idx_dic[ki] = {count: 0, points: []}
			}
			idx_dic[ki].count =  idx_dic[ki].count + 1;
			idx_dic[ki].points.push(r);
		}
	}
	//console.log(idx_dic);
	
	//var lines
	var line_points = [];
	for(var r in idx_dic){
		//console.log(r, idx_dic[r]);
		if(idx_dic[r].count == 1){
			line_points.push(idx_dic[r].points[0]);
		}
	}
	
	var trk_length = line_points.length;
	var points = [];
	//var points;
	var p;
	//console.log(line_points);
	for(var i = 0; i < trk_length; i++){
		p = line_points[i];
		points.push(
				new OpenLayers.Geometry.Point(p.lon, p.lat
					).transform(this.get_display_projection(),  this.get_map().getProjectionObject() )
			  );
	}
	var line = new OpenLayers.Geometry.LineString(points);

	var style = { 
		strokeColor: '#0000ff', 
		strokeOpacity: 0.3,
		strokeWidth: 1
	};

	var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
	this.L.fpLine.addFeatures([lineFeature]);
	this.L.fpLbl.addFeatures( navLabels );
	this.get_map().zoomToExtent(this.L.fpLbl.getDataExtent()); 
	//this.get_map().zoomOut();
	
	
	return line_points;
	
},
DEADshow_blip: function(obj){
	//console.log("L=", this.L);
	return;
	this.L.blip.removeAllFeatures();
	var lonLat = new OpenLayers.LonLat(obj.lon, obj.lat
		).transform(this.get_display_projection(),  this.get_map().getProjectionObject() );

	this.get_map().panTo( lonLat );
	this.get_map().zoomTo( 10 );
	
	
	var pt =  new OpenLayers.Geometry.Point(obj.lon, obj.lat
				).transform(this.get_display_projection(), this.get_map().getProjectionObject() );	
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
		fillOpacity: 0.8 };
	var feature = new OpenLayers.Feature.Vector(circle, null, style);
	this.L.blip.addFeatures([feature]);
},

load_airway: function(recs){
	//console.log("LOADAIRWAY", recs);
	this.L.awyLine.removeAllFeatures();
	this.L.awyLbl.removeAllFeatures();
	
	var lenny = recs.length;
	var fpoints = [];
	var idx_dic = {};
	
	var used = {};
	for(var i = 0; i < lenny; i++){
		var r = recs[i].data;
			
		
			if( !used[r.ident_entry] ){
				//console.log("not exists entry", r.ident_entry);
				used[r.ident_entry] = {lat: r.lat1, lon: r.lon1, ident: r.ident_entry}
			}
			if( !used[r.ident_exit] ){
				//console.log("not exists exit", r.ident_exit);
				used[r.ident_exit] = {lat: r.lat2, lon: r.lon2, ident: r.ident_exit}
			}
			
			
		//if(r.lat && r.lon){
			
			//#navLabels.push(lbl);
			//this.l.awylbl.addFeatures( [lbl] );
			//var ki =  r.idx;
			//if(!idx_dic[ki]){
			//	idx_dic[ki] = {count: 0, points: []}
			//}
			//idx_dic[ki].count =  idx_dic[ki].count + 1;
			//idx_dic[ki].points.push(r);
		//}
	}
	//console.log("used=", used)
	//var lblPoints = [];
	var navLabels = [];
	var r;
	for(var ki in used){
			r = used[ki]
			//console.log(r.ident, r);
			var navPt = new OpenLayers.Geometry.Point(r.lon, r.lat
					).transform(this.get_display_projection(),  this.get_map().getProjectionObject() );
			var lbl = new OpenLayers.Feature.Vector(navPt);
			lbl.attributes = r;
			//navLabels.push(lbl);
			this.L.awyLbl.addFeatures( [lbl] );
	}
	
	//console.log("navLabels=", navLabels)		
	//var trk_length = line_points.length;
	
	//var points;
	
	
	var style = { 
		strokeColor: 'red', 
		strokeOpacity: 0.4,
		strokeWidth: 2
	};
	
	var points = [];
	var p;
	//console.log(line_points);
	for(var i =0; i < lenny; i++){
		p = recs[i].data;
		points = [];
		//console.log(p.lat1, p.lon1, p.lat2, p.lon2);
		points.push(
				new OpenLayers.Geometry.Point(p.lon1, p.lat1
					).transform(this.get_display_projection(),  this.get_map().getProjectionObject() )
		);
		points.push(
				new OpenLayers.Geometry.Point(p.lon2, p.lat2
					).transform(this.get_display_projection(),  this.get_map().getProjectionObject() )
		);
		var line = new OpenLayers.Geometry.LineString(points);
		var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
		this.L.awyLine.addFeatures([lineFeature]);
	}
	
	this.get_map().zoomToExtent(this.L.awyLbl.getDataExtent()); 
	//this.get_map().zoomOut();
	
	
	
}

});
