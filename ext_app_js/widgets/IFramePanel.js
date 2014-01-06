
Ext.namespace("FGx");

FGx.IFramePanel = Ext.extend(Ext.Panel, {

//===========================================================
//== Grid
constructor: function(config) {
	config = Ext.apply({
		iconCls: 'icoHelp',
		fgxType: "IFramePanel",
		layout : 'fit',
		closable: true,
		deferredRender : false,
		items : [
			{
			xtype : "component",  deferredRender : false, constrain: true,
			autoEl:{
				tag:'iframe', width: "100%", height: "100%",
				src : config.url
			}
		}
			
		]
		
	}, config);
	FGx.IFramePanel.superclass.constructor.call(this, config);
}, // Constructor	


});

