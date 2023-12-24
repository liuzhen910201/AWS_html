from tkinter import *
import numpy as np
import math
import tkinter.messagebox

root.title("憨憨制作的三子棋")
f1=Frame(root)
f1.pack()
w1 = Canvas(f1, width=580,height=580,background='lightcyan')
w1.pack()


#棋盘
for i in range(0, 4):
    w1.create_line(i * 180 + 20, 20, i * 180 + 20, 560)
    w1.create_line(20, i * 180 + 20, 560, i * 180 + 20)
num = 0
A = np.full((3, 3), 0)

def dawn(event):
    global w1
    global num, A
    for i in range(0, 3):
        for j in range(0, 3):
            if 20 + j * 180 < event.y and event.y <= 20 + (j+1) * 180:
                break
        if 20 + i * 180 <= event.x and event.x <= 20 + (i+1) * 180:
            break
    if num % 2 == 0 and A[i][j] == 0:
        A[i][j] = 1
        w1.create_line(110 + 180 * i - 45 * math.sqrt(2), 110 + 180 * j - 45 * math.sqrt(2),
            110 + 180 * i + 45 * math.sqrt(2), 110 + 180 * j + 45 * math.sqrt(2))
        w1.create_line(110 + 180 * i + 45 * math.sqrt(2), 110 + 180 * j - 45 * math.sqrt(2),
            110 + 180 * i - 45 * math.sqrt(2), 110 + 180 * j + 45 * math.sqrt(2))
        num += 1
    if num % 2 != 0 and A[i][j] == 0:
        A[i][j] = 2
        w1.create_oval(20 + 180 * i, 20 + 180 * j, 20 + 180 * (i + 1), 20 + 180 * (j + 1))
        num += 1
    if A[0][0] == A[0][1] == A[0][2] == 2 or A[1][0] == A[1][1] == A[1][2] == 2 or A[2][0] == A[2][1] == A[2][2] == 2 or \
        A[0][0] == A[1][0] == A[2][0] == 2 or A[0][1] == A[1][1] == A[2][1] == 2 or A[0][2] == A[1][2] == \
        A[2][2] == 2 or \
            A[0][0] == A[1][1] == A[2][2] == 2 or A[2][0] == A[1][1] == A[0][2] == 2:
        tkinter.messagebox.showinfo('消息提示', '圆圈获胜')
    elif A[0][0] == A[0][1] == A[0][2] == 1 or A[1][0] == A[1][1] == A[1][2] == 1 or A[2][0] == A[2][1] == A[2][2] == 1 or \
        A[0][0] == A[1][0] == A[2][0] == 1 or A[0][1] == A[1][1] == A[2][1] == 1 or A[0][2] == A[1][2] == \
            A[2][2] == 1 or \
                A[0][0] == A[1][1] == A[2][2] == 1 or A[2][0] == A[1][1] == A[0][2] == 1:
        tkinter.messagebox.showinfo('消息提示', '叉号获胜')
w1.bind("<Button -1>", dawn)
def quit():
    root.quit()
button1 = Button(root, text="退出", font=('楷体', 20), command=quit)
button1.pack()
root.mainloop()