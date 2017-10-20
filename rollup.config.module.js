import babel from 'rollup-plugin-babel';

export default {
    input: 'index.js',
    output: [
        {
            format: 'es',
            file: 'dist/react-kapsule.mjs'
        }
    ],
    plugins: [
        babel({
            presets: [
                ["es2015", { "modules": false }],
                "react"
            ],
            plugins: [
                "transform-object-rest-spread",
                "transform-class-properties"
            ],
            babelrc: false
        })
    ]
};