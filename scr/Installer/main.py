# Shellmouth Testing installer

import copier
import os
import logger
import gui

print("Installer is starting...")

# INIT
usrfolder = os.environ.get("APPDATA") + "\\shellmouth"
logger.log("Set datafolder to {}".format(usrfolder), "Main")

if os.path.exists(usrfolder) == False:
	logger.log("User folder not detected, creating...", "Main", "WARN")
	os.mkdir(usrfolder)
	os.mkdir(usrfolder + "\\secretes")
	os.mkdir(usrfolder + "\\install")
	open(usrfolder + "\\secretes\\login.json", "x")
	logger.log("Please install before pressing 'play'", "Main", "WARN")

logger.log("Opening GUI...", "Main")
gui.opengui()