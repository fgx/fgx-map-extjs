
Ext.define("FGx.map.MapMini", {

extend: "FGx.map.MapCore",

//===========================================================
//== CONSTRUCT
initComponent: function() {
	
	//console.log("constr", config.title, config.lat, config.lon);
	var config = this.xConfig;
	var ll;
	if(config.lat || config.lon){
		ll =  new OpenLayers.Geometry.Point(config.lon, config.lat
			).transform(this.get_display_projection(), this.map.getProjectionObject() ); 
		ll.xFlag = "New";
	}else{
		ll = new OpenLayers.LonLat(939262.20344, 5938898.34882);
		ll.xFlag = "Default"
	}
	Ext.apply(this, {
		center:  ll
	});
	this.callParent();
		
	this.map.zoomTo(3);
	

},








});


