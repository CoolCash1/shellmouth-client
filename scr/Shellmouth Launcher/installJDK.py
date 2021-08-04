from clint.textui import progress
import requests
import zipfile
from os import path, mkdir, remove

if not path.exists("java"):
    mkdir("java")

if not path.exists("java/jdk16"):
    mkdir("java/jdk16")

print("--- DOWNLOADING JDK16 ---")

r = requests.get("https://cashtonshass.duckdns.org/local/mc/jdk-16.0.1.zip/", stream=True)
path = 'java/tmp.zip'
with open(path, 'wb') as f:
    total_length = int(r.headers.get('content-length'))
    for chunk in progress.bar(r.iter_content(chunk_size=1024), expected_size=(total_length/1024) + 1): 
        if chunk:
            f.write(chunk)
            f.flush()

print("--- DECOMPRESSING JDK16 ---")

file = zipfile.ZipFile("java/tmp.zip", "r")
file.extractall("java/jdk16")
# remove("java/tmp.zip") 
open("java/jdkinstalled", "w").close()

print("--- DONE ---")