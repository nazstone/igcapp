module.exports = {
  "plugins": [
    "react",
    "babel"
  ],
  "parser": "babel-eslint",
  "extends": ["airbnb", "plugin:react/recommended"],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "class-methods-use-this": [0],
    "react/static-property-placement": [0],
    "react/destructuring-assignment": [0],
    "react/jsx-one-expression-per-line": [0],
    "react/prefer-stateless-function": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "react/jsx-fragments": 0,
  }
};