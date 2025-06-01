// https://gist.github.com/karpolan/2c573b5767bc9b65db9936c7fad4daac
module.exports = {
  // 每行最大列，超过换行
  printWidth: 120,
  // 使用制表符而不是空格缩进
  useTabs: false,
  // 缩进
  tabWidth: 2,
  // 结尾不用分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 在JSX中使用双引号而不是单引号
  jsxSingleQuote: false,
  // 箭头函数里面，如果是一个参数的时候，加上括号
  arrowParens: 'always',
  // 对象、数组括号与文字间添加空格
  bracketSpacing: true,
  // 尾随逗号
  // trailingComma: "es5",
  trailingComma: 'all',
  // 在对象文字中，允许拼写多个连续空格的属性名称
  bracketSameLine: false,
  // 换行符
  endOfLine: 'lf',

  // 添加 prettier-plugin-tailwindcss 插件
  plugins: ['prettier-plugin-tailwindcss'],
}
