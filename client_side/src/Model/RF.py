import numpy as np
import pickle
import sys
from sklearn.ensemble import RandomForestClassifier

mod=pickle.load(open("./RF_mod.sav","rb"));
while True:
    j=input()
    i=np.array(j.split(',')).astype(np.float32)
    x=mod.predict(i.reshape(-1,len(i)))
    print(x[0])
    sys.stdout.flush()