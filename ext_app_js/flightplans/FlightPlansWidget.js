/*global Ext: false, console: false, FGx: false */


Ext.define("FGx.flightplans.FlightPlansWidget", {

extend: "Ext.Panel", 

group_renderer: function(v,u,r,rowIdx,colIdx, ds){
	//console.log(v, u, r, rowIdx, colIdx, ds);
	return r.get('idx') + ": " + r.get('ident');
},
	
get_flight_plan_grid: function(){
	if(!this.xFlightPlanGrid){
		this.xFlightPlanGrid = Ext.create("Ext.grid.GridPanel", {
			region: "east",
			sswidth: 400,
			ssheight: 100,
			flex: 1,
			frame: false, border: false,
			columns: [
				{header: 'idx', dataIndex:'idx', sortable: false, align: 'right',flex: 1,
						ssgroupRenderer: this.group_renderer, sshidden: true
				},
				{header: 'Ident', dataIndex:'ident', sortable: false, align: 'right',flex: 1,
					ssssgroupRenderer: this.group_renderer
				},
				{header: 'Lat', dataIndex:'lat', sortable: false, align: 'right', flex: 1
				},
				{header: 'Lon', dataIndex:'lon', sortable: false, align: 'right',flex: 1
				
				},
				{header: 'Type', dataIndex:'nav_type', sortable: false, align: 'right',flex: 1
				},
				{header: 'Freq', dataIndex:'freq', sortable: false, align: 'right',flex: 1
				},
			],
			features: [{ftype:'grouping'}],
			store: Ext.create("Ext.data.JsonStore", {
				sortInfo: {field: 'idx', direction: "ASC"},
				fields: [	
					{name: "uid", type:"int"},
					{name: "ident", type:"string"},
					{name: "idx", type:"int"},
					{name: "lat", type:"string"},
					{name: "lon", type:"string"},
					{name: "freq", type:"string"},
					{name: "nav_type", type:"string"}
				],
				idProperty: "uid",
				groupField:'idx',
				proxy: {
					type: "ajax",
					url: "/ajax/flightplan/__TODO__",
					method: 'GET',
					reader: {
						type: "json",
						root: "flight_plan"
					}	
				},
				
				autoLoad: false
			}),
			bbar: [
				{text: "Foo"}
			]			
		});
		//this.xFlightPlanGrid.on("rowclick", function(grid, rowIdx, e){
		//	var rec = grid.getStore().getAt(rowIdx);
		this.xFlightPlanGrid.getStore().on("load", function(store, recs){

			this.get_map_panel().load_flight_plan(recs);
		}, this);
			
	}
	return this.xFlightPlanGrid;
},

get_map_panel: function(){
	if(!this.xMapPanel){
		this.xMapPanel = Ext.create("FGx.map.MapCore", {
			region: "center", xConfig: {}, title: "MAp", flex: 2
		});
	}
	return this.xMapPanel;
},

//===========================================================
//== Grid
initComponent: function() {
	Ext.apply(this, {
		DEADsstitle: 'Flights',
		iconCls: 'icoFlightPlans',
		fgxType: "FlightPlansWidget",
		layout: "border",
		
		items: [
			{region: "north", xtype: "panel", 
				collapsible: true, collapseFirst: true, ssheight: 150,
				title: "Paste Plan", 
				tbar: [
					//{xtype: "fieldset", title: "Paste Flight Plan", autoHeight: true,
						//items:[
							{xtype: "textarea", width: "90%", name: "flight_plan_paste",
							hideLabel: true, width: window.innerWidth - 100, height: 50,
						ssvalue: "EGLL SID BPK UN866 LEDBO UM604 INBOB M604 SVA Z101 GUBAV Z156 AMIMO P80 LATEN B483 PETAG B954 GIKSI G7 LURET R351 KUMOG G902 FRENK B244 OTZ J502 FAI J515 HRDNG J502 RDFLG J515 ORT J502 YZT J523 TOU J501 OED J1 RBL STAR KSFO",
						ssvalue: "EGLL SID DVR UL9 KONAN UL607 KOK UM150 DIK UN852 GTQ UT3 BLM DCT LSZO",
						value: "EGFF SID EXMOR UM140 DVR UL9 KONAN UL607 AMASI UM149 BOMBI UL984 PADKA L984 DIBED UL984 NM UM991 OLGIN B494 MKL B491 BISNA M23 MARAL B450 BIBIM N644 ABDAN B371 LEMOD N644 DI A466 JHANG M875 KAKID M770 OBMOG L515 IKULA R325 PUT B579 VPL W531 VIH R325 VJB G579 SJ A464 TPG M635 ATMAP A576 PKS H319 TARAL Y59 RIVET STAR YSSY",
						ssvalue: "EGFF SID BCN UN864 NITON UP17 TIPTA UM82 RIVOT UM89 ALOTI M89 ROXET Z108 TUXOT Z101 GUBAV Z156 AMIMO P80 LATEN B483 PETAG B153 CZ B152 IVADA A333 IGROD Y301 REALU Y305 FINGA Y12 MBE V58 XMC V52 KEC Y43 KISEI Y46 CANDY OTR26 EDDIE STAR RJBB"
						
					},
					{text: "Process", iconCls: "icoExecute", scope: this,
						handler: function(){
							Ext.Ajax.request({
								url: "/ajax/flightplan/process",
								method: "POST",
								params: {raw_text: this.down("textarea[name=flight_plan_paste]").getValue()},
								scope: this,
								success: function(response, opts) {
									var data = Ext.decode(response.responseText);
									//this.get_map_panel().load_tracker(obj.tracks);
									console.log(data);
									this.get_flight_plan_grid().getStore().loadRawData(data)
									
								},
								failure: function(response, opts) {
									console.log('server-side failure with status code ' + response.status);
								}
							});
						}
					}
				]
			},
			this.get_map_panel(),
			this.get_flight_plan_grid()
		
		]
		
		
		
		
	});
	this.callParent();
}
	
});

