import os
import sys
import json
from PIL import Image
import PIL.ExifTags
from PIL.TiffImagePlugin import IFDRational
import piexif
import pillow_heif
from datetime import datetime
import time


FILE_JPG  =  ['JPEG','JPG']
FILE_HEIC =  ['HEIC']
FILE_IMAGE =  FILE_JPG + FILE_HEIC
CSV_ATTR   = ["Make", "Model", "LensModel", 
              "FocalLength_str",
              "FNumber_str",
              "ExposureTime_str",
              "ISOSpeedRatings_str",
              "WhiteBalance",
              "DateTimeOriginal", "OffsetTime",
              "file_path"]


def prinLog(caption, error=''):
    curDay = datetime.now()
    date_log = curDay.strftime('%Y%m%d')
    date_time = curDay.strftime('%Y-%m-%dT%H:%M:%S')
    filelog = f'{date_log}.log'
    logDirMap = 'Logs'
    FilePath = os.path.join(logDirMap,filelog)
    if not os.path.isdir(logDirMap) :
      os.mkdir(logDirMap)

    with open(FilePath, mode = "a", encoding='utf-8') as file:
         file.write(f"{date_time}  {caption}  {error}\n")
    print(f"{date_time}  {caption}")     


def listfloat(v):
   if (type(v) == tuple):
      denominator, numerator = v
      return float(denominator / numerator)
   elif (type(v) == list):
      denominator, numerator = v
      return float(denominator / numerator)
   else:
      return v

def procDenominator(Data, attr, funt, Caption="", Exp=False):
   numerator = 0   
   denominator = 0
   Expdenominator = 1
   attr_str = f'{attr}_str'
   v = Data.get(attr)
   if v != None and v != "" :
      if type(v) in [float, str, int]:
         numerator = float(v)
      elif type(v) == tuple and v:
         numerator = listfloat(v)
      else:
         Data[attr_str] = "UNKNOW TYPE"   
         return
      if not Exp:
         Data[attr_str] = f'{Caption} {funt(numerator)}'
      else:
         if float(numerator) < Expdenominator:
            numerator =  Expdenominator / numerator          
            Data[attr_str] = f'{Caption} {Expdenominator}/{funt(numerator)}'
         else :
            Data[attr_str] = f'{Caption} {funt(numerator)}'
            
   else:
      Data[attr_str] = ""

def cast(v):
   if isinstance(v, IFDRational):
      try:
         return float(v)
      except ZeroDivisionError as e:
         return 0
   elif isinstance(v, tuple):
      return tuple(cast(t) for t in v)
   elif isinstance(v, bytes):
      if sys.getsizeof(v) > 0 and sys.getsizeof(v) < 250:
         return v.decode(errors="replace")
      else:
          return ''
   elif isinstance(v, dict):
         for kk, vv in v.items():
            v[kk] = cast(vv)
         return v
   else: return v      

def getFiles(startDir , listresult): 
   listDir  = os.scandir(startDir)
   prinLog(f'Сканирование каталога {startDir}')    
   for l in listDir:
      if l.is_file() and l.name[-4::].upper().lstrip('.') in FILE_IMAGE:
         exifdate = {}

         try:
            if l.name[-4::].upper().lstrip('.') in FILE_HEIC:
               imh = pillow_heif.open_heif(l.path)
               for image in imh:
                  exifdate = piexif.load(image.info["exif"], key_is_name=True) 
                  for k in exifdate:
                     exifdate[k] = cast(exifdate.get(k)) 
                  
            else:
               im = Image.open(l.path)
               if im._getexif() != None:
                  exifdate = {PIL.ExifTags.TAGS[k]: cast(v)
                    for k, v in im._getexif().items() if k in PIL.ExifTags.TAGS
                           }
         except Exception as e:
            prinLog(f'ERROR Ошибка чтения exif в из файла {l.name}', e)    
         if len(exifdate) > 0:
             try:
               procDenominator(exifdate, 'FocalLength',int, 'L')
               procDenominator(exifdate, 'FNumber',float, 'AV')
               procDenominator(exifdate, 'ISOSpeedRatings', int, 'ISO')
               procDenominator(exifdate, 'ExposureTime', int, 'TV', True)
               data  = {"file_dir":startDir,"file_path":l.path, "file_name":l.name} | exifdate
               listresult.append(data)
             except Exception as e:
                prinLog(f'ERROR Ошибка обработки exif в файле {l.name}', e)    
      if l.is_dir():  
         getFiles(l.path , listresult)


def saveDataJson(file_name, listresult):
    prinLog(f'Сохранение данных в файл {file_name}')    
    with open(file_name, mode = "w", encoding='utf8') as file:
         json.dump(listresult, file, ensure_ascii=False)

def saveDataJsonJs(file_name, listresult):
    prinLog(f'Сохранение данных в скрипт {file_name}')    
    with open(file_name, mode = "w", encoding='utf8') as file:
         file.write("const resultList =")
         json.dump(listresult, file, ensure_ascii=False)


def loadDataJson(file_name):
    prinLog(f'Чтение из файла {file_name}')    
    listresult = []
    with open(file_name, mode = "r", encoding='utf8') as file:
       listresult = json.load(file)
    return listresult


def strCsv(val):
   if type(val) == str:
      return val
   else:
      return "'"+str(val)
   
