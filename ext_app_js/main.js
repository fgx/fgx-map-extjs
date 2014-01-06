
Ext.QuickTips.init();
Ext.Ajax.disableCaching = false;


var DEADRESOLUTIONS = [
    156543.03390625, 
    78271.516953125, 
    39135.7584765625, 
    19567.87923828125, 
    9783.939619140625, 
    4891.9698095703125, 
    2445.9849047851562, 
    1222.9924523925781, 
    611.4962261962891, 
    305.74811309814453, 
    152.87405654907226, 
    76.43702827453613, 
    38.218514137268066, 
    19.109257068634033, 
    9.554628534317017, 
    4.777314267158508, 
    2.388657133579254, 
    1.194328566789627, 
    0.5971642833948135, 
    0.29858214169740677
]

var FGx = {};
FGx.msgCt = null;

FGx.createBox = function (t, s){
	return ['<div class="msg">',
			'<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
			'<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
			'<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
			'</div>'].join('');
}

FGx.msg = function(title, body, tim){
	// @todo: pete
	return;
	if(!FGx.msgCt){
		FGx.msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
	}
	FGx.msgCt.alignTo(document, 't-t');
	//var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
	var m = Ext.DomHelper.append(FGx.msgCt, {html: FGx.createBox(title, body)}, true);
	var Timmy = tim > 0 ? tim : 3;
	m.slideIn('t', {duration: 500}).pause(Timmy * 1000).ghost("t", {remove:true});
}

//====================================================================================
Ext.define('mTree', {
	extend: 'Ext.data.Model',
	idProperty: 'x_key',
	fields: [
		{name: "x_key", type: "string"},
		{name: "x_val", type: "string"}
	]
});

Ext.define('mAirport', {
	extend: 'Ext.data.Model',
	idProperty: 'apt_ident',
	fields: [ 	
		{name: "apt_pk", type: 'string'},
		{name: "apt_ident", type: 'string'},
		{name: "apt_name_ascii", type: 'string'},
		{name: "apt_size", type: 'string'},
		{name: "apt_center_lat", type: 'string'},
		{name: "apt_center_lon", type: 'string'},
		{name: "apt_center_lat84", type: 'float'},
		{name: "apt_center_lon84", type: 'float'},
		{name: "apt_authority", type: 'string'}
	]
});

Ext.define('mFlight', {
	extend: 'Ext.data.Model',
	idProperty: 'fid',
	fields: [ 	
		{name: "fid", type: 'string'},
		{name: "callsign", type: 'string'},
		{name: "server", type: 'string'},
		{name: "model", type: 'string'},
		{name: "lat", type: 'float'},
		{name: "lon", type: 'float'},
		{name: "alt_ft", type: 'int'},
		{name: "spd_kts", type: 'int'},
		//{name: "alt_trend", type: 'string'},
		{name: "hdg", type: 'int'},
		{name: 'flag', type: 'int', defaultValue: null},
		{name: 'check', type: 'int'}
	],
});


