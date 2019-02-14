module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module'
	},
	rules: {
		env: {
			node: true
		},
		quotes: [
			2,
			'single',
			{
				avoidEscape: true,
				allowTemplateLiterals: true
			}
		],
		'no-console': 0,
		'import/prefer-default-export': 0,
		import: 0,
		semi: 'error',
		'func-names': 0,
		'space-before-function-paren': 0,
		'comma-dangle': 0,
		'max-len': 0,
		'import/extensions': 0,
		'no-underscore-dangle': 0,
		'consistent-return': 0,
		'no-debugger': 0,
		'no-unused-vars': [
			1,
			{
				argsIgnorePattern: 'res|next|^err'
			}
		],
		'arrow-body-style': [2, 'as-needed'],
		'no-unused-expressions': [
			2,
			{
				allowTaggedTemplates: true
			}
		],
		'no-param-reassign': [
			2,
			{
				props: true
			}
		]
	}
};
