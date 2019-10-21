const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const karma = require('@neutrinojs/karma');
const styles = require('@neutrinojs/style-loader');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb({
      eslint: {
        baseConfig: {
          extends: ['prettier', 'prettier/react'],
        },
      },
    }),
    react({
      html: {
        title: 'cb',
        template: './src/template.ejs',
      },
      babel: {
        plugins: [
          [
            'react-css-modules',
            {
              filetypes: {
                '.scss': {
                  syntax: 'postcss-scss',
                },
              },
              webpackHotModuleReloading: true,
              exclude: 'node_modules',
            },
          ],
        ],
      },
    }),
    karma(),
  ],
};
