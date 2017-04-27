/* eslint-env node */
'use strict';

const fs = require('fs');
const filendir = require('filendir');
const camelCase = require('camelcase');

// svg parsing taken from https://github.com/Shopify/images/blob/master/icon-loader.js
const VIEWBOX_REGEX = /viewBox="([^"]*)"/;
const SVG_REGEX = /(<svg[^>]*>|<\/svg>)/g;
const FILL_REGEX = /fill="[^"]*"/g;

const getSvgName = (filename) => {
  let name = filename.split('.svg')[0];
  return camelCase(`${name.replace(/-/g, '')}-svg`);
}
const parseSvg = (filename, content) => {
  let str = '';
  const finalSource = content.replace(FILL_REGEX, (fill) => {
    return fill.includes('#FFF') ? 'fill="currentColor"' : '';
  });

  if (finalSource) {
    const viewBox = VIEWBOX_REGEX.exec(finalSource)[1];
    const body = finalSource.replace(SVG_REGEX, '');

    str = `\t${getSvgName(filename)}: {viewBox: \`${viewBox}\`, body: \`${body}\`},\n`;
  }
  return str;
}

module.exports = {
  name: 'ember-cli-svg',
  included(app) {
    this.app = app;

    if (typeof app.import !== 'function' && app.app) {
      this.app = app = app.app;
    }

    this._super.included.apply(this, arguments);
    this.appDir = this.app.options.appDir || 'addon';
    this.svgDir = this.app.options.svgDir || null;
  },
  postBuild(result) {
    if (this.svgDir) {
      const outputPath = this.appDir + '/utils/svg.js';
      let outputFile = null;
      let fileStr = 'const svgs = {\n';

      fs.readdir(this.svgDir, (error, filenames) => {
        if (error) {
          console.error('ember-cli-svg', error); //eslint-disable-line no-console
          return;
        }
        filenames.forEach((filename) => {
          let svgFile = null;
          try {
            svgFile = fs.readFileSync(this.svgDir + filename, 'utf-8');
          } catch(error) {
            console.error('ember-cli-svg', error); //eslint-disable-line no-console
          }
          fileStr += parseSvg(filename, svgFile);
        });
        fileStr += `};\n\nexport function getSvg(value) { return svgs[value]; }`;
        try {
          outputFile = fs.readFileSync(outputPath, 'utf8');
        } catch(error) {
          console.log('ember-cli-svg', `created ${outputPath}`); //eslint-disable-line no-console
        }
        if (outputFile !== fileStr) {
          console.log('ember-cli-svg', 'complete'); //eslint-disable-line no-console
          filendir.writeFileSync(outputPath, fileStr, 'utf8');
        }
      });
    } else {
      console.warn('Please configure the `svgDir: \'app/svg/\'` option in ember-cli-build.js`');  //eslint-disable-line no-console
    }
    return result;
  }
};
