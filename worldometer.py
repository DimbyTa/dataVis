import scrappingFunction as sc
import numpy as np

html1 = sc.getHTML("https://www.worldometers.info/coronavirus/")
df1 = sc.getDataGLobalWdmtr(html1)
html1.close()
df1 = df1.fillna("0")
print(df1.keys().tolist())
for k in df1.keys()[2:]:
    temp = []
    for d in df1[k]:
        try:
            #print (k)
            d = d.replace("," , "")
            d = d.replace(" " , "0")
            d = d.replace("Nan", "0")
            d = d.replace("N/A", "0")
            #d = d.item()
            #d = np.string_.replace(d,",","")
            #print(d)
            temp.append(d)
            
        except:
            continue
    #print(len(temp))
    #print(len(df1[k]))
    df1[k] = np.array(temp)

for column in df1.keys()[3:]:
    #print(column)
    df1[column] = sc.pd.to_numeric(df1[column])

df1 = df1.drop(df1.index[0])
df1 = df1.reset_index(drop=True)
df1 = df1.drop(df1.index[len(df1)-1])

df1 = df1.reset_index(drop=True)
df1 = df1.fillna(0)
df1 = df1.fillna(0)

for column in df1.keys()[2:]:
    #print(column)
    #df1[column] = sc.np.string_(df1[column])
    tp = []
    for number in df1[column]:
        tp.append(str(number))
    df1[column] = tp
#for column in df1.keys()[10:]:
    #df1[column] = sc.np.string_(df1[column])
#print(df1.shape)
#print(df1.info())
#df1.pop(df1.keys()[0])
sc.DataFrameToTableLatest(df1)
#db = sc.saveData(df1,"Wd")

print(df1.info())
