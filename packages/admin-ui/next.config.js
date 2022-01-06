module.exports = (_phase, { defaultConfig }) => {
    return {
        ...defaultConfig,
        distDir: '.next',
        generateBuildId: async () => {
            // You can, for example, get the latsest git commit hash here
            return process.env.VERSION || 'unique-build-id';
        },
        webpack: (config, { webpack, defaultLoaders }) => {
            // Note: we provide webpack above so you should not `require` it
            // Perform customizations to webpack config
            config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));

            config.module.rules.push({
                test: /\.tsx?|\.ts?$/,
                use: [defaultLoaders.babel],
            });

            // Important: return the modified config
            return config;
        },
        // typescript: {
        //     // !! WARN !!
        //     // Dangerously allow production builds to successfully complete even if
        //     // your project has type errors.
        //     // !! WARN !!
        //     ignoreBuildErrors: true,
        //     ignoreDevErrors: true,
        // },

        publicRuntimeConfig: {
            // here public config goes
            BACKEND_URL: (process.env.BACKEND_URL || '').trim(),
            ADMIN_WEB_PORT: (process.env.ADMIN_WEB_PORT || '').trim(),
            ENVIRONMENT: (process.env.ENVIRONMENT || '').trim(),
        },
    };
};
