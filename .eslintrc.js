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
  }
};