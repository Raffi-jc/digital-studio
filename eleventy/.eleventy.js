module.exports = function(eleventyConfig) {
    // Pass through static assets to the output folder
    eleventyConfig.addPassthroughCopy("webflow/css");
    eleventyConfig.addPassthroughCopy("webflow/documents");
    eleventyConfig.addPassthroughCopy("webflow/fonts");
    eleventyConfig.addPassthroughCopy("webflow/images");
    eleventyConfig.addPassthroughCopy("webflow/js");
    eleventyConfig.addPassthroughCopy("webflow/videos");
  
    return {
      dir: {
        input: "webflow", // The folder where your Webflow-exported files are located
        output: "_site"   // The default output folder for Eleventy
      }
    };
  };
  