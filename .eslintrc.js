module.exports = {
    'extends': require.resolve('grumbler-scripts/config/.eslintrc-browser'),
    'rules': {
        'import/export': 0,
        'max-len': [
            'error',
            {
                'code': 250,
            }
        ],
        'max-lines': [
            'error', 1000
        ],
        'complexity': [
            'error', 50
        ],
        'flowtype/require-return-type': 'off',
        'flowtype/require-valid-file-annotation': 'off',
        'no-labels': 'off',
        'compat/compat': 'off'
    }
};
