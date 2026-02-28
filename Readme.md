问题描述

解决方案

效果对比

论坛讨论



1.scroll-view列表前插元素闪动
问题描述
scroll-view列表往前面插入元素，会直接滚动到最顶部，而不是保持在现有的位置

对于聊天记录这种向上滚动加载更多历史的场景，加载更多后仍应该保留在当前视图位置，而不是跳动


解决方案
pagePath：scroll-view-front-insert-flash

现在屏幕外，预渲染列表的，计算出高度，然后插入到列表的同时，设置scrollYTop的高度就好了
细节：
1.一定要设置scrollTop到0，并且要关闭scrollY
2.要关闭页面的 "enablePullDownRefresh": false 否则还是闪动



效果对比




论坛讨论
https://developers.weixin.qq.com/community/develop/doc/0008c46e0a04586d86e7dbd2e5bc00



2.scroll-view滚动事件默认节流问题 
影响bindscroll bindscrolltoupper bindscrolltolower

问题描述
scroll-view的滚动事件触发会默认节流，这就导致了快速滚动的时候bindscroll拿到的scrollTop不准确，bindscrolltoupper bindscrolltolower也受影响，因为
有upper-threshold、lower-threshold的存在，可能节流后没有触发小于upper-threshold或者小于lower-threshold的事件。


解决方案
pagePath: scroll-view-throttle

添加上，这个属性是隐藏的
throttle="{{false}}"

效果对比

论坛讨论

https://developers.weixin.qq.com/community/develop/doc/000acc286a8600611147b582e5fc00



3.使用了view占位后加载更慢


4.录音器启动报错

5.blur事件触发不及时

6.visibility不生效

7.scroll-view的bounce不生效

8.scroll-into-view不生效

9.scroll-view关闭不了滚动动画，设置大量元素始终会滚动

10.scroll-view的隐藏滚动条不生效


11.
在ios设备上，设置了autoheight为true的textarea，至少有37px的高度，直接无视了开发者传入的line-height，必须设置disable-default-padding为true才行
autoheight为true的时候，在ios设备上，即使文本只有1行，有时候也tm被计算变成2行了，因此不能auto-height，自己在js算高度吧
哎，小程序/原生组件的各种东西真是依托答辩。



12.安卓下textArea右边显示白色光标


13.渲染符号出错 wiseFont


14.inputAreaPosStyle不能用transform: translateY，不然setData后，textarea会莫名其妙blur，键盘会自动收起，沙雕小程序的沙雕bug！！！damn！！！


15.使用pagepullscroll下拉的时候上面会留有空白

