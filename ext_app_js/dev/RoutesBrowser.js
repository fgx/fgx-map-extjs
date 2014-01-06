

//================================================================
Ext.define("FGx.dev.RoutesBrowser",  {

extend: "Ext.Panel",

//======================================================
grid_routes: function(){
	if(!this.gridRoutes){
		this.gridRoutes = Ext.create("Ext.grid.Panel", {
			region: 'center',
			title: "Urls",
			width: 200,
			store:  new Ext.data.JsonStore({
				fields: [	
					{name: "url", type:"string"},
					{name: "controller", type:"string"},
					{name: "action", type:"string"}
				],
				idProperty: "url",
				
				proxy: {
					type: "ajax",
					url: "/ajax/dev/routes",
					method: 'GET',
					reader: {
						type: "json",
						root: "routes"
					}
				},
				autoLoad: true
			}),
			viewConfig:{
				forceFit: true
			},
			columns: [ 
				{header: "Url", dataIndex: "url", flex:1, menuDisabled: true,
					renderer: function(val, meta, record, idx){
						meta.style = "font-weight: bold;"
						return val;
					}
				},
				{header: "Controller", dataIndex: "controller"},
				{header: "Action", dataIndex: "action"}
			],
			listeners:{
				scope: this,
				selectionchange: function(grid, selection, e){
					
				}
			}
		});
	}
	return this.gridRoutes;
},


initComponent: function() {
	
	Ext.apply(this, {
		layout: 'border',
		fgxType: "RoutesBrowser",
		title: "Routes",
		iconCls: "icoDatabase",
		activeTab: 0,
		items: [
			this.grid_routes(),
		]
	
	});
	this.callParent();
	
},

load:  function(){
	this.grid_routes().getStore().load();
}


});  //end class