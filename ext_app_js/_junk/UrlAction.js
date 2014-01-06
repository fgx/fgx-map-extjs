
Ext.namespace("FGx");

FGx.UrlAction = Ext.extend(Ext.Action, {


constructor: function(config) {
	config = Ext.apply({
		iconCls: config.icoCls ? config.icoCls : "icoHtml",
		
		menu: [
			{text: "Open in desktop", xMode: "window", url: config.url, 
				handler: config.M.on_url_action, scope: config.M},
			{text: "Open in iframe tab", xMode: "tab", url: config.url, 
				handler: config.M.on_url_action, scope: config.M}
		]
	}, config);
	FGx.UrlAction.superclass.constructor.call(this, config);
} 


});
