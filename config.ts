module.exports = {
    webpack: (config) => {
        // Load image files as data: URLs that are embedded in the source.
        // https://webpack.js.org/guides/asset-management/
        config.module.rules.push({
            test: /\.(svg)$/i,
            type: "asset/source",
        });

        // Embed HTML files in the source.
        // https://webpack.js.org/guides/asset-management/
        config.module.rules.push({
            test: /\.html$/i,
            type: "asset/source",
        });

        return config;
    },
};
