from urllib.request import urlopen, Request
from bs4 import BeautifulSoup as BS
from urllib.error import HTTPError
from urllib.error import URLError
from pandas.compat import StringIO
import pandas as pd
import numpy as np
import os
import datetime
import hashlib
import random
import time
import mysql.connector as mysql

def getHTML(url):
    """
    url: string representing the url
    return html object
    """
    # random integer to select user agent
    randomint = random.randint(0,7)

    # User_Agents
    # This helps skirt a bit around servers that detect repeaded requests from the same machine.
    # This will not prevent your IP from getting banned but will help a bit by pretending to be different browsers
    # and operating systems.
    user_agents = [
        'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
        'Opera/9.25 (Windows NT 5.1; U; en)',
        'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
        'Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Kubuntu)',
        'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.142 Safari/535.19',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:11.0) Gecko/20100101 Firefox/11.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:8.0.1) Gecko/20100101 Firefox/8.0.1',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.151 Safari/535.19'
    ]
    #if url is not a string
    if(not isinstance(url,str)):
        print("not an url")
        return None
    r = Request(url, headers={'User-Agent':  user_agents[randomint]})
    try:
        html = urlopen(r)
    except HTTPError as e:
        print(e)
    except URLError as u:
        print("Server not found")
    else:
        return html

def getDataGLobalWdmtr(html):
    """
    data from Worldometer
    input: html
    return: a csv file of the data
    """
    try:
        bsObject = BS(html.read(), 'html.parser')
        table = bsObject.find('table', attrs = {'id': 'main_table_countries_today'})
        rows = table.find_all("tr", attrs={"style": ""})
        data = []
        for (ind,item) in enumerate(rows):
            if ind == 0:
        
                data.append(item.text.strip().split("\n")[:13])
        
            else:
                data.append(item.text.strip().split("\n")[:12])
        dataframe = pd.DataFrame(data)
        dataframe = pd.DataFrame(data[1:], columns=data[0][:12])
        
    except AttributeError as e:
        return None
    return dataframe

def saveData(dataframe, filetype):
    if(os.path.isdir("./datasets")):
        filename = str(datetime.datetime.now())[:19].replace(" ","h")
        dataframe.to_csv("./datasets/"+filetype+filename+".csv")
    else:
        os.mkdir("./datasets")
        filename = str(datetime.datetime.now())[:19].replace(" ","h")
        dataframe.to_csv("./datasets/"+filename+".csv")

def getDataMadaRegion(html):
    """
    data from cco-covid.gov.mg/fr/accueil
    input html
    return csv of data per region
    """
    try:
        bsObject = BS(html.read(), 'html.parser')
        datastr = bsObject.find_all('script', attrs = {'type': 'text/javascript'})
        #rows = table.find_all("tr", attrs={"data-continent": continent})
        for i in range(len(datastr)):
            datastr[i] = str(datastr[i])
            
        signal1 = 0
        signal2 = 0
        i = 0
        for i in range(len(datastr)):
            signal1 = datastr[i].find("{\"objects\":[{\"id\"")
            #print(signal1)
            if(signal1 != -1):
                signal2 = datastr[i].find("\"}]") +3
                #print(signal2)
                break
        if(signal2 != -1):
            data = datastr[i][signal1:signal2] + "}"
        #print(data)
        data = data.replace("null", "\"NaN\"")
        data = eval(data)
        data = dict(data)
        a = data['objects']
        regionDf = pd.DataFrame(a)
    except AttributeError as e:
        print(e)
        return None
    return regionDf

def connectionTodb(username,password, hostname, databaseName = None):
    """
    Connection to mysql server
    username: username string
    password: password string
    hostname: host
    databaseName: the database you want to connect with
    """
    try:
        db = mysql.connect(
            host = hostname,
            user = username,
            passwd = password,
            database = databaseName
            )
        return db
    except Error as e:
        print(e + " connection failed")

def byteStreamtoDataFrame(byte, encoding):
    """
    convert byte to string then to csv for a dataframe
    """
    s = byte.decode(encoding)
    data = StringIO(s)
    df = pd.read_csv(data, sep=",")
    return df
def createDatabase(databasename,username,password, hostname):
    """
    
    databasename: the name of the data base
    
    """
    db = connectionTodb(username,password, hostname)
    ## creating an instance of 'cursor' class which is used to execute the 'SQL' statements in 'Python'
    cursor = db.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS "+ databasename)
    #cursor.commit()
    cursor.close()
    db.close()

def DataFrameToTableMada(dataframe):
    """
    Dataframe to db for Global data until the begining of the pandemic
    data from Our World in Data
    """
    
    db = connectionTodb("dataVis","dataVis2020","localhost","dataVis")
    cursor = db.cursor()
    query = """CREATE TABLE IF NOT EXISTS Mada (cas_confirmes INT,
                                                     deces INT,
                                                     en_traitement INT,
                                                     formes_graves INT,
						     gueris  INT,
                                                     id VARCHAR(255),
                                                     id_no_spaces VARCHAR(255),
                                                     title VARCHAR(50),
                                                     date DATE
                                                     );"""
    
    insertion = """INSERT IGNORE INTO `Mada` (cas_confirmes,
                                                     deces ,
                                                     en_traitement ,
                                                     formes_graves ,
						     gueris  ,
                                                     id ,
                                                     id_no_spaces ,
                                                     title ,
                                                     date
                                                        ) VALUES (%s,%s, %s, %s, %s, %s, %s,%s,%s)"""
    
    cursor.execute(query)
    for i in range(len(dataframe)):
        cursor.execute(insertion, tuple(dataframe.loc[i]))
    #cursor.execute(insertion, tuple(dataframe.loc[0]))
    
    db.commit()   
    cursor.close()
    db.close()


