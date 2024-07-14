echo "Сбор фото статистики карта фотографий"
@call .\.venv\Scripts\activate.bat 
python --version
python.exe fotoInfo.py e:\foto
pause