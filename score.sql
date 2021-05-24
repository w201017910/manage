/*
 Navicat Premium Data Transfer

 Source Server         : first
 Source Server Type    : MySQL
 Source Server Version : 80022
 Source Host           : localhost:3306
 Source Schema         : score

 Target Server Type    : MySQL
 Target Server Version : 80022
 File Encoding         : 65001

 Date: 24/05/2021 14:49:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for class
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class`  (
  `className` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `number` int(0) NULL DEFAULT NULL,
  `grade` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`className`) USING BTREE,
  INDEX `key2`(`grade`) USING BTREE,
  CONSTRAINT `key2` FOREIGN KEY (`grade`) REFERENCES `layer` (`grade`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course`  (
  `courseName` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`courseName`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for exam
-- ----------------------------
DROP TABLE IF EXISTS `exam`;
CREATE TABLE `exam`  (
  `exam` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `examtime` date NULL DEFAULT NULL,
  PRIMARY KEY (`exam`) USING BTREE,
  INDEX `exam`(`exam`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for layer
-- ----------------------------
DROP TABLE IF EXISTS `layer`;
CREATE TABLE `layer`  (
  `grade` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`grade`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for score
-- ----------------------------
DROP TABLE IF EXISTS `score`;
CREATE TABLE `score`  (
  `student` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `exam` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `course` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `usualscore` int(0) NULL DEFAULT NULL,
  `testscore` int(0) NULL DEFAULT NULL,
  `totalscore` float(5, 2) NULL DEFAULT NULL,
  `makeuptest` int(0) UNSIGNED NULL DEFAULT 0,
  `rebuild` int(0) UNSIGNED NULL DEFAULT 0,
  `testId` int(0) NULL DEFAULT NULL,
  INDEX `key3`(`exam`) USING BTREE,
  INDEX `key4`(`student`) USING BTREE,
  INDEX `testkey`(`testId`) USING BTREE,
  CONSTRAINT `key3` FOREIGN KEY (`exam`) REFERENCES `exam` (`exam`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `testkey` FOREIGN KEY (`testId`) REFERENCES `student` (`testId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student`  (
  `testId` int(0) NOT NULL,
  `sname` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `studentId` int(0) NOT NULL,
  `sex` enum('男','女') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `class` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`testId`) USING BTREE,
  INDEX `key6`(`class`) USING BTREE,
  CONSTRAINT `key6` FOREIGN KEY (`class`) REFERENCES `class` (`className`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `username` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `telephone` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `registertime` date NULL DEFAULT NULL,
  `password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
