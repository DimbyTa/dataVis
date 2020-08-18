import pandas as pd
import numpy as np

def linearReg(x,y):
    """
    x and y the data for the regression
    """
    X=np.array(x).reshape(-1,1)
    Y=np.array(y).reshape(-1,1)
    x_shape = X.shape
    num_var = x_shape[1] 
    yintercept = 0
    slope = 0
    progress = []
    #intialize the parameter
    weight_matrix = np.random.normal(-1,1,(num_var,1))
    yintercept = np.random.rand(1)
    #cost minmization
    for i in range(200):
        dcostdm = np.sum(np.multiply(((np.matmul(X,weight_matrix)+ yintercept)-Y),X))*2/x_shape[0] #w.r.t to the weight
        dcostdc = np.sum(((np.matmul(X,weight_matrix)+yintercept)-Y))*2/x_shape[0]          #partial derivative of cost w.r.t the intercept
        weight_matrix -= 0.1*dcostdm 
    #updating the weights with the calculated gradients
        yintercept -= 0.1*dcostdc #updating the weights with the calculated gradients
        progress.append(np.array((weight_matrix,yintercept)))
    slope = weight_matrix
    return (slope[-1],yintercept)

def linetrend(x,yintercept,weight_matrix):
    product = np.matmul(np.array(x).reshape(-1,1),weight_matrix)+ yintercept
    return product

def trend(x,y):
    lines = []
    for i in range(15,len(x),15):
        m,b = linearReg(x[:i],y[:i])
        line = linetrend(x[:i],b,m)
        lines.append(line)
    return lines


