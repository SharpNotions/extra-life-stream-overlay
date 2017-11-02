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

function rollupPlugins() {
  return [
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
}

export default [
  {
    input: 'client/index.js',
    external: ['socket.io', 'popmotion'],
    output: {
      file: 'app/content/client.js',
      format: 'iife',
      name: 'views',
      globals: globalMapping
    },
    plugins: rollupPlugins(),
    watch:{
      include: [ 'client/**' ]
    }
  },
  {
    input: 'control-panel/index.js',
    external: ['socket.io'],
    output: {
      file: 'app/content/control.js',
      format: 'iife',
      name: 'views',
      globals: globalMapping
    },
    plugins: rollupPlugins(),
    watch:{
      include:[ 'control-panel/**' ]
    }
  },
  {
    input: 'audio-player/index.js',
    external: ['socket.io'],
    output:{
      file: 'app/content/audio.js',
      format: 'iife',
      name: 'audioControl',
      globals: globalMapping
    },
    plugins: []
  }
];
