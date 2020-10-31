// Example use for the demo plugin:
// {{ 'Steph' | hello | safe }}

module.exports = (eleventyConfig, options) => {
  // Define defaults for your plugin config
  const defaults = {
    htmlTag: "h2",
  };

  // You can create more than filters as a plugin, but here's an example
  eleventyConfig.addFilter("hello", (name) => {
    // Combine defaults with user defined options
    const { htmlTag } = {
      ...defaults,
      ...options,
    };

    return `<${htmlTag}>Hello, ${name}!</${htmlTag}>`;
  });
};
