## AWS EC2上传项目
### 目前问题：<br>
1,不采用Elastic ip的情况可能会导致ip不固定<br>
采用Elastic ip会产生费用<br>
2,EC2的免费资源有限 无法满足AI运算需求 还达不到预想目的 需要优化算法或增加运算资源
### MCTS算法
1，井字棋<br>
http://18.183.224.191/tikMcts.html
<br>
#### 源代码
https://github.com/liuzhen910201/AWS_html/blob/main/MCTS_game/tikMcts.html<br>
#### 效果图
![](https://github.com/liuzhen910201/AWS_html/blob/main/image/tik.png)
#### 目前问题
EC2的免费资源有限 无法满足AI运算需求 还达不到预想目的 需要优化算法或增加运算资源
### 五子棋
http://18.183.224.191/goMcts.html<br>
#### 源代码
https://github.com/liuzhen910201/AWS_html/blob/main/ab/game.js<br>
更新：添加每一步的评分功能 选择最优解（alpha-beta剪枝）
#### 效果图
![](https://github.com/liuzhen910201/AWS_html/blob/main/image/ab_go.png)
#### 评分
![](https://github.com/liuzhen910201/AWS_html/blob/main/image/score.png)

#### 参考
https://github.com/colingogogo/gobang_AI/tree/master<br>

#### 目前问题
1，EC2的免费资源有限 无法满足AI运算需求 还达不到预想目的 需要优化算法或增加运算资源<br>
2，判断胜利的函数不稳定 需要进一步调整(解决)<br>
3，评分权重需要调整 目前最优解未必是分数最高的情况<br>
更新中...
<br>
### 其他项目
#### 视频播放器
http://18.183.224.191/player.html

#### 源代码
https://github.com/liuzhen910201/AWS_html/blob/main/player/player.html <br>
#### 效果图
![](https://github.com/liuzhen910201/AWS_html/blob/main/image/player.png)
<br>
更新中...
<br>
