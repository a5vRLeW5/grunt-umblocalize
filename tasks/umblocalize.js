/*
 * grunt-umblocalize
 * https://github.com/clausjensen/grunt-umblocalize
 *
 * Copyright (c) 2016 Claus
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('umblocalize', 'Grunt plugin for filling out localization files for Umbraco', function() {
    grunt.log.writeln('Starting umblocalize');

    var xml2js = require('xml2js'),
        crlf = require('crlf-helper');

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      baseFile: 'en_us.xml',
      outputPath: ''
    });

    // Ensure output path ends with slash if not specified
    if (options.outputPath.length > 0 && options.outputPath[options.outputPath.length-1] !== '/') {
      options.outputPath += '/';
    }

    // Processor function for xml2js parser
    function removeNewLinesAndDoubleWhitespace(value) {
      return value.replace(/\r|\n|/g, '').replace(/  +/g, ' ');
    }

    var xmlParser = new xml2js.Parser({ valueProcessors: [removeNewLinesAndDoubleWhitespace] });
    var xmlBuilder = new xml2js.Builder({ cdata: true });
    var baseParsed;
    var updateLocalizationFile = false;
    var filesProcessed = 0, filesUpdated = 0;

    function processXmlString(data, cb) {
      xmlParser.parseString(data, function (err, parsed) {
        updateLanguage(baseParsed.language, parsed.language);
        var xml = xmlBuilder.buildObject(parsed);
        var lf = crlf.setLineEnding(xml, 'CRLF');
        if (cb !== undefined) {
          cb(lf);
        }
      });
    }

    function updateLanguage(baseLanguage, otherLanguage) {
      for (var a = 0; a < baseLanguage.area.length; a++) {
        var area = baseLanguage.area[a];
        updateArea(area, otherLanguage.area, a);
      }
    }

    function updateArea(area, areas, pos) {
      var foundArea;
      for (var a = 0; a < areas.length; a++) {
        if (area.$.alias === areas[a].$.alias) {
          foundArea = areas[a];
          break;
        }
      }
      if (foundArea === undefined) {
        areas.splice(pos, 0, area);
        updateLocalizationFile = true;
      } else {
        for (var k = 0; k < area.key.length; k++) {
          var key = area.key[k];
          updateKey(key, foundArea.key, k);
        }
      }
    }

    function updateKey(key, keys, pos) {
      var foundKey;
      for (var k = 0; k < keys.length; k++) {
        if (key.$.alias === keys[k].$.alias) {
          foundKey = keys[k];
          break;
        }
      }
      if (foundKey === undefined) {
        keys.splice(pos, 0, key);
        updateLocalizationFile = true;
      }
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(filegroup) {
      // Read the base file from the file group
      var filegroupPath = filegroup.src[0].substring(0, filegroup.src[0].lastIndexOf('/') + 1);
      var baseFileData = grunt.file.read('lang/en_us.xml');
      xmlParser.parseString(baseFileData, function (err, parsed) {
        baseParsed = parsed;

        // Filter away the base file + files not found and then process
        filegroup.src.filter(function(filepath) {
          if (filepath.indexOf(options.baseFile) !== -1) {
            return false;
          }
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found');
            return false;
          } else {
            return true;
          }
        }).map(function(filepath) {
          // Read the localization file and process it
          var data = grunt.file.read(filepath);
          updateLocalizationFile = false;
          processXmlString(data, function (d) {
            // If the file was updated, write it to disk
            if (updateLocalizationFile) {
              var outputFilePath = options.outputPath + filepath;
              grunt.file.write(outputFilePath, d);
              grunt.log.writeln('Updated "' + outputFilePath + '"');
              filesUpdated++;
            }
            filesProcessed++;
          });
        });
        grunt.log.writeln(filesProcessed + ' localization files in "' + filegroup.dest + '" processed (' + filesUpdated + ' updated)');
      });
    });
  });
};