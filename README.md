# grunt-umblocalize

> Grunt plugin for filling out localization files for Umbraco

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-umblocalize --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-umblocalize');
```

## The "umblocalize" task

### Overview
In your project's Gruntfile, add a section named `umblocalize` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  umblocalize: {
    options: {
      // Task-specific options go here.
    },
    files: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.baseFile
Type: `String`
Default value: `'en_us.xml'`

A string value that defines the base file to use for localization.

#### options.outputPath
Type: `String`
Default value: `''`

A string value that defines a output folder for testing if you do not wish to overwrite the source files.

### Usage Examples

#### Default Options
In this example, the default options are used.

```js
grunt.initConfig({
  umblocalize: {
    options: {},
    files: {
      'lang-folder': ['lang/*.xml']
    },
  },
});
```

#### Custom Options
In this example, custom options are used to define a specific filename to use as base file, and a output folder is defined to ensure the source files are not overwritten.

```js
grunt.initConfig({
  umblocalize: {
    options: {
      baseFile: 'en_us.xml',
      outputPath: 'output/',
    },
    files: {
      'lang-folder': ['lang/*.xml']
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
"# grunt-umblocalize"
