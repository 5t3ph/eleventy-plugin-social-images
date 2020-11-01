## Eleventy Plugin: Social Images

> Dynamically generated social media images.

This package creates dynamic images sized for social media tags (particularly Twitter and Facebook) based on your available pages. Use one of the predefined color themes, or define your own style, template, or both to customize the layout.

Configure the CLI script to run after your Eleventy build, and by default images will be created in `_site/previews/` as png images. Use the CLI options to define a custom `outputDir` and/or a custom `imageDir`.

The images are _only_ created in your output directory since the process runs after the Eleventy build is complete.

The window size used for the screenshot is 600px wide by 315px tall (which is then saved at 2x resolution) which you can use to test your template and styles if you choose to create them custom.

🧪 **This plugin is currently being tested** and is not quite ready for production. Feel free to help test it, and [add an issue](https://github.com/5t3ph/eleventy-plugin-social-images/issues) if you find a problem.

## Usage

First, install the package:

```bash
npm install @11tyrocks/eleventy-plugin-social-images
```

**There are three steps to using this package**:

1. Setup the command line script and add it to your Eleventy build
2. Generate a JSON file containing data for each page you want social images
3. Include a reference to the image in your templates

### Setup the CLI Script

Technically, this package offers a plugin component, but most of the functionality is added by calling the command line script.

The minimum setup for the cli script is:

```bash
eleventy-social-images --siteName 'Your Site Name'
```

It's recommended to add this _after_ building Eleventy for production to reduce strain on your system when in `serve` mode, for example by adding the following in your `package.json`:

```js
"scripts": {
  "social-images": "eleventy-social-images --siteName 'Your Site Name'",
  "start": "eleventy --serve",
  "build": "eleventy ; npm run social-images"
}
```

### Setup the Page Data JSON

The Eleventy plugin itself is only providing an _optional_ filter to help format titles within the required JSON file.

The filter is called `addNbsp` and it inserts a non-breaking space - `nbsp;` - between the last two words in the title to prevent a single word dangling on the last line (called an "orphan" by typographers).

_See the next section for how to add the plugin_.

To create the required page data JSON, here is a starting template that loops through the `all` collection and includes the two expected keys: `title` and `imgName`.

**Important:** Be sure to add the full path of your `pages.json` file to either `.gitignore` or `.eleventyignore` to prevent an infinite loop when Eleventy is in `--serve` mode.

- This should be created as a Nunjucks template, ex. `pagesjson.njk` so that it is recognized by Eleventy for processing.
- Place this either at the root of your _input_ directory, or in a custom directory in your input folder (ex. `_generate`).
- Note the unique frontmatter, which essentially mean "do not include this in the normal site output".
- **If you have customized your input directory** via your Eleventy config, you may want to change the `permalink` value because it is relative to your _project root_, not the directory where it is placed.
- The example uses the `addNbsp` filter which is _optional_ - see the next section for how to include the plugin and gain access to that filter.
- When the `addNbsp` filter is used, you must also include `safe` to allow the `nbsp;` to be successfully included.
- `slug` is a built-in Eleventy filter that will for example transform 'Hello World' into 'hello-world'

```js
---
permalink: ./pages.json
permalinkBypassOutputDir: true
eleventyExcludeFromCollections: true
---
[
{%- for pages in collections.all %}
	{
      "title":"{{ pages.data.title | addNbsp | safe }}",
      "imgName":"{{ pages.data.title | slug }}"
	}{% if loop.last == false %},{% endif -%}
{% endfor %}
]
```

You may modify what is used as the values based on your own naming convention and permalink structure. You may need to scope it to a particular collection vs. `all`. [Check out the 11ty docs on collections >](https://www.11ty.dev/docs/collections/)

### Optional: Add the Plugin

As noted previously, the plugin enables the `addNbsp` filter.

Install the plugin in your 11ty project:

Then, include it in your `.eleventy.js` config file:

```js
const socialImages = require("@11tyrocks/eleventy-plugin-social-images");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(socialImages);
};
```

### Add image references in your templates

The final step is up to you, which is placing the social media tags for you preferred services in the `<head>` of your Eleventy templates.

Here are Nunjuck examples of including the image for both Twitter and Facebook - both of which require additional tags for full social share functionality. [Check out my 11ty Netlify Starter](https://11ty-netlify-jumpstart.netlify.app/) for full tags for these services.

```html
{%- set pageSocialImg %}{{ meta.url }}/previews/{{ title | slug }}.png{% endset
-%}
<meta property="og:image" content="{{pageSocialImg}}" />
<meta name="twitter:image" content="{{pageSocialImg}}" />
```

Note that the compiled image URL needs to be a full, _absolute_ URL in order to work correctly for the social services. In this example, taken from my 11ty Netlify Jumpstart, `meta.url` is defined in `_data/meta.js`, such as:

```js
module.exports = {
  url: process.env.URL || "http://localhost:8080",
};
```

Where the `env.URL` is provided by Netlify at build time. Your host may offer a similar option, or you may choose to hardcode your live URL into the tag.

## CLI Config Options

| Option       | Type                                                      | Default     |
| ------------ | --------------------------------------------------------- | ----------- |
| siteName     | string                                                    | 11ty Rocks! |
| outputDir    | string                                                    | \_site      |
| imageDir     | string                                                    | previews    |
| dataFile     | string                                                    | pages.json  |
| templatePath | string                                                    |             |
| stylesPath   | string                                                    |             |
| theme        | enum: 'blue' \| 'green' \| 'minimal' \| 'sunset' \| 'pop' | blue        |

## Config Examples

The defaults are setup to assume Eleventy build defaults. So, the images will be created in `_site/previews/` as png images, and expect your `pages.json` to live at the project root.

### Custom output directory

If you have set a custom `output` directory, then also update `outputDir`, ex: `--outputDir public`.

### Define theme to use

[Preview the predefined themes >](https://github.com/5t3ph/eleventy-plugin-social-images/tree/main/themes)

To select, from one of the predefined themes, pass `--theme [themename]` where `themename` is one of the following:

- blue (default)
- green
- minimal
- sunset
- pop

### Custom preview directory to output images

To define another name for your images to live, pass the directory name _without_ the output path, ex: `--imageDir img`.

Reminder: The images are _only_ created in your output directory since the process runs after the Eleventy build is complete.

### Custom style

To use your own stylesheet, create a CSS file anywhere in your project. Then, pass the path like `--stylesPath social/style.css`.

Your stylesheet will then be used _instead of_ the default one.

### Custom template

To use your own template, create an html file in your project. You may want to exclude it from Eleventy to prevent it being built as a page by adding it to `.eleventyignore` _or_ placing it outside of your customized input directory.

Then, pass the path like `--templatePath social/template.html`.

Your template will then be used _instead of_ the default one.

#### Important notes on custom templates

You must include an `h1` to be used as the hook to replace the title of the content. The rest of the template is up to you!

Include the following so that the stylesheet can be injected into the template:

```html
<style>
  {{ style }}
</style>
```

If you are _not_ customizing the entire stylesheet but would like to alter part of it, such as the `h1` size, you can add that singular style after `{{ style }}` to override the defaults thanks to the CSS cascade.

To use a custom template but keep using a predefined theme, add a `class` value on `<body>` with your preferred theme value.

### Custom template and style

You can pass both a custom template and stylesheet by defining both CLI options, ex. ` --templatePath social/template.html --stylesPath social/style.css`.

### Fully customized example

Since this full example includes style, the only option missing is `theme` since it would have no additional effect.

```bash
eleventy-social-images --siteName 'My Cool Site' --outputDir public --dataFile src/_generate/pages.json --previewDir imgs --templatePath social/template.html --stylesPath social/style.css"
```

## Colophon

Hi - I'm Stephanie Eckles ([@5t3ph](https://twitter.com)), creator of [11ty.Rocks](https://11ty.rocks) and the other resources compiled there.

**If you enjoy my work and use my projects**, please consider [buying me a coffee](https://www.buymeacoffee.com/moderncss).

This plugin is an adaptation for my solution originally [detailed in this blog post](https://dev.to/5t3ph/automated-social-sharing-images-with-puppeteer-11ty-and-netlify-22ln) and included in my [11ty Netlify Jumpstart](https://11ty-netlify-jumpstart.netlify.app/). It's in active use on my 11ty-based sites:

- [11ty.Rocks](https://11ty.rocks)
- [ModernCSS.dev](https://moderncss.dev)
- [StyleStage.dev](https://stylestage.dev)
- [ThinkDoBeCreate](https://thinkdobecreate.com)

## Credits

The included gradient themes inspired by [uiGradients](https://uigradients.com/)
