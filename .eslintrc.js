module.exports = {
  'extends': 'airbnb-base',
  'rules': {
    'linebreak-style': ['error', 'unix'],
    'keyword-spacing': 2,
    'semi': ['error', 'always'],
    'brace-style': ['error', '1tbs', {'allowSingleLine': true}],
    'max-statements-per-line': ['warn', {'max': 2}],
    'quotes': ['error', 'single', {'allowTemplateLiterals': true}],
    'no-negated-condition': 'off',
    'object-curly-spacing': 'off',
    'space-before-function-paren': ['error', 'always'],
    'require-jsdoc': 'off',
    'no-implicit-coercion': 'off',
    'no-underscore-dangle': 'off'
  },
  'root': true
};