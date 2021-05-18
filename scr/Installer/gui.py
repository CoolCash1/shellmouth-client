# Shellmouth Installer GUI

import tkinter as tk
import installer
import run
import os
import logger
import filecontroller

usrfolder = os.environ.get("APPDATA") + "\\shellmouth"

def opengui():
	window = tk.Tk()
	window.title("Shellmouth Client")
	window.configure()
	window.geometry("275x100")

	window.resizable(False, False) 

	playbtn = tk.Button(window,text="PLAY",command=run.run,height=5, width=15)
	playbtn.grid(row=1,column=1)

	accountbtn = tk.Button(window,text="Login",command=login)
	accountbtn.grid(row=2,column=2)

	tk.Label(window,text="username").grid(row=1,column=2)

	window.mainloop()

def login():
    logger.log("Opening login GUI", "GUI")
    loginwin = tk.Tk()
    loginwin.title("Mojang Login")
    loginwin.geometry("245x50")
    loginwin.resizable(False, False) 

    tk.Label(loginwin,text="Username:").grid(row=0,column=0)
    username_input = tk.Entry(loginwin)
    username_input.grid(row=0,column=1)
    tk.Label(loginwin,text="Password:").grid(row=1,column=0)
    password_input = tk.Entry(loginwin)
    password_input.grid(row=1,column=1)

    def savelogin():
    	logger.log("Writing to login file", "GUI")

    	# try:
    	filecontroller.writejson(usrfolder + "\\secretes\\login.json", "usrname", username_input.get())
    	filecontroller.writejson(usrfolder + "\\secretes\\login.json", "password", password_input.get())

    	# except:
    		# logger.log("Failed to write to login file!", "GUI", "ERROR")

    # minecraft_directory= minecraft_launcher_lib.utils.get_minecraft_directory()
    # versions = minecraft_launcher_lib.utils.get_installed_versions(minecraft_directory)
    # version_list = []

    # for i in versions:
    #     version_list.append(i["id"])

    # Label(loginwin,text="Version:").grid(row=2,column=0)
    # version_select = Combobox(loginwin,values=version_list)
    # version_select.grid(row=2,column=1)
    # version_select.current(0)

    tk.Button(loginwin,text="Save",command=savelogin,width=7).grid(row=0,column=2)
    tk.Button(loginwin,text="Cancel",command=loginwin.destroy,width=7).grid(row=1,column=2)

    loginwin.mainloop()
