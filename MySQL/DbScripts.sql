SHOW DATABASES;
CREATE DATABASE IF NOT EXISTS `rtest_analysis`;
USE rtest_analysis;

CREATE SCHEMA IF NOT EXISTS `rtest_analysis_tool` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;
USE rtest_analysis_tool;

-- indexing module names
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`module_name_index` (
  `module_index` INT(8) NOT NULL,
  `module_name` VARCHAR(255) NOT NULL  COMMENT 'getting module names from CSVs. Manually inserting module names and assigning a unique index to it. module names are repeating in tests. sSo generating a unique index with them.',
  PRIMARY KEY (`module_index`, `module_name`),
  UNIQUE INDEX `module_name_indexcol_UNIQUE` (`module_index` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

-- subset key table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`subset_key_table` (
  `cl_number` INT(8) NOT NULL,
  `core_tech_flag` BIT(1) NOT NULL DEFAULT 0,
  `platform_type` VARCHAR(45) NOT NULL,
  `unique_subset_key` VARCHAR(45) NOT NULL COMMENT 'unique_subset_key = cl_number * 1000 + platform_type'
  GENERATED ALWAYS AS (CONCAT(('cl_number'*1000 ),'_' ,'platform_type')) STORED,
  UNIQUE INDEX `cl_number_UNIQUE` (`cl_number` ASC) VISIBLE,
  PRIMARY KEY (`unique_subset_key`, `platform_type`, `cl_number`),
  UNIQUE INDEX `unique_subset_key_UNIQUE` (`unique_subset_key` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

-- test case table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`test_case_key_table` (
  `test_name` VARCHAR(255) NOT NULL,
  `module_name_index` INT(8) NOT NULL,
  `file_type` VARCHAR(255) NOT NULL,
  `unique_test_key` VARCHAR(255) NOT NULL  
  GENERATED ALWAYS AS (CONCAT(('module_name_index' * 10000),'_', 'test_name')) STORED,
   COMMENT 'unique_test_key = module_name_index * 10,000 + test_name\n',
  PRIMARY KEY (`test_name`, `module_name_index`, `unique_test_key`),
  INDEX `module_name_index_idx` (`module_name_index` ASC) VISIBLE,
  CONSTRAINT `module_name_index`
    FOREIGN KEY (`module_name_index`)
    REFERENCES `rtest_analysis_tool`.`module_name_index` (`module_index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

-- module specific comments
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`module_comments` (
  `id` INT NOT NULL,
  `module_name_index` INT(8) NOT NULL,
  `unique_subset_key` VARCHAR(255) NULL,
  `comment_message` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `module_name_index_idx` (`module_name_index` ASC) VISIBLE,
  INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
  CONSTRAINT `module_name_index`
    FOREIGN KEY (`module_name_index`)
    REFERENCES `rtest_analysis_tool`.`module_name_index` (`module_index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `unique_subset_key`
    FOREIGN KEY (`unique_subset_key`)
    REFERENCES `rtest_analysis_tool`.`subset_key_table` (`unique_subset_key`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

-- ERROR TABLES

-- solid change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`error_solid_change` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `unique_test_key` VARCHAR(45) NOT NULL,
  `unique_subset_key` VARCHAR(45) NOT NULL,
  `baseline_values` INT(8) NOT NULL,
  `current_values` INT(8) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `unique_test_key_idx` (`unique_test_key` ASC) VISIBLE,
  INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
  CONSTRAINT `unique_test_key`
    FOREIGN KEY (`unique_test_key`)
    REFERENCES `rtest_analysis_tool`.`test_case_key_table` (`unique_test_key`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `unique_subset_key`
    FOREIGN KEY (`unique_subset_key`)
    REFERENCES `rtest_analysis_tool`.`subset_key_table` (`unique_subset_key`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

-- sheet change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`error_sheet_change` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `unique_test_key` VARCHAR(45) NOT NULL,
  `unique_subset_key` VARCHAR(45) NOT NULL,
  `baseline_values` INT(8) NOT NULL,
  `current_values` INT(8) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `unique_test_key_idx` (`unique_test_key` ASC) VISIBLE,
  INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
  CONSTRAINT `unique_test_key0`
    FOREIGN KEY (`unique_test_key`)
    REFERENCES `rtest_analysis_tool`.`test_case_key_table` (`unique_test_key`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `unique_subset_key0`
    FOREIGN KEY (`unique_subset_key`)
    REFERENCES `rtest_analysis_tool`.`subset_key_table` (`unique_subset_key`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB 
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;

-- point body change error table
CREATE TABLE IF NOT EXISTS `rtest_analysis_tool`.`error_point_body_change` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `unique_test_key` VARCHAR(45) NOT NULL,
  `unique_subset_key` VARCHAR(45) NOT NULL,
  `baseline_values` INT(8) NOT NULL,
  `current_values` INT(8) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `unique_test_key_idx` (`unique_test_key` ASC) VISIBLE,
  INDEX `unique_subset_key_idx` (`unique_subset_key` ASC) VISIBLE,
  CONSTRAINT `unique_test_key1`
    FOREIGN KEY (`unique_test_key`)
    REFERENCES `rtest_analysis_tool`.`test_case_key_table` (`unique_test_key`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `unique_subset_key1`
    FOREIGN KEY (`unique_subset_key`)
    REFERENCES `rtest_analysis_tool`.`subset_key_table` (`unique_subset_key`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_bin;