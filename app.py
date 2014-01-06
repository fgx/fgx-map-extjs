#!/usr/bin/python

import os

import bottle
from bottle import route
from bottle import TEMPLATE_PATH, jinja2_template as template

APP_ROOT = os.path.abspath(os.path.dirname(__file__))

print bottle.TEMPLATE_PATH

@route("/")
def index():
	return template("map-ext.html", foo="bar")


@route("/static/<filename>")
def server_static(filename):
	return bottle.static_file(filename, root=APP_ROOT + "/static") 

bottle.debug(True)
bottle.run(host="localhost", port="7888", reloader=True)



