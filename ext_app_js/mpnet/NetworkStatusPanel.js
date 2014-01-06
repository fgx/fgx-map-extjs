
Ext.define("FGx.mpnet.NetworkStatusPanel",  {

extend: "Ext.Panel",

bots: ["tracker", "crossfeed", "mpstatus"],
botActions: null,

make_bot_actions: function(){
	//if(!this.botActions){
		this.botActions = {};
		var arr = []
		for(var i = 0; i < this.bots.length; i++){
			console.log(i, this.bots[i]);
			this.botActions[this.bots[i]] = {text: this.bots[i]};
			arr.push( this.bots[i] );
		}
		//console.log(this.botActions);
		
	//}
	return arr;
},
	
//===========================================================
//== Gridnew Ext.Toolbar.TextItem(
initComponent: function() {
	
	
	var tbw = 100;
	
	Ext.apply(this, {
		iconCls: 'icoMpServers',
		fgxType: "NetworkStatusWidget",
		title: "Network Status",
		layout : 'border',
		closable: true,
		deferredRender : false,
		//tbar: [
		//	{xtype: "buttongroup", columns: 3, title: "Bot Status",
		//		//items: this.make_bot_actions()
		//	}
		//],
		items : [
			Ext.create("FGx.mpnet.MpStatusGrid", {
				region: "center", ssflex: 3
			})
		/*	 {xtype: 'linechart',  height: 200,
			sssregion: "center",  sflex: 1,
			
            store: {xtype:"jsonstore",
				fields:[
					{name: 'flights', type: "int"},
					{name: 'id', type: "int"},
					{name: 'ts', type: "date", dateFormat: 'Y-m-d H:i:s'} 
				],

				url: "/ajax/mpnet/traffic_log",
				idProperty: "ts",
				root: "traffic_log",
				autoLoad: false,
				ssdata: [
					{name:'Jul 07', visits: 245000, views: 3000000},
					{name:'Aug 07', visits: 240000, views: 3500000},
					{name:'Sep 07', visits: 355000, views: 4000000},
					{name:'Oct 07', visits: 375000, views: 4200000},
					{name:'Nov 07', visits: 490000, views: 4500000},
					{name:'Dec 07', visits: 495000, views: 5800000},
					{name:'Jan 08', visits: 520000, views: 6000000},
					{name:'Feb 08', visits: 620000, views: 7500000}
				]
			},
            url: EXT_CHART_SWF,
			
			
            xField: 'ts',
            yField: 'flights',
			

			yAxis: new Ext.chart.NumericAxis({
                displayName: 'Flights'
            }),
			xAxis: new Ext.chart.TimeAxis({
				labelRenderer: function(date) { return date.format("H:i"); }

            }),

			chartStyle: {
                padding: 10,
                animationEnabled: true,
                font: {
                    name: 'Tahoma',
                    color: 0x444444,
                    size: 11
                },
                dataTip: {
                    padding: 5,
                    border: {
                        color: 0x99bbe8,
                        size:1
                    },
                    background: {
                        color: 0xDAE7F6,
                        alpha: .9
                    },
                    font: {
                        name: 'Tahoma',
                        color: 0x15428B,
                        size: 10,
                        bold: truenew
                    }
                },
                xAxis: {
                    color: 0x69aBc8,
                    majorTicks: {color: 0x69aBc8, length: 4},
                    minorTicks: {color: 0x69aBc8, length: 2},
                    majorGridLines: {size: 1, color: 0xeeeeee}
                },
                yAxis: {
                    color: 0x69aBc8,
                    majorTicks: {color: 0x69aBc8, length: 4},
                    minorTicks: {color: 0x69aBc8, length: 2},
                    majorGridLines: {size: 1, color: 0xdfe8f6}
                }
            },
			
        } 
		*/
			
		]
		
	});
	this.callParent();
} // initComponent	



});