def DataFrameToTableGlobal(dataframe):
    """
    Dataframe to db for Global data until the begining of the pandemic
    data from Our World in Data
    """
    
    db = connectionTodb("dataVis","dataVis2020","localhost","dataVis")
    cursor = db.cursor()
    query = """CREATE TABLE IF NOT EXISTS OurWorldIndata (iso_code Varchar(255),
                                                     continent varchar(255) NOT NULL,
                                                     locttion VARCHAR(255),
                                                     date DATE,
                                                     total_cases FLOAT,
                                                     new_cases   FLOAT,
                                                     total_deaths FLOAT,                
                                                     new_deaths   FLOAT ,                     
                                                     total_cases_per_million  FLOAT,            
                                                     new_cases_per_million    FLOAT ,         
                                                     total_deaths_per_million FLOAT  ,        
                                                     new_deaths_per_million   FLOAT   ,       
                                                     new_tests   FLOAT,                       
                                                     total_tests FLOAT,                       
                                                     total_tests_per_thousand  FLOAT,         
                                                     new_tests_per_thousand    FLOAT,         
                                                     new_tests_smoothed        FLOAT,         
                                                     new_tests_smoothed_per_thousand  FLOAT,  
                                                     tests_per_case FLOAT,                    
                                                     positive_rate FLOAT,
                                                     tests_units VARCHAR(255),
                                                     stringency_index  FLOAT,
                                                     population FLOAT,
                                                     population_density FLOAT,
                                                     median_age FLOAT,
                                                     aged_65_older  FLOAT,
                                                     aged_70_older  FLOAT,
                                                     gdp_per_capita FLOAT,
                                                     extreme_poverty FLOAT,
                                                     cardiovasc_death_rate  FLOAT,
                                                     diabetes_prevalence FLOAT,
                                                     female_smokers FLOAT,
                                                     male_smokers  FLOAT,
                                                     handwashing_facilities FLOAT,
                                                     hospital_beds_per_thousand FLOAT,
                                                     life_expectancy FLOAT
                                                     );"""
    query1 = """DROP TABLE IF EXISTS OurWorldIndata;"""    
    insertion = """INSERT INTO `OurWorldIndata` (iso_code, continent, locttion ,date, total_cases, new_cases, total_deaths,
                                                        new_deaths, total_cases_per_million, new_cases_per_million, total_deaths_per_million,
                                                        new_deaths_per_million, new_tests, total_tests, total_tests_per_thousand,
                                                        new_tests_per_thousand, new_tests_smoothed , new_tests_smoothed_per_thousand,
                                                        tests_per_case, positive_rate, tests_units, stringency_index,population,
                                                        population_density,  median_age, aged_65_older, aged_70_older, gdp_per_capita,
                                                        extreme_poverty, cardiovasc_death_rate, diabetes_prevalence, female_smokers,
                                                        male_smokers, handwashing_facilities, hospital_beds_per_thousand, life_expectancy
                                                        ) VALUES (%s, %s, %s, %s, %s, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);"""
    
    cursor.execute(query1)
    cursor.execute(query)
    for i in range(len(dataframe)):
        cursor.execute(insertion, tuple(dataframe.loc[i]))
    #cursor.execute(insertion, tuple(dataframe.loc[0]))
    
    db.commit()   
    cursor.close()
    db.close()


def DataFrameToTableLatest(dataframe):
    """
    Dataframe to db for Global data until the begining of the pandemic
    data from Our World in Data
    """
    
    db = connectionTodb("dataVis","dataVis2020","localhost","dataVis")
    cursor = db.cursor()
    query = """CREATE TABLE IF NOT EXISTS Latest (rank INT,Country Varchar(255) PRIMARY KEY,
                                                     total_cases BIGINT UNSIGNED,
                                                     new_cases   BIGINT UNSIGNED,
                                                     total_deaths BIGINT UNSIGNED,                
                                                     new_deaths   BIGINT UNSIGNED,
                                                     total_recovered BIGINT UNSIGNED,
                                                     NewRecovered BIGINT UNSIGNED,
                                                     ActiveCases BIGINT UNSIGNED,
                                                     Serious BIGINT UNSIGNED,                            
                                                     TotCasesper1Mpop  FLOAT,         
                                                     Deathsper1Mpop    FLOAT
                                                     );"""  
    insertion = """INSERT INTO `Latest` (rank, Country, total_cases, new_cases ,total_deaths, new_deaths, total_recovered, NewRecovered,ActiveCases, Serious, TotCasesper1Mpop, Deathsper1Mpop ) VALUES (%s, %s, %s, %s, %s, %s,%s,%s,%s,%s,%s,%s);"""
    
    query1 = """DROP TABLE IF EXISTS Latest;"""
    cursor.execute(query1)
    cursor.execute(query)
    print(dataframe.shape)
    for i in range(1,len(dataframe)):
        cursor.execute(insertion, tuple(dataframe.loc[i].tolist()))
    #cursor.execute(insertion, tuple(dataframe.loc[0]))
    
    db.commit()   
    cursor.close()
    db.close()
