from clint.textui import progress
import requests
import zipfile
import os
from json import loads

packsfile = requests.get('https://cashtonshass.duckdns.org/local/mc/packs/packs.json/').text
latestVersion = loads(packsfile)["latest"]
print("Server Pack Downloader 1.0 - THIS PROCESS WILL TAKE A WHILE!")
print("Latest pack version: {}".format(latestVersion))

if not os.path.exists("minecraft"):
    os.mkdir("minecraft")

print("--- Downloading Server Pack ---")

try:
    r = requests.get("https://cashtonshass.duckdns.org/local/mc/packs/{}/pack.zip".format(latestVersion), stream=True)
    path = 'minecraft/{}.zip'.format(latestVersion)
    with open(path, 'wb') as f:
        total_length = int(r.headers.get('content-length'))
        for chunk in progress.bar(r.iter_content(chunk_size=1024), expected_size=(total_length/1024) + 1): 
            if chunk:
                f.write(chunk)
                f.flush()

except KeyboardInterrupt:
    print("Download Cancled")
    quit()

except:
    print("Download Failed! Mabey try restarting your computer then try again.")
    quit(3)

print("--- Extracting Server Pack ---")

if os.path.exists("minecraf/mods"):
    os.remove("minecraft/mods") # Clear mods incase of mod removal

try:
    file = zipfile.ZipFile("minecraft/{}.zip".format(latestVersion), "r")
    file.extractall("minecraft/")
    del(file)
    os.remove("minecraft/{}.zip".format(latestVersion))
    open("installed", "w").write(latestVersion)
    print("Done!")

except PermissionError:
    print("Extraction Failed! A file could not be accessed because its being used in another process.")
    quit(4) # code 4 - Extraction premission error

except:
    quit(5) # code 5 - Unknown Error

