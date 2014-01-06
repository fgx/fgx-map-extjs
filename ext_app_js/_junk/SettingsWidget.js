Ext.namespace("FGx");

FGx.SettingsWidget = Ext.extend(Ext.Panel, {

tbw: 50,	
	
//===========================================================
//== Grid
constructor: function(config) {
	
	config = Ext.apply({
		title: 'Settings',
		iconCls: "icoSettings",
		xRunner: config.runner,
		sswidth: 500,
		tbar: [	//this.pilotsDataCountLabel
			{xtype: 'buttongroup',
				title: 'Set Multiplayer Refresh Secs',
				columns: 7,
				items: this.get_items(config.refresh_rate)
			}
		],
		
		items: [
			
		]
	}, config);
	
	FGx.SettingsWidget.superclass.constructor.call(this, config);
}, // Constructor	

get_items: function(refresh_rate){
	var items = [];
	var arr = [0, 2, 3, 4, 5, 10, 20];
	for(var i = 0; i < arr.length; i++){
		var x = arr[i];
		items.push({
			text: x == 0 ? "None" : x, 
			iconCls: refresh_rate == x ? "icoOn" : "icoOff", 
			enableToggle: true,   
			width: this.tbw,
			pressed: refresh_rate == x,
			toggleGroup: "ref_rate", 
			ref_rate: x, 
			toggleHandler: this.on_refresh_toggled,
			scope: this
		})
	}
	return items;
},


on_refresh_toggled: function(butt, checked){
	butt.setIconClass( checked ? "icoOn" : "icoOff");
	if(checked){
		var refresh_rate = parseInt(butt.ref_rate, 10);
		this.fireEvent("SET_REFRESH", refresh_rate);
	}
}

});
