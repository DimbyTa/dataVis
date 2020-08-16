import scrappingFunction as sc
import hashlib
import random
import time

def getHash(url):
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
    r = sc.Request(url, headers={'User-Agent':  user_agents[randomint]})
    try:
        html = sc.urlopen(r)
    except HTTPError as e:
        print(e)
    except URLError as u:
        print("Server not found")
    the_page = html.read()
    html.close()
    return hashlib.sha224(the_page).hexdigest()

current_hash = getHash("http://cco-covid19.gov.mg/fr/accueil/")
### Detect change in the code
while (getHash("http://cco-covid19.gov.mg/fr/accueil/") == current_hash):
    print("Not Changed")
    time.sleep(300)



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
