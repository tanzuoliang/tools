#!/usr/bin/python
#encoding=utf-8

import shutil,os

_dir = {
	"00 icon" : "icon",
	"00 button" : "button",
	"00 wenzi" : "wenzi",		
}

_dir2 = {
	"00 通用" : "common",
	"00 字体" : "fnt"
}


originRoot = "E:\project\\art\天天坦克\UI 效果图+输出 20170214 优化版"

fromRoot = unicode(originRoot,"utf8")
toRoot = "D:\Documents\\tankProject\\tank_ui\Resources"


def copyFile(fromFile,toFile):
	if  not os.path.exists(toFile) or os.path.getmtime(toFile) < os.path.getmtime(fromFile):
		shutil.copy(fromFile,toFile)
		print "copy from %s to %s"%(fromFile,toFile)
	else:
		pass
		# print "ignore file ",fromFile

def copyDir(f,t):
	print f,"   ======>   ",t
	for fileName in os.listdir(f):
		if os.path.exists(os.path.join(f,fileName)):
			ff = os.path.join(f,fileName)
			tf = os.path.join(t,fileName)
			copyFile(os.path.join(f,fileName), os.path.join(t,fileName))

for (_f,_t) in _dir.iteritems():
	copyDir(os.path.join(fromRoot,_f), os.path.join(toRoot,_t))

print "--------------------------------------"
for (_f,_t) in _dir2.iteritems():
	copyDir(unicode(os.path.join(originRoot,_f),"utf8"), os.path.join(toRoot,_t))

raw_input("entry any for contining......")		