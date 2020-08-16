import scrappingFunction as sc

html1 = sc.getHTML("http://cco-covid19.gov.mg/fr/accueil/")
df1 = sc.getDataMadaRegion(html1)
df1 = df1.drop(df1.index[1])
df1 = df1.reset_index(drop=True)
d = ['cas_confirmes','deces','en_traitement','formes_graves','gueris']
#for row in d:
	#df1[row] = df1[row].astype(int)

html1.close()
l = []
for i in range(22):
	l.append(str(sc.datetime.datetime.now())[:10])
df1['date'] = l
print(df1.head(5))
sc.DataFrameToTableMada(df1)
sc.saveData(df1,"MadaReg")
#print(df1.head)
