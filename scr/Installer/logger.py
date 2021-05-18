# Shellmouth loging functions

import time
import os

os.system("color")

logfile = open("log.txt", 'w')


COLOR = {
    "RED": "\033[91m",
    "BLUE": "\033[94m",
    "ENDC": "\033[0m"
}

def log(message, module, type="INFO"):
	epoch = time.time()
	currenttime = time.ctime(epoch)

	if type == "INFO":
		message = " [INFO | {} | {}] {}".format(currenttime,module,message)
		print(message)
		logfile.write(message)

	elif type == "WARN":
		message = "[WARN | {} | {}] {}".format(currenttime,module,message)
		print(COLOR["BLUE"], message, COLOR["ENDC"])
		logfile.write(message)

	else:
		message = "[ERROR | {} | {}] {}".format(currenttime,module,message)
		print(COLOR["RED"], message, COLOR["ENDC"])
		logfile.write(message)
