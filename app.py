#!/usr/bin/python

import os

import bottle
from bottle import route
from bottle import TEMPLATE_PATH, jinja2_template as template


APP_ROOT = os.path.abspath(os.path.dirname(__file__))

VERSION = "0.1"

class Server:
	static = "http://static.fgx.ch"
	navdata = "http://navdata.fgx.ch"

#==================================================================
class Context(object):
	"""Create a simple object for the template (instead of dict)"""
	pass

def new_context():
	"""Create new context and set some default"""
	ob = Context()
	ob.server = Server
	ob.ver = VERSION
	ob.ext_ver = "4.1.1a"
	return ob



#==================================================================

@route("/", method="GET")
def index():
	c = new_context()
	return template("map-ext.html", c=c)


@route("/fgx_ext/<ver>/<filename:path>", method="GET")
def static_ext_app(ver, filename):
	"""Handle the ext spplication.js 
	   Not using the version string, its just there for caching the path
    """
	return bottle.static_file(filename, root=APP_ROOT + "/ext_app_js") 


@route("/style/<ver>/<filename:path>", method="GET")
def static_style(ver, filename):
	"""Handler the style sheet.
	   Not using the version string, its just there for caching the path
    """
	return bottle.static_file(filename, root=APP_ROOT + "/style") 


#==================================================================
bottle.debug(True)
bottle.run(host="localhost", port="7888", reloader=True)



