# FileCopy V2 For CashCraft Installer

# Created by Cashton Harmer

import os # Used for collecting items in dirctories
import shutil # Used for moving files and checking if directories exist
import logger

def movedir(dir_, location, name = "NONE", permodnotify = False):

	move_errors = 0
	current_step = 1

	files = os.listdir(dir_)

	rotnum = 0
	for item in files:
		files[rotnum] = dir_ + "\\" + item
		rotnum += 1

	if os.path.exists(location) == False:
		os.mkdir(location)

	if name != "NONE":
		logger.log("Copying {} {}".format(len(files), name), "Copier")

	for item in files:
		if permodnotify == True:
			logger.log('\tCopying "{}" ({}/{})...'.format(item, current_step, len(files)), "Copier")

		try:
			shutil.move(item, location)

		except:
			logger.log('\t\tAn error occured moving the file "{}", Its reccomended to reinstall.'.format(item), "Copier", "ERROR")
			move_errors += 1

		current_step += 1

	logger.log("Secussfully copied {}/{} items!".format(len(files) - move_errors, len(files)), "Copier")
