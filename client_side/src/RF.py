import numpy as np
import pickle
import sys
from sklearn.ensemble import RandomForestClassifier
print(100)
sys.stdout.flush()
try:
    mod=pickle.load(open("/Users/bharath/programming/polici/hack/client_side/src/RF_mod.sav","rb"))
except:
    print(200)
    sys.stdout.flush()
while True:
    j=input()

    i=np.array(j.split(',')).astype(np.float32)
    x=mod.predict(i.reshape(-1,len(i)))
    print(x[0])
    sys.stdout.flush()