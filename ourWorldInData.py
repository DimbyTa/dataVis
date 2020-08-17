import scrappingFunction as sc

html = sc.getHTML("https://covid.ourworldindata.org/data/owid-covid-data.csv")

tempD = html.read()

html.close()

globalData = sc.byteStreamtoDataFrame(tempD,"utf-8")



globalData['iso_code'] = globalData['iso_code'].fillna("unknown")
globalData['continent'] = globalData['continent'].fillna("unknown")
globalData = globalData.fillna(0)
test = ['total_cases','new_cases','total_deaths','new_deaths', 'new_deaths_smoothed','new_cases_smoothed',                        
'total_cases_per_million',            
'new_cases_per_million','new_cases_smoothed_per_million',              
'total_deaths_per_million',           
'new_deaths_per_million','new_deaths_smoothed_per_million',             
'new_tests',                          
'total_tests',                        
'total_tests_per_thousand',          
'new_tests_per_thousand',             
'new_tests_smoothed',                 
'new_tests_smoothed_per_thousand',    
'tests_per_case',                     
'positive_rate',       
'stringency_index',                  
'population',                         
'population_density',                 
'median_age',                         
'aged_65_older',                      
'aged_70_older',                      
'gdp_per_capita',                     
'extreme_poverty',                    
'cardiovasc_death_rate',              
'diabetes_prevalence',                
'female_smokers',                     
'male_smokers',                       
'handwashing_facilities',             
'hospital_beds_per_thousand',         
'life_expectancy']

for column in test:
    #print(column)
    tp = []
    for data in globalData[column]:
        tp.append(str(data))
    globalData[column] = tp
print(globalData.info())
sc.DataFrameToTableGlobal(globalData)
