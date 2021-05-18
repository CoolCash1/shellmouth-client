# Shellmouth Installer run script

import minecraft_launcher_lib
import subprocess
import gui
import logger
import json
import os
import sys
import installer

usrfolder = os.environ.get("APPDATA") + "\\shellmouth"

def run():
	logger.log("Getting username and password...", "Run")

	loginfile = open(usrfolder + "\\secretes\\login.json", "r")
	loginjson = json.loads(loginfile.read())

	# try:
	launch(loginjson["usrname"], loginjson["password"])

	# except:
	# 	logger.log("Unable to start. Try signing in :/", "Run", "ERROR")

def launch(username,password):

	logger.log("Installing Minecraft 1.8.9", "Run")
	installer.main()

	logger.log("Genorating login info...", "Run")
	login_data = minecraft_launcher_lib.account.login_user(username,password)

	try:
		options = {
			"username": login_data["selectedProfile"]["name"],
			"uuid": login_data["selectedProfile"]["id"],
			"token": login_data["accessToken"]
		}
	except:
		logger.log("Incorect login detected, cancelling launch.", "Run", "ERROR")

	logger.log("Starting Forge!", "Run")
	minecraft_command = minecraft_launcher_lib.command.get_minecraft_command("1.8.9-forge1.8.9-11.15.1.2318-1.8.9",usrfolder + "\\instance",options)

	subprocess.call(minecraft_command)

	sys.exit(0)
