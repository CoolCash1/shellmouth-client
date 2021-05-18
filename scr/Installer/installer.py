# Shellmouth Installer Install Script

import logger
import requests
import zipfile
import os

usrfolder = os.environ.get("APPDATA") + "\\shellmouth"

downloadurl = "" #TODO - Needs server for download

def install():
	# Download
	logger.log("Downloading latest...", "Installer")
	dowload = requests.get(downloadurl, allow_redirects=True)
	open(usrfolder + "\\latest.zip", 'wb').write(r.content)

	# Extract
	logger.log("Extracting files...")
	with zipfile.ZipFile(usrfolder + "\\latest.zip", 'r') as zip_ref:
		zip_ref.extractall(usrfolder + "\\install")

