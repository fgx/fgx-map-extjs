Map using Ext-js and OpenLayers
================================

This map is based on the Ext-js4 toolkit

http://mapx.fgx.ch/

========================================

Runs as a python wsgi using bottle.

Basically a one page application

All static files eg librariers are laoded from static.fgx.ch
Navdata is aqquired from navdata.fgx.ch
LiveData is aqquired from crossfeed.fgx.ch

Required:
python 2.6+
bottle.py = the light, wait, framework.
jinga2 = the templating engine

Javascript:
All the required javascript libs are maintained at static.fgx.ch 
These include bug fix etc

Icons

===============================
How it works..

The app.py is the main nuts and bolts of the website..
The app.py contains the import VERSION = "0.1" 

Then index page loads the /views/map-ext.html template

The ext_app_js/* directorty contains the javascript

All requests for ext_app_js/ etc are patterned as

