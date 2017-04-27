import Ember from 'ember';
import layout from '../templates/components/x-svg';
import { getSvg } from 'ember-cli-svg/utils/svg';

const {
  computed,
  computed: { reads },
  get
} = Ember;

export default Ember.Component.extend({
  tagName: 'svg',
  layout,
  attributeBindings: [
    'fill',
    'stroke',
    'stroke-alignment',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-dashcorner',
    'stroke-dashadjust',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'viewBox'
  ],

  fill: '#000000',
  source: null,
  stroke: null,
  'stroke-alignment': null,
  'stroke-dasharray': null,
  'stroke-dashoffset': null,
  'stroke-dashcorner': null,
  'stroke-dashadjust': null,
  'stroke-linecap': null,
  'stroke-linejoin': null,
  'stroke-miterlimit': null,
  'stroke-opacity': null,
  'stroke-width': null,

  body: reads('svgSource.body'),
  viewBox: reads('svgSource.viewBox'),

  svgSource: computed('source', function() {
    let source = `${get(this, 'source')}Svg`;
    return getSvg(source);
  })
});
