SHOW DATABASES;
CREATE DATABASE IF NOT EXISTS `rtest_analysis_tool`;
USE rtest_analysis_tool;
CREATE SCHEMA IF NOT EXISTS `rtest_analysis_tool` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
SHOW SCHEMAS;
USE rtest_analysis_tool;

-- indexing module names
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`module_name_index` (
    `module_index` INT(8) NOT NULL AUTO_INCREMENT,
    `module_name` VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (`module_index`, `module_name`),
    UNIQUE INDEX `module_name_indexcol_UNIQUE` (`module_index` ASC) VISIBLE
);
-- COMMENT 'getting module names from CSVs. Manually inserting module names and assigning a unique index to it. module names are repeating in tests. sSo generating a unique index with them.',

-- subset key table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`subset_key_table`(
    `cl_number` INT(8) NOT NULL,
    `core_tech_flag` BIT(1) NOT NULL DEFAULT 0,
    `platform_type` INT NOT NULL,
    -- 1 for linux, 2 for windows
    `unique_subset_key` INT GENERATED ALWAYS AS ('cl_number' * 1000 + 'platform_type') STORED,
    -- COMMENT 'unique_subset_key = cl_number * 1000 + platform_type'
    PRIMARY KEY (
        `unique_subset_key`,
        `cl_number`
    ),
    UNIQUE INDEX `cl_number_UNIQUE` (`cl_number` ASC) VISIBLE,
    UNIQUE INDEX `unique_subset_key_UNIQUE` (`unique_subset_key` ASC) VISIBLE
);

-- test case table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`test_case_key_table` (
    `test_name` VARCHAR(255) NOT NULL,
    `module_name_index` INT(8) NOT NULL,
    `file_type` VARCHAR(255) NOT NULL,
    `unique_test_key` VARCHAR(255) GENERATED ALWAYS AS (
        CONCAT(('module_name_index' * 10000), '_', 'test_name')
    ) STORED,
    PRIMARY KEY (`unique_test_key`),
    INDEX `module_name_index_idx` (`module_name_index` ASC) VISIBLE,
    FOREIGN KEY (`module_name_index`) REFERENCES  `module_name_index`(`module_index`)
);
--  test_name are not limited. Ask to store it as an int or a varchar
-- COMMENT 'unique_test_key = module_name_index * 10,000 + test_name\n',


-- module specific comments
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`module_comments` (
    `id` INT NOT NULL,
    `module_name_index` INT(8) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `comment_message` VARCHAR(255),
    PRIMARY KEY (`id`),
    INDEX `module_name_index_idx` (`module_name_index` ASC) VISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`module_name_index`) REFERENCES `module_name_index`(`module_index`),
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`)
);
-- Details table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`details` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(255) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `status` VARCHAR(45) NOT NULL,
    `comment` VARCHAR(255) NULL,
    `criticality` INT NOT NULL,
    `severity` VARCHAR(45) NOT NULL,
    `lp_error` VARBINARY(255) NULL,
    `solid_change_error` INT NULL,
    `sheet_error` INT NULL,
    `point_body_error` INT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);
-- COMMENT 'criticality should be extracted from name of csv 1,2,3\n'
-- COMMENT 'provided in CSV\n',

-- ERROR TABLES

-- solid change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`error_solid_change` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(45) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `baseline_values` INT(8) NOT NULL,
    `current_values` INT(8) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);
-- sheet change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`error_sheet_change` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(45) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `baseline_values` INT(8) NOT NULL,
    `current_values` INT(8) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);
-- point body change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`error_point_body_change` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(45) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `baseline_values` INT(8) NOT NULL,
    `current_values` INT(8) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);
--  wire bodies error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`wire_body_change` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(45) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `baseline_values` INT(8) NOT NULL,
    `current_values` INT(8) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);
-- general bodies error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`general_body_change` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(45) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `baseline_values` INT(8) NOT NULL,
    `current_values` INT(8) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);
-- face change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`face_change` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(45) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `baseline_values` INT(8) NOT NULL,
    `current_values` INT(8) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);
-- edge change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`edge_change` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(45) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `baseline_values` INT(8) NOT NULL,
    `current_values` INT(8) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);
-- volume change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`volume_change` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(45) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `baseline_values` INT(8) NOT NULL,
    `current_values` INT(8) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);
-- surface area change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`surface_area_change` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `unique_test_key` VARCHAR(45) NOT NULL,
    `unique_subset_key` INT NOT NULL,
    `baseline_values` INT(8) NOT NULL,
    `current_values` INT(8) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `unique_test_key_idx` (`unique_test_key` ASC) INVISIBLE,
    INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
    FOREIGN KEY (`unique_subset_key`) REFERENCES `subset_key_table`(`unique_subset_key`),
    FOREIGN KEY (`unique_test_key`) REFERENCES `test_case_key_table`(`unique_test_key`)
);