/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 80025
 Source Host           : 127.0.0.1:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 80025
 File Encoding         : 65001

 Date: 08/11/2021 21:44:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `cover` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `category` int(0) NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `author` int(0) NULL DEFAULT NULL,
  `created_at` datetime(0) NOT NULL,
  `updated_at` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of articles
-- ----------------------------
INSERT INTO `articles` VALUES (1, '工具箱VUE重构踩坑经验', NULL, '<!--markdown-->## 组件库选择\r\n\r\n考虑引入方便与后期维护的需要，使用蚂蚁金服的Ant Design组件库，并且有VUE版本\r\n\r\n## 导航栏\r\n\r\n由于Ant组件库针对是中后台场景，故没有特意对导航栏做移动端的响应式适配。在桌面端上，导航栏项会从最左端开始，而移动端仅会将超出屏幕的导航项以`···`图标显示。\r\n\r\n而通过组件库内置的栅格系统可以将两侧空白留出，或与网站logo混排。此时两侧留有空白，但导航栏底部本身有灰色边线，为了美观可以将导航栏组件的灰色边线去掉，同时在外层元素上加上灰色边线(下方演示为在`a-row`标签加)\r\n\r\n在随后的场景中，由于除了使用导航栏实现页面的跳转，还可以通过手动输入URL、点击主页其他元素进入，出现了导航栏选中状态与实际URL路由不匹配的情况。在项目中，VUE Router使用懒加载的模式，在访问某个路由URL时，对应的VUE组件才会被挂载到路由插槽中。可通过`:selectedKeys=\"[this.$route.path]\"`将路由路径传入到导航栏中\r\n\r\n> 注意：`<router-link>`标签中的`to`应与`<a-menu-item>`标签中的`key`相一致\r\n\r\n![导航栏](https://cdn.makedream.site/blog/toolbox-20200821-1.jpg)\r\n\r\n```HTML\r\n\r\n<template>\r\n  <div>\r\n    <a-row style=\"border-bottom: 1px solid #e8e8e8;\">\r\n      <a-col :xs=\"{span:22 ,offset:1}\" :lg=\"{span:18 ,offset:3}\">\r\n\r\n        <a-menu mode=\"horizontal\" :selectedKeys=\"[this.$route.path]\">\r\n          <a-menu-item key=\"/\">\r\n            <router-link to=\"/\">\r\n              <a-icon type=\"home\" />主页\r\n            </router-link>\r\n          </a-menu-item>\r\n          <!-- 更多导航项... -->\r\n\r\n          <a-sub-menu>\r\n            <span slot=\"title\" class=\"submenu-title-wrapper\">\r\n              <a-icon type=\"tool\" />小工具\r\n            </span>\r\n            <a-menu-item key=\"/server\">\r\n              <router-link to=\"/server\">服务器监控</router-link>\r\n            </a-menu-item>\r\n            <!-- 更多子导航项... -->\r\n\r\n          </a-sub-menu>\r\n        </a-menu>\r\n\r\n      </a-col>\r\n    </a-row>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  data() {\r\n    return {};\r\n  }\r\n};\r\n</script>\r\n\r\n<style>\r\n.ant-menu-horizontal {\r\n  border-bottom: 0px !important;\r\n}\r\n</style>\r\n```\r\n\r\n## axios超时与异常处理\r\n\r\n在服务器监控页面中，因API接口限制无法直接在前端发送请求，使用axios发送请求到后端php程序，后端php通过curl发送请求到服务器厂商API接口获取服务器状态\r\n\r\n正常情况下，axios获取到请求后将返回的结果复制给`data() {}`内部的对象变量`v2info`，界面上即可通过双向绑定`{{v2info.xxx}}`来显示对象中`xxx`属性的值\r\n\r\n由于服务器厂商的API接口在海外，会有一定几率出现后端curl发送超时接收不到返回值的情况，此时需要在axios请求的回调函数中加入判断，如果返回结果为`null`，手动赋值给`v2info`中各个属性缺省值，如`N/A`，并弹层提醒超时\r\n\r\n![axios提醒](https://cdn.makedream.site/blog/toolbox-20200821-2.jpg)\r\n\r\n```\r\n<script>\r\nimport { getv2info, getkmsstatus, getv2raystatus } from \"@/network/server\";\r\n\r\nexport default {\r\n  name: \"server\",\r\n  data() {\r\n    return {\r\n      v2info: {},\r\n    };\r\n  },\r\n\r\n  methods: {},\r\n\r\n  created() {\r\n    getv2info().then((res) => {\r\n      if (res == null) {\r\n        (this.v2info.node_datacenter = \"N/A\"),\r\n          (this.v2info.os = \"N/A\"),\r\n          (this.v2info.vm_type = \"N/A\"),\r\n          (this.v2info.plan_monthly_data = 0),\r\n          (this.v2info.data_counter = 0);\r\n        this.$message.warning(\"厂商API接口响应超时，请重试\");\r\n      } else {\r\n        this.v2info = res;\r\n      }\r\n    });\r\n\r\n  },\r\n};\r\n</script>\r\n```\r\n\r\n## 线上联调与生产环境部署\r\n\r\n此次重构只涉及到前端部分，旧项目的接口不需要改动，本地开发时直接请求线上的后端接口，由此产生跨域问题。可修改服务器上Nginx虚拟站点的伪静态规则\r\n\r\n同时应添加针对VUE单页应用的伪静态规则，防止出现生产环境手动输入URL报404错误\r\n\r\n> 注意：在本地开发完成后应将跨域规则注释或删除掉\r\n\r\n```\r\n    location / {\r\n      root /www/wwwroot/info/; \r\n      index /index.html;                        \r\n      try_files $uri $uri/ /index.html;\r\n      # add_header Access-Control-Allow-Origin *;\r\n      # add_header Access-Control-Allow-Methods *;\r\n      # add_header Access-Control-Max-Age 3600;\r\n      # add_header Access-Control-Allow-Credentials true;\r\n      # add_header Access-Control-Allow-Headers $http_access_control_request_headers;\r\n\r\n    }\r\n```\r\n', NULL, NULL, NULL, '2021-10-08 10:58:46', '2021-10-08 10:58:50');
INSERT INTO `articles` VALUES (2, '数据结构1-单链表', NULL, '<!--markdown-->## 节点定义\r\n\r\n```c\r\ntypedef struct Link\r\n{\r\n    int elem;\r\n    struct Link *next;\r\n    \r\n}link;\r\n```\r\n\r\n## 主函数调用逻辑\r\n\r\n```c\r\nint main(){\r\n\r\n    link *p = creatLink();\r\n    //创建链表返回指针p，作为链表的头指针\r\n    \r\n    insertLink(p);\r\n    delLink(p);\r\n    updateLink(p);\r\n    selectLink(p);\r\n    \r\n    printLink(p);\r\n    \r\n}\r\n```\r\n\r\n## 创建链表creatLink()\r\n\r\n```\r\nlink *creatLink(){\r\n\r\n    link *head, *node, *end;\r\n    head = (link*)malloc(sizeof(link));\r\n    end = head;\r\n    for(int i=0; i<N; i++){\r\n        node = (link*)malloc(sizeof(link));\r\n        node->elem = createSrand(N, 50);\r\n        end->next = node;\r\n        end = node;\r\n    }\r\n    end->next = NULL;\r\n    return head;\r\n\r\n}\r\n```\r\n\r\n## 插入链表insertLink()\r\n\r\n```\r\nlink *insertLink(link *list){\r\n    link *temp = list;\r\n    //判断数据合法性\r\n    printf(\"enter postion you want to insert\\n\");\r\n    int n;\r\n    scanf(\"%d\",&n);\r\n    for(int i=0; i<n; i++){\r\n        if(temp == NULL){\r\n            printf(\"postion error!!\\n\");\r\n        }\r\n        temp = temp->next;\r\n    }\r\n    link *insert = (link*)malloc(sizeof(link));\r\n    printf(\"enter insert value\\n\");\r\n    scanf(\"%d\",&insert->elem);\r\n    insert->next = temp->next;\r\n    temp->next = insert;\r\n    \r\n}\r\n```\r\n\r\n## 删除链表delLink()\r\n\r\n```\r\nlink *delLink(link *list){\r\n    link *temp = list;\r\n    printf(\"enter postion you want to delete\\n\");\r\n    int n;\r\n    scanf(\"%d\",&n);\r\n    for(int i=0; i<n-1; i++){\r\n        //被删除的前一个node\r\n        temp = temp->next;\r\n    }\r\n    link *del = temp->next;\r\n    temp->next = temp->next->next;\r\n    free(del);\r\n}\r\n```\r\n\r\n## 创建、插入、删除动画演示\r\n\r\n<iframe src=\"//player.bilibili.com/player.html?aid=68699092&cid=119061033&page=1\" scrolling=\"no\" border=\"0\" frameborder=\"no\" framespacing=\"0\" width=100% height=\"400px\" allowfullscreen=\"true\"> </iframe>\r\n\r\n\r\n## 完整代码linkList.c\r\n\r\n```\r\n#include <stdio.h>\r\n#include <stdlib.h>\r\n#include <time.h>\r\n#define N 10\r\n\r\n\r\ntypedef struct Link\r\n{\r\n    int elem;\r\n    struct Link *next;\r\n    \r\n}link;\r\n\r\nint createSrand(int count, int range){\r\n    return rand() % range;\r\n}\r\n\r\nvoid printLink(link *list){\r\n    link *temp = list;\r\n    printf(\"\\nlink-table is\\n\");\r\n    while (temp->next != NULL)\r\n    {\r\n        temp = temp->next;\r\n        printf(\"%d \",temp->elem);\r\n    }\r\n    printf(\"\\n\");\r\n    \r\n}\r\n\r\nint getLength(link *list){\r\n    int length = 0;\r\n    while (list -> next != NULL){\r\n        length++;\r\n    }\r\n    return length;\r\n}\r\n\r\nlink *creatLink(){\r\n\r\n    link *head, *node, *end;\r\n    head = (link*)malloc(sizeof(link));\r\n    end = head;\r\n    for(int i=0; i<N; i++){\r\n        node = (link*)malloc(sizeof(link));\r\n        node->elem = createSrand(N, 50);\r\n        end->next = node;\r\n        end = node;\r\n    }\r\n    end->next = NULL;\r\n    return head;\r\n\r\n}\r\n\r\n\r\n\r\nlink *insertLink(link *list){\r\n    link *temp = list;\r\n    //判断数据合法性\r\n    printf(\"enter postion you want to insert\\n\");\r\n    int n;\r\n    scanf(\"%d\",&n);\r\n    for(int i=0; i<n; i++){\r\n        if(temp == NULL){\r\n            printf(\"postion error!!\\n\");\r\n        }\r\n        temp = temp->next;\r\n    }\r\n    link *insert = (link*)malloc(sizeof(link));\r\n    printf(\"enter insert value\\n\");\r\n    scanf(\"%d\",&insert->elem);\r\n    insert->next = temp->next;\r\n    temp->next = insert;\r\n    \r\n}\r\n\r\nlink *delLink(link *list){\r\n    link *temp = list;\r\n    printf(\"enter postion you want to delete\\n\");\r\n    int n;\r\n    scanf(\"%d\",&n);\r\n    for(int i=0; i<n-1; i++){\r\n        //被删除的前一个node\r\n        temp = temp->next;\r\n    }\r\n    link *del = temp->next;\r\n    temp->next = temp->next->next;\r\n    free(del);\r\n}\r\n\r\nlink *updateLink(link *list){\r\n    link *temp = list;\r\n    printf(\"enter postion you want to update\\n\");\r\n    int n;\r\n    scanf(\"%d\",&n);\r\n    for(int i=0; i<n; i++){\r\n        temp = temp->next;\r\n    }\r\n    printf(\"insert update value\\n\");\r\n    scanf(\"%d\",&temp->elem);\r\n}\r\n\r\nlink *selectLink(link *list){\r\n    link *temp = list;\r\n    printf(\"enter value you want to find\\n\");\r\n    int value;\r\n    scanf(\"%d\",&value);\r\n    for(int i=0; temp -> next != NULL; i++){\r\n        temp = temp -> next;\r\n        if (temp->elem == value)\r\n        {\r\n            printf(\"%d in %d,address is 0x%x\\n\",value,i,temp);\r\n        }\r\n        \r\n    }\r\n}\r\n\r\n\r\nint main(){\r\n\r\n    link *p = creatLink();\r\n    printf(\"random link-table is\\n\");\r\n    printLink(p);\r\n\r\n    printf(\"select your option\\n\");\r\n    printf(\"1. insert value\\n2. delete value\\n3. change value\\n4. query value\\n\");\r\n    int menu;\r\n    scanf(\"%d\",&menu);\r\n    switch (menu)\r\n    {\r\n    case 1:\r\n        insertLink(p);\r\n        printLink(p);\r\n        break;\r\n    case 2:\r\n        delLink(p);\r\n        printLink(p);\r\n        break;\r\n    case 3:\r\n        updateLink(p);\r\n        printLink(p);\r\n        break;\r\n    case 4:\r\n        selectLink(p);\r\n        break;\r\n\r\n    default:\r\n        break;\r\n    }\r\n\r\n    \r\n}\r\n```\r\n\r\n\r\n', NULL, NULL, NULL, '2021-10-08 10:59:34', '2021-10-08 10:59:34');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `admin` int(0) NOT NULL,
  `created_at` datetime(0) NOT NULL,
  `updated_at` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'elissa', 'e10adc3949ba59abbe56e057f20f883e', '524948583@qq.com', 1, '2021-09-30 16:37:53', '2021-09-30 16:37:53');
INSERT INTO `users` VALUES (2, 'test1', 'e10adc3949ba59abbe56e057f20f883e', '524948583@qq.com', 0, '2021-10-02 22:30:38', '2021-10-02 22:30:38');
INSERT INTO `users` VALUES (3, '赵庄子', 'e10adc3949ba59abbe56e057f20f883e', '524948583@qq.com', 0, '2021-10-03 11:18:23', '2021-10-03 11:18:23');

SET FOREIGN_KEY_CHECKS = 1;
