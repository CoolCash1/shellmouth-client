# Easy file managing for Shellmouth Client

import json
import os
import logger

# Edits/creates a JSON File
def writejson(file,variable,ammount):

	jsonfile = open(file, "r+")

	jsonfiletxt = jsonfile.read()
	logger.log(jsonfiletxt, "Filecontroller")

	try:
		jsondata = json.loads(jsonfiletxt)

		jsondata[variable] = ammount

		jsonfile.close()

		newfile = open(file,"w")

		newfile.write(json.dumps(jsondata))

		newfile.close()

	except:
		logger.log("Invalid JSON! Replacing file...", "Filecontroller", "WARN")
		jsonfile.close()

		newfile = open(file, "w")
		newfile.write(json.dumps({variable:ammount}))

		newfile.close()
	