

Ext.define("FGx.airport.AirportMapPanel",{

extend: "Ext.Panel", 
W: {
	
},

get_mini_map: function(){
	if(!this.xMiniMap){
		this.xMiniMap = Ext.create("FGx.map.MapMini", {
			region: "south", height: 250, collapsible: true, collapsed: true,
			ddflex: 1, xConfig: this.xConfig
		});
		
	};
	return this.xMiniMap;
},

get_main_map: function(){
	if(!this.xMapPanel){
		this.xMapPanel =  Ext.create("FGx.map.MapBasic", {
			xConfig: this.xConfig, flex: 1, region: "center"
		});
		//this.xMapPanel.get_map().events.register("moveend", this, this.on_map_moved );
	}
	
	return this.xMapPanel;
},
/*
on_map_moved: function(evt){
	
	
	var map = this.xMapPanel.get_map();
	if ( this.xMapPanel.get_map().getZoom() < 7 ){
		return;
	}
	var extent = map.getExtent()
	console.log("extent", extent, map.getZoom());
	
	var ll = extent.transform( new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
	//console.log("ll", ll);
	//return;
	Ext.Ajax.request({
		url: NAVDATA_SERVER + "/all.json?bbox=" + ll.left + "," + ll.bottom + "," + ll.right + "," + ll.top,
		method: "GET",
		scope: this,
		success: function(response, opts) {
			var data = Ext.decode(response.responseText);
			console.log(data);
			var map = this.xMapPanel.get_map()
			for( var a in data.rows) {
				console.log(data.rows[a]);
				map.add_airport(data.rows[a]);
			}
			
		},
		failure: function(response, opts) {
			console.log("FAIL");
		},
		
	})
},
*/
//======================================================
// Airport Panel
get_airport_panel: function(){
	if(!this.xAirportPanel){
		this.xAirportPanel =  Ext.create("FGx.airport.AirportPanel", {});
		/*this.xAirportsPanel.on("AIRPORT", function(apt){
			if(!apt){
				this.get_mini_map().show_blip(null);
				this.get_main_map().show_blip(null);
				return;
			}
			var r = {title: apt.apt_ident, lat: apt.apt_center_lat84, lon: apt.apt_center_lon84}
			this.get_mini_map().show_blip(r);
			this.get_main_map().show_blip(r);
			console.log(r);
		}, this); 
        */
	}
	return this.xAirportPanel;
},


	
//===========================================================
//== CONSTRUCT
initComponent: function(config) {
	
	//console.log("constr", this.xConfig);
	

	Ext.apply(this, {
		
		fgxType: "map_panel",
		iconCls: "icoMap",
		frame: false, border: false,	bodyBorder: false,
		
		layout: "border",
		items: [
			

			this.get_main_map(),	
				
			{region: 'east', width: 400, 
				collapsible: true,
				collapsed: false,
				frame: false,
				plain: true,
				border: 0,
				layout: "border",
				items: [
					{xtype: 'tabpanel', region: "center",
						frame: false,
						border: false,
						flex: 2,
						activeTab: 1,
						items: [
							this.get_airport_panel(),
							
						]
					},
					this.get_mini_map()
				]
			}
		]
	});
	this.callParent();
	
    this.fetch_airport(this.xConfig.apt_ident);
}, 

fetch_airport: function(apt_ident){
    Ext.Ajax.request({
        url: NAVDATA_SERVER + "/airport/" + apt_ident + ".json",
        method: "GET",
        scope: this,
        success: function(response, opts) {
            var data = Ext.decode(response.responseText);
            //console.log(data);
            var apt = data.airport;
            //return;
            for(var ki in data.sid){
                //console.log(ki);
                var wps = data.sid[ki].waypoints;
                this.get_main_map().add_sid(ki, wps);
            } 
            for(var ki in data.star){
                //console.log(ki);
                var wps = data.star[ki].waypoints;
                this.get_main_map().add_star(ki, wps);
            }
            //console.log(this.get_main_map().L.stars.getExtent());
            this.get_main_map().set_center(data.airport, 8);
            //this.get_main_map().map.zoomToExtent(this.get_main_map().L.stars.getExtent(), true);
        },
        failure: function(response, opts) {
            console.log('server-side failure with status code ' + response.status);
        }
        
    });
},

on_goto: function(butt){
	//var lonLat = new OpenLayers.LonLat(butt.lon, butt.lat
	//		).transform(this.get_display_projection(),  this.get_map().getProjectionObject() );
	this.fireEvent("OPEN_MAP", butt.text, true, butt.lon, butt.lat, butt.zoom);
}


});
