import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import alias from 'rollup-plugin-alias';

function globalMapping(packageName){
  const externs = {
    'socket.io': 'io',
    'popmotion': 'popmotion'
  };
  return externs[packageName];
}

export default {
  input: 'client/index.js',
  external: ['socket.io', 'popmotion'],
  output: {
    file: 'app/content/client.js',
    format: 'iife',
    name: 'views',
    globals: globalMapping
  },
  plugins: [
    alias({
      vue: require.resolve('vue/dist/vue.min')
    }),
    resolve({
      jsnext: true,
      browser: true
    }),
    commonjs({
      sourceMap: false
    }),
    json()
  ]
};