def saveDataCsv(file_name, listresult, keylist):
   header = ';'.join(str(x) for x in keylist)
   with open(file_name, mode = "w", encoding='cp1251') as file:
         prinLog(f'Сохранение в файл {file_name}')    
         file.write(f"{header} \n")
         for row in listresult:
            rowlst = map(lambda x : strCsv(row.get(x)), keylist)
            rowStr = ';'.join(str(x) for x in rowlst)
            file.write(f"{rowStr}, \n")

def saveDataCsvl(file_name, listresult, keylist):
   prinLog(f'Сохранение в файл {file_name}')    
   header = ';'.join(str(x) for x in keylist)
   with open(file_name, mode = "w", encoding='cp1251') as file:
         file.write(f"{header} \n")
         for row in listresult:
            rowStr = ';'.join(str(x) for x in row)
            file.write(f"{rowStr}, \n")

def repAttr(listfile, attr,idx):
   prinLog(f'Создание отчета по {attr}') 
   repDict = {}
   for l in listfile:
      key = l.get(attr)[idx::].strip()
      hkey = l.get('Model')
      if repDict.get(hkey)  == None :
         repDict[hkey] = {key:1}
      else:
         row = repDict.get(hkey)
         if row.get(key)  == None : 
            row[key] = 1
         else:    
            row[key] = int(row.get(key))+1
         repDict[hkey] = row   

   relListResult =[]
   for model in repDict.keys():
      for k in repDict[model]:
         if repDict[model].get(k) != None:
           ListRow = [model, k , repDict[model].get(k)]  
           relListResult.append(ListRow)
   return  relListResult  


def dm_to_deg(args):
    """Преобразует градусы в формате DM в формат DEG"""
    _degrees, _minutes, _seconds = args

    degrees = listfloat(_degrees)
    minutes = listfloat(_minutes)
    seconds = listfloat(_seconds)

    if degrees >= 0:
        decimal = degrees + minutes/60.0 + seconds/3600.0
    else:
        decimal = degrees - minutes/60.0 - seconds/3600.0
    return round(decimal,10) 

def parseGpsData(d):
   latitude = None
   longitude = None

   if  ("GPSInfo" in d.keys()):
      latitude = d.get("GPSInfo").get("2") 
      longitude = d.get("GPSInfo").get("4") 
   elif ("GPS" in d.keys()):   
      latitude = d.get("GPS").get("GPSLatitude") 
      longitude = d.get("GPS").get("GPSLongitude") 

   if (latitude == None or longitude == None):
      return False
   else:
      return {"file" : d.get("file_path"),
            #   "latitude" : latitude ,
              "latitudeDeg" : dm_to_deg(latitude) ,
            #   "longitude" : longitude,   
              "longitudeDeg" : dm_to_deg(longitude)   
      }

def viewbrouser(d):    
   return d.get("file_path")[-4::].upper().lstrip('.') in FILE_JPG



   


startDir = os.getcwd()
listfile = []

startDir = 'e:\\foto'
resultDir = 'result'
resultDirRep = os.path.join(resultDir,'Rep')
fileData = 'result.json' 
fileScript = 'resultMap.js' 

if not os.path.isdir(resultDir) :
  os.mkdir(resultDir)

if not os.path.isdir(resultDirRep) :
  os.mkdir(resultDirRep)


# Сбор информации и сохраняем в файлы
start_time = time.time() 
prinLog(f'Начинам с {startDir}')    

getFiles(startDir, listfile)
finish_time = time.time()       
dur_time = round(finish_time -  start_time,2) 

prinLog(f'Время выполнения сканирования {dur_time} сек')    

pathfiledata =  os.path.join(resultDir,fileData)
saveDataJson(pathfiledata,listfile)
tmpFile =  os.path.join(resultDir,"result.csv")
saveDataCsv(tmpFile, listfile, CSV_ATTR)

#Чтение из файла, для анализа

listfile = loadDataJson(pathfiledata)

#Отчеты

repList = repAttr(listfile, 'FocalLength_str',0)
tmpFile =  os.path.join(resultDirRep,"rep_FocalLength.csv")
saveDataCsvl(tmpFile, repList, ['model','FocalLength','cnt'])

repList = repAttr(listfile, 'FNumber_str',0)
tmpFile =  os.path.join(resultDirRep,"rep_FNumber.csv")
saveDataCsvl(tmpFile, repList, ['model','FNumber','cnt'])

repList = repAttr(listfile, 'ExposureTime_str',0)
tmpFile =  os.path.join(resultDirRep,"rep_ExposureTime.csv")
saveDataCsvl(tmpFile, repList, ['model','ExposureTime','cnt'])

repList = repAttr(listfile, 'ISOSpeedRatings_str',0)
tmpFile =  os.path.join(resultDirRep,"rep_ISO.csv")
saveDataCsvl(tmpFile, repList, ['model','ISO','cnt'])

#Данные для карты

prinLog(f'Формирование данных для карты') 
listGpsData = list(map(lambda x: parseGpsData(x), filter(lambda x: parseGpsData(x) and viewbrouser(x)
 ,listfile)))
prinLog(f'Кол-во фото с координатами {len(listGpsData)}') 
tmpFile =  os.path.join(resultDir,fileScript)
saveDataJsonJs(tmpFile, listGpsData)                  


finish_time = time.time()       
dur_time = round(finish_time -  start_time,2) 

prinLog(f'Общее время выполнения {dur_time} сек')    
