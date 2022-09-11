import numpy as np
import pickle
import sys
from sklearn.ensemble import RandomForestClassifier
mod=pickle.load(open("/Users/bharath/programming/polici/hack/client_side/src/RF_mod.sav","rb"))

while True:
    j=input()
    index=input()
    i=np.array(j.split(',')).astype(np.float32)
    x=mod.predict(i.reshape(-1,len(i)))
    tmp=str(x[0])+","+str(index)
    print(tmp)
    sys.stdout.flush()