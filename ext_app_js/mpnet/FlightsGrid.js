

Ext.define("FGx.mpnet.FlightsGrid" ,  {

extend: "Ext.grid.Panel",
xHidden: false,
	
//===========================================================
//== Renderers 
// @todo: pete to put in css
render_callsign: function(v, meta, rec){
	return "<b>" + v + "</b>";
},

render_altitude: function(v, meta, rec){
	
	var color = "white";
	if(v > 30000){
		color = "#C9F7F7";
	}else if( v > 20000 ){
		color = "#C5F5A4";
	}else if( v > 10000 ){
		color = "#F5D2A4";
	}else if( v > 5000) {
		color = "pink"
	}else{
		color = "red";
	}
	meta.style = "background-color: " + color + "; ";
	return Ext.util.Format.number(v, '00,000');	
},

//===========================================================
//== Grid
initComponent: function() {
	Ext.apply(this, {
		sstitle: 'Flights',
		iconCls: 'icoFlights',
		fgxType: "FlightsGrid",
		autoScroll: true,
		autoWidth: true,
		enableHdMenu: false,
		viewConfig: {
			emptyText: 'No flights in view', 
			deferEmptyText: false,
			loadMask: false,
			markDirty: false
		}, 
		stripeRows: true,
		store: Ext.StoreMgr.lookup("flights_store"),
		columns: [ 
			{header: 'Flight ID',  dataIndex:'fid', sortable: true, 
				width: 100, menuDisabled: true,
				renderer: function(v, meta, rec){
					if(rec.get("flag") > 0){
						meta.style = "background-color: pink;";
					}
					return v;
				}
			},
			{header: 'CallSign',  dataIndex:'callsign', sortable: true, 
				renderer: this.render_callsign, width: 100, menuDisabled: true
			},
			
			{header: 'Alt ft', dataIndex:'alt_ft', sortable: true, align: 'right', width: 80,
				renderer: this.render_altitude, menuDisabled: true
			},
			//{header: '', dataIndex:'alt_trend', sortable: true, align: 'center', width: 20,	hidden: true,
			//	renderer: this.render_altitude_trend},
			{header: 'Hdg', dataIndex:'hdg', sortable: true, align: 'right', width: 50, menuDisabled: true,
				renderer: function(v, meta, rec, rowIdx, colIdx, store){
					return v; //Ext.util.Format.number(v, '0');
				}
			},
			{header: 'Spd kt', dataIndex:'spd_kts', sortable: true, align: 'right', width: 50, menuDisabled: true,
				renderer: function(v, meta, rec, rowIdx, colIdx, store){
					return Ext.util.Format.number(v, '0');
				}
			},
			 {header: 'Lat', dataIndex:'lat', sortable: true, align: 'right', 
				hidden: this.xHidden, menuDisabled: true, flex: 1,
				renderer: function(v, meta, rec, rowIdx, colIdx, store){
					return Ext.util.Format.number(v, '0.00000');
				}
			},
			{header: 'Lon', dataIndex:'lon', sortable: true, align: 'right', 
				hidden: this.xHidden, menuDisabled: true, flex: 1,
				renderer: function(v, meta, rec, rowIdx, colIdx, store){
					return Ext.util.Format.number(v, '0.00000');
				}
			},
			{header: 'Aircraft',  dataIndex:'model', sortable: true, menuDisabled: true,
				flex: 1
			},
			{header: 'Flag',  dataIndex: 'flag', sortable: true, menuDisabled: true,
				flex: 1,
				renderer: function(v, meta, rec){
					if(v > 0){
						meta.style = "background-color: pink;";
						return v
					}
					return "-";
				}
			}
		],		
		bbar: [
			new Ext.PagingToolbar({
				hidden: this.xHidden,
				store: Ext.StoreMgr.lookup("flights_store"),
				displayInfo: false,
				pageSize: 500,
				prependButtons: false
			})
		]
		
	});
	this.callParent();
}, // Constructor	



});